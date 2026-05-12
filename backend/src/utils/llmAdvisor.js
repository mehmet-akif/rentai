const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function generateAdvisorResponse({
  userRequest,
  combinedRequest,
  extractedCriteria,
  topListings
}) {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  const compactListings = topListings.map((item) => ({
    id: item._id,
    title: item.title,
    price: item.price,
    neighbourhood: item.neighbourhood,
    propertyType: item.propertyType,
    bedrooms: item.bedrooms,
    bathrooms: item.bathrooms,
    sqft: item.sqft,
    amenities: item.amenities,
    transitMinutes: item.transitMinutes,
    advisorScore: item.advisorScore
  }));

  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: `
You are RentAI, a helpful Toronto rental advisor.

The user may be continuing a conversation. Use the combined conversation request as context.

Latest user message:
${userRequest}

Combined conversation context:
${combinedRequest}

Extracted search criteria:
${JSON.stringify(extractedCriteria, null, 2)}

Top listing candidates:
${JSON.stringify(compactListings, null, 2)}

Write a friendly, conversational response.

Rules:
- Start with: "Sure, I’m happy to help."
- Mention the key criteria you used.
- Recommend the best 1-2 options from the provided listings only.
- If there is no perfect match, clearly say these are the closest available options.
- Explain trade-offs briefly.
- Do not invent listings.
- Keep it concise and natural.
`
  });

  return response.output_text;
}

module.exports = { generateAdvisorResponse };