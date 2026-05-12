async function generateListingInsight(listing) {
  const value =
    listing.price <= 2500
      ? "This listing appears affordable compared with many Toronto rentals."
      : "This listing may be more expensive, so compare it with similar units nearby.";

  const transit =
    listing.transitMinutes <= 10
      ? "Transit access is strong, which is useful for commuting."
      : "Transit access may be less convenient, so commute time should be checked.";

  return `${value} ${transit} It may be a good fit for renters looking for a ${listing.bedrooms}-bedroom ${listing.propertyType} in ${listing.neighbourhood}.`;
}

module.exports = { generateListingInsight };