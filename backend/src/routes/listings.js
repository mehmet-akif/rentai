const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Listing = require("../models/Listing");
const { calculateScore } = require("../utils/ranking");
const { generateListingInsight } = require("../utils/aiInsights");

router.get("/", async (req, res) => {
  try {
    const {
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      neighbourhood,
      search,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    let query = {};

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (bedrooms) query.bedrooms = Number(bedrooms);
    if (bathrooms) query.bathrooms = Number(bathrooms);

    if (neighbourhood) {
      query.neighbourhood = { $regex: neighbourhood, $options: "i" };
    }

    if (search) {
      query.$text = { $search: search };
    }

    const total = await Listing.countDocuments(query);

    let listingsQuery = Listing.find(query);

    if (sort === "price_asc") {
      listingsQuery = listingsQuery.sort({ price: 1 });
    } else if (sort === "price_desc") {
      listingsQuery = listingsQuery.sort({ price: -1 });
    } else {
      listingsQuery = listingsQuery.sort({ createdAt: -1 });
    }

    const listings = await listingsQuery.skip(skip).limit(limitNumber);

    const listingsWithScore = listings.map((listing) => ({
      ...listing.toObject(),
      matchScore: calculateScore(listing)
    }));

    if (sort === "best_match") {
      listingsWithScore.sort((a, b) => b.matchScore - a.matchScore);
    }

    res.json({
      total,
      page: pageNumber,
      limit: limitNumber,
      results: listingsWithScore
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id/insights", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid listing ID" });
    }

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const insight = await generateListingInsight(listing);

    res.json({
      listingId: listing._id,
      insight
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to generate listing insight"
    });
  }
});

router.get("/:id/similar", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid listing ID" });
    }

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const similarListings = await Listing.find({
      _id: { $ne: listing._id },
      neighbourhood: listing.neighbourhood,
      bedrooms: listing.bedrooms
    }).limit(3);

    res.json(similarListings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id/price-intelligence", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid listing ID" });
    }

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const sameBedroomListings = await Listing.find({
      _id: { $ne: listing._id },
      bedrooms: listing.bedrooms
    });

    const sameAreaListings = await Listing.find({
      _id: { $ne: listing._id },
      neighbourhood: listing.neighbourhood
    });

    const calculateAverage = (items) => {
      if (!items.length) return 0;
      const total = items.reduce((sum, item) => sum + item.price, 0);
      return Math.round(total / items.length);
    };

    const avgBedroomRent = calculateAverage(sameBedroomListings);
    const avgAreaRent = calculateAverage(sameAreaListings);

    const comparisonBase = avgAreaRent || avgBedroomRent || listing.price;
    const difference = listing.price - comparisonBase;
    const percentDifference = Math.round((difference / comparisonBase) * 100);

    let label = "Fair Price";

    if (percentDifference <= -10) {
      label = "Good Value";
    } else if (percentDifference >= 10) {
      label = "Potentially Overpriced";
    }

    res.json({
      listingId: listing._id,
      listingPrice: listing.price,
      avgBedroomRent,
      avgAreaRent,
      comparisonBase,
      difference,
      percentDifference,
      label,
      explanation:
        label === "Good Value"
          ? "This listing is priced below comparable rentals, which may make it a strong value option."
          : label === "Potentially Overpriced"
          ? "This listing is priced above comparable rentals, so renters may want to compare amenities, location, and transit access carefully."
          : "This listing is close to comparable market pricing based on the available dataset."
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid listing ID" });
    }

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.json({
      ...listing.toObject(),
      matchScore: calculateScore(listing)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const listing = await Listing.create(req.body);
    res.status(201).json(listing);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;