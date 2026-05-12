import { useEffect, useState } from "react";
import ListingCard from "../components/ListingCard";

function SavedPage() {
  const [savedListings, setSavedListings] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedListings")) || [];
    setSavedListings(saved);
  }, []);

  const handleInsight = () => {
    alert("Open the listing detail page to view AI insight.");
  };

  const clearSaved = () => {
    localStorage.removeItem("savedListings");
    setSavedListings([]);
  };

  return (
    <div className="listings-page">
      <div className="listings-header saved-header">
        <div>
          <h1>Saved Listings</h1>
          <p>{savedListings.length} listings saved</p>
        </div>

        {savedListings.length > 0 && (
          <button onClick={clearSaved}>Clear Saved</button>
        )}
      </div>

      {savedListings.length === 0 ? (
        <div className="empty-state">
          <h2>No saved listings yet</h2>
          <p>Save listings while browsing to compare them later.</p>
        </div>
      ) : (
        <div className="listings-grid">
          {savedListings.map((listing) => (
            <ListingCard
              key={listing._id}
              listing={listing}
              onInsight={handleInsight}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedPage;