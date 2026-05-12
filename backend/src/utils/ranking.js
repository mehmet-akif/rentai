function calculateScore(listing) {
  let score = 0;

  if (listing.price <= 2200) score += 25;
  else if (listing.price <= 2800) score += 18;
  else if (listing.price <= 3500) score += 10;

  if (listing.transitMinutes <= 8) score += 25;
  else if (listing.transitMinutes <= 15) score += 15;
  else if (listing.transitMinutes <= 25) score += 8;

  if (listing.sqft >= 900) score += 18;
  else if (listing.sqft >= 700) score += 12;
  else if (listing.sqft >= 500) score += 6;

  if (listing.amenities?.includes("gym")) score += 8;
  if (listing.amenities?.includes("parking")) score += 8;
  if (listing.amenities?.includes("pet-friendly")) score += 8;
  if (listing.amenities?.includes("storage locker")) score += 7;
  if (listing.amenities?.includes("air conditioning")) score += 7;
  if (listing.amenities?.includes("pool")) score += 6;
  if (listing.amenities?.includes("laundry")) score += 6;
  if (listing.amenities?.includes("balcony")) score += 5;
  if (listing.amenities?.includes("concierge")) score += 5;
  if (listing.amenities?.includes("dishwasher")) score += 5;
  if (listing.amenities?.includes("bike storage")) score += 4;



  return Math.min(score, 100);
}

module.exports = { calculateScore };