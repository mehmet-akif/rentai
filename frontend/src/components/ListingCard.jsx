import { Link } from "react-router-dom";
import { useState } from "react";

function ListingCard({ listing }) {
  const [saved, setSaved] = useState(() => {
    const existing = JSON.parse(localStorage.getItem("savedListings")) || [];
    return existing.some((item) => item._id === listing._id);
  });

  const toggleSave = (e) => {
    e.preventDefault();

    const existing = JSON.parse(localStorage.getItem("savedListings")) || [];

    if (!saved) {
      localStorage.setItem(
        "savedListings",
        JSON.stringify([...existing, listing])
      );
      setSaved(true);
    } else {
      const updated = existing.filter((item) => item._id !== listing._id);

      localStorage.setItem(
        "savedListings",
        JSON.stringify(updated)
      );

      setSaved(false);
    }
  };

  return (
    <div className="listing-card">
      <Link to={`/listings/${listing._id}`} className="card-link">
        <img
          src={listing.imageUrl}
          alt={listing.title}
          className="listing-image"
        />

        <div className="listing-content">
          <div>
            <h3>{listing.title}</h3>
            <p className="location">{listing.neighbourhood}</p>
          </div>

          <p className="price">${listing.price}/month</p>

          <div className="details">
            <span>{listing.bedrooms} bed</span>
            <span>{listing.bathrooms} bath</span>
            <span>{listing.sqft} sqft</span>
            <span>{listing.transitMinutes} min transit</span>
          </div>

          <div className="amenities">
            {listing.amenities?.slice(0, 4).map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>

          <p className="score">Smart Score: {listing.matchScore}</p>
        </div>
      </Link>

      <div className="card-actions">
        <Link
          to={`/listings/${listing._id}`}
          className="details-button"
        >
          View Details
        </Link>

        <button
          className={`bookmark-icon-btn ${saved ? "saved" : ""}`}
          onClick={toggleSave}
          title={saved ? "Remove from saved" : "Save listing"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill={saved ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default ListingCard;