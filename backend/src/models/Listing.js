const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    title: String,
    price: Number,
    neighbourhood: String,
    address: String,
    bedrooms: Number,
    bathrooms: Number,
    sqft: Number,
    propertyType: String,
    amenities: [String],
    nearestStation: String,
    transitMinutes: Number,
    description: String,

    // NEW
    imageUrls: [String],
    contactName: String,
    contactEmail: String,
    contactPhone: String,
    latitude: Number,
    longitude: Number
  },
  { timestamps: true }
);

listingSchema.index({ price: 1 });
listingSchema.index({ bedrooms: 1 });
listingSchema.index({ neighbourhood: 1 });
listingSchema.index({ createdAt: -1 });
listingSchema.index({
  title: "text",
  neighbourhood: "text",
  amenities: "text"
});

module.exports = mongoose.model("Listing", listingSchema);