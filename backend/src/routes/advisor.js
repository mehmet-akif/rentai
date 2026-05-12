const express = require("express");
const router = express.Router();

const Listing = require("../models/Listing");
const { calculateScore } = require("../utils/ranking");
const { generateAdvisorResponse } = require("../utils/llmAdvisor");

function normalizeText(text = "") {
  return text.toLowerCase();
}

function extractBudget(text, fallbackBudget = 3000) {
  const underMatch = text.match(
    /(?:under|below|max|maximum|less than|less then)\s*\$?\s*([1-9][0-9]{3})/
  );

  const normalMatch = text.match(/\$?\b([1-9][0-9]{3})\b/);

  if (underMatch) return Number(underMatch[1]);
  if (normalMatch) return Number(normalMatch[1]);

  return Number(fallbackBudget);
}

function extractBedrooms(text) {
  const atLeastMatch = text.match(
    /(?:at least|min|minimum)\s*(\d+)\s*(bed|bedroom)/
  );

  const exactMatch = text.match(/(\d+)\s*(bed|bedroom)/);

  if (atLeastMatch) {
    return { value: Number(atLeastMatch[1]), type: "minimum" };
  }

  if (exactMatch) {
    return { value: Number(exactMatch[1]), type: "exact" };
  }

  return null;
}

function extractBathrooms(text) {
  const match = text.match(/(\d+)\s*(bath|bathroom)/);
  return match ? Number(match[1]) : null;
}

function extractNeighbourhood(text) {
  const areas = [
    "downtown toronto",
    "north york",
    "scarborough",
    "etobicoke",
    "the annex",
    "liberty village",
    "yonge and eglinton",
    "kensington market",
    "queen west",
    "leslieville",
    "high park",
    "yorkville",
    "danforth",
    "roncesvalles"
  ];

  return areas.find((area) => text.includes(area));
}

function extractPropertyType(text) {
  if (text.includes("condo")) return "Condo";
  if (text.includes("apartment")) return "Apartment";
  if (text.includes("basement")) return "Basement";
  if (text.includes("townhouse") || text.includes("town house")) return "Townhouse";
  if (text.includes("studio")) return "Studio";
  if (text.includes("house") || text.includes("home")) return "Townhouse";

  return null;
}

function extractMustHaveAmenities(text) {
  const amenities = [];

  if (text.includes("gym")) amenities.push("gym");
  if (text.includes("parking") || text.includes("garage")) amenities.push("parking");
  if (text.includes("pet") || text.includes("cat") || text.includes("dog")) {
    amenities.push("pet-friendly");
  }

  if (
    text.includes("pool") &&
    !text.includes("no pool") &&
    !text.includes("dont want pool") &&
    !text.includes("don't want pool") &&
    !text.includes("avoid pool")
  ) {
    amenities.push("pool");
  }

  if (text.includes("laundry")) amenities.push("laundry");
  if (text.includes("balcony")) amenities.push("balcony");
  if (text.includes("dishwasher")) amenities.push("dishwasher");
  if (text.includes("storage")) amenities.push("storage locker");

  return [...new Set(amenities)];
}

function extractAvoidAmenities(text) {
  const avoid = [];

  if (
    text.includes("no pool") ||
    text.includes("dont want pool") ||
    text.includes("don't want pool") ||
    text.includes("avoid pool")
  ) {
    avoid.push("pool");
  }

  return [...new Set(avoid)];
}

function buildCombinedRequest(preferences, conversation = []) {
  const recentUserMessages = conversation
    .filter((msg) => msg.sender === "user")
    .map((msg) => msg.text)
    .slice(-4);

  return [...recentUserMessages, preferences].join(" ");
}

function buildBaseQuery({
  finalBudget,
  bedroomRequirement,
  extractedBathrooms,
  neighbourhood,
  propertyType,
  mustHaveAmenities,
  avoidAmenities,
  includeBudget = true,
  includeNeighbourhood = true,
  includePropertyType = true,
  includeMustHaveAmenities = true
}) {
  const query = {};

  if (includeBudget) {
    query.price = { $lte: finalBudget };
  }

  if (bedroomRequirement) {
    query.bedrooms =
      bedroomRequirement.type === "minimum"
        ? { $gte: bedroomRequirement.value }
        : bedroomRequirement.value;
  }

  if (extractedBathrooms !== null) {
    query.bathrooms = extractedBathrooms;
  }

  if (includeNeighbourhood && neighbourhood) {
    query.neighbourhood = {
      $regex: neighbourhood,
      $options: "i"
    };
  }

  if (includePropertyType && propertyType) {
    query.propertyType = propertyType;
  }

  if (
    (includeMustHaveAmenities && mustHaveAmenities.length > 0) ||
    avoidAmenities.length > 0
  ) {
    query.amenities = {};

    if (includeMustHaveAmenities && mustHaveAmenities.length > 0) {
      query.amenities.$all = mustHaveAmenities;
    }

    if (avoidAmenities.length > 0) {
      query.amenities.$nin = avoidAmenities;
    }
  }

  return query;
}

function scoreListings({
  listings,
  finalBudget,
  bedroomRequirement,
  extractedBathrooms,
  neighbourhood,
  propertyType,
  mustHaveAmenities,
  avoidAmenities,
  prefText,
  isExactMatch = false
}) {
  return listings
    .map((listing) => {
      let score = calculateScore(listing);

      if (isExactMatch) score += 500;

      if (listing.price <= finalBudget) score += 25;
      if (listing.price <= finalBudget * 0.9) score += 15;
      if (listing.price > finalBudget) score -= 30;

      if (bedroomRequirement) {
        if (
          bedroomRequirement.type === "exact" &&
          listing.bedrooms === bedroomRequirement.value
        ) {
          score += 70;
        }

        if (
          bedroomRequirement.type === "minimum" &&
          listing.bedrooms >= bedroomRequirement.value
        ) {
          score += 70;
        }

        if (
          bedroomRequirement.type === "exact" &&
          listing.bedrooms !== bedroomRequirement.value
        ) {
          score -= 80;
        }
      }

      if (extractedBathrooms !== null) {
        if (listing.bathrooms === extractedBathrooms) score += 30;
        else score -= 25;
      }

      if (neighbourhood) {
        if (listing.neighbourhood?.toLowerCase() === neighbourhood) score += 70;
        else score -= 35;
      }

      if (propertyType) {
        if (listing.propertyType === propertyType) score += 55;
        else score -= 35;
      }

      mustHaveAmenities.forEach((amenity) => {
        if (listing.amenities?.includes(amenity)) score += 35;
        else score -= 35;
      });

      avoidAmenities.forEach((amenity) => {
        if (listing.amenities?.includes(amenity)) score -= 120;
      });

      if (prefText.includes("student")) {
        if (listing.price <= finalBudget * 0.9) score += 15;
        if (listing.transitMinutes <= 12) score += 15;
      }

      if (
        prefText.includes("subway") ||
        prefText.includes("transit") ||
        prefText.includes("commute") ||
        prefText.includes("campus") ||
        prefText.includes("school") ||
        prefText.includes("university")
      ) {
        if (listing.transitMinutes <= 10) score += 30;
      }

      if (prefText.includes("kids") || prefText.includes("family")) {
        if (listing.bedrooms >= 3) score += 35;
        if (listing.sqft >= 850) score += 15;
      }

      return {
        ...listing.toObject(),
        advisorScore: score,
        matchCategory: isExactMatch ? "Exact Match" : "Similar Recommendation"
      };
    })
    .sort((a, b) => b.advisorScore - a.advisorScore);
}

function buildCriteriaSummary(criteria) {
  const parts = [`budget: $${criteria.budget}`];

  if (criteria.neighbourhood) parts.push(`area: ${criteria.neighbourhood}`);

  if (criteria.bedrooms) {
    parts.push(
      `bedrooms: ${
        criteria.bedrooms.type === "minimum" ? "at least " : ""
      }${criteria.bedrooms.value}`
    );
  }

  if (criteria.bathrooms) parts.push(`bathrooms: ${criteria.bathrooms}`);
  if (criteria.propertyType) parts.push(`property type: ${criteria.propertyType}`);

  if (criteria.mustHaveAmenities.length) {
    parts.push(`must-have amenities: ${criteria.mustHaveAmenities.join(", ")}`);
  }

  if (criteria.avoidAmenities.length) {
    parts.push(`avoiding: ${criteria.avoidAmenities.join(", ")}`);
  }

  return parts.join(", ");
}

function removeDuplicateListings(listings) {
  const seen = new Set();

  return listings.filter((listing) => {
    const id = listing._id?.toString();

    if (seen.has(id)) return false;

    seen.add(id);
    return true;
  });
}

router.post("/", async (req, res) => {
  try {
    const { budget, bedrooms, preferences, conversation = [] } = req.body;

    const latestText = normalizeText(preferences || "");
    const combinedRequest = buildCombinedRequest(preferences, conversation);
    const prefText = normalizeText(combinedRequest);

    const finalBudget = extractBudget(prefText, budget || 3000);
    let bedroomRequirement = extractBedrooms(latestText) || extractBedrooms(prefText);
    const extractedBathrooms = extractBathrooms(latestText) || extractBathrooms(prefText);
    const neighbourhood = extractNeighbourhood(latestText) || extractNeighbourhood(prefText);
    const propertyType = extractPropertyType(latestText) || extractPropertyType(prefText);
    const mustHaveAmenities = extractMustHaveAmenities(prefText);
    const avoidAmenities = extractAvoidAmenities(prefText);

    if (!bedroomRequirement && bedrooms !== undefined && bedrooms !== "") {
      bedroomRequirement = {
        value: Number(bedrooms),
        type: "exact"
      };
    }

    const extractedCriteria = {
      budget: finalBudget,
      bedrooms: bedroomRequirement,
      bathrooms: extractedBathrooms,
      neighbourhood,
      propertyType,
      mustHaveAmenities,
      avoidAmenities
    };

    const strictQuery = buildBaseQuery({
      finalBudget,
      bedroomRequirement,
      extractedBathrooms,
      neighbourhood,
      propertyType,
      mustHaveAmenities,
      avoidAmenities
    });

    const exactListingsRaw = await Listing.find(strictQuery).limit(100);

    const exactListings = scoreListings({
      listings: exactListingsRaw,
      finalBudget,
      bedroomRequirement,
      extractedBathrooms,
      neighbourhood,
      propertyType,
      mustHaveAmenities,
      avoidAmenities,
      prefText,
      isExactMatch: true
    }).slice(0, 3);

    let similarListings = [];

    if (exactListings.length < 3) {
      const relaxedBudgetQuery = {
        ...strictQuery,
        price: { $lte: finalBudget + 500 }
      };

      const relaxedBudgetRaw = await Listing.find(relaxedBudgetQuery).limit(100);

      const similarQuery = buildBaseQuery({
        finalBudget: finalBudget + 500,
        bedroomRequirement,
        extractedBathrooms,
        neighbourhood,
        propertyType,
        mustHaveAmenities,
        avoidAmenities,
        includeBudget: true,
        includeNeighbourhood: false,
        includePropertyType: false,
        includeMustHaveAmenities: false
      });

      const similarRaw = await Listing.find(similarQuery).limit(100);

      const exactIds = new Set(exactListings.map((listing) => listing._id.toString()));

      const combinedSimilarRaw = removeDuplicateListings([
        ...relaxedBudgetRaw,
        ...similarRaw
      ]).filter((listing) => !exactIds.has(listing._id.toString()));

      similarListings = scoreListings({
        listings: combinedSimilarRaw,
        finalBudget,
        bedroomRequirement,
        extractedBathrooms,
        neighbourhood,
        propertyType,
        mustHaveAmenities,
        avoidAmenities,
        prefText,
        isExactMatch: false
      }).slice(0, 5 - exactListings.length);
    }

    const rankedListings = [...exactListings, ...similarListings].slice(0, 5);

    let matchType = "exact";

    if (exactListings.length === 0 && similarListings.length > 0) {
      matchType = "similar_only";
    } else if (exactListings.length > 0 && similarListings.length > 0) {
      matchType = "exact_plus_similar";
    }

    const criteriaSummary = buildCriteriaSummary(extractedCriteria);

    let fallbackRecommendation;

    if (!rankedListings.length) {
      fallbackRecommendation = `Sure, I’m happy to help. I searched based on ${criteriaSummary}, but I could not find strong matches in the current dataset.

Try increasing your budget, relaxing the property type, or choosing a nearby neighbourhood.`;
    } else if (matchType === "exact") {
      fallbackRecommendation = `Sure, I’m happy to help. I searched based on ${criteriaSummary}.

I found ${exactListings.length} exact match${exactListings.length === 1 ? "" : "es"} that fit your request.

The best match is "${rankedListings[0].title}".`;
    } else if (matchType === "exact_plus_similar") {
      fallbackRecommendation = `Sure, I’m happy to help. I searched based on ${criteriaSummary}.

I found ${exactListings.length} exact match${exactListings.length === 1 ? "" : "es"} that fit your request. I also added similar recommendations below in case you want more options.

The best exact match is "${exactListings[0].title}".`;
    } else {
      fallbackRecommendation = `Sure, I’m happy to help. I searched based on ${criteriaSummary}.

I could not find an exact match for every requirement, so I added similar recommendations based on your closest available options.

The closest recommendation is "${rankedListings[0].title}".`;
    }

    let llmRecommendation = null;

    try {
      llmRecommendation = await generateAdvisorResponse({
        userRequest: preferences,
        combinedRequest,
        extractedCriteria: {
          ...extractedCriteria,
          matchType,
          exactMatchCount: exactListings.length,
          similarMatchCount: similarListings.length
        },
        topListings: rankedListings
      });
    } catch (error) {
      console.error("LLM advisor failed:", error.message);
    }

    res.json({
      request: extractedCriteria,
      matchType,
      exactMatchCount: exactListings.length,
      similarMatchCount: similarListings.length,
      recommendation: llmRecommendation || fallbackRecommendation,
      topListings: rankedListings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;