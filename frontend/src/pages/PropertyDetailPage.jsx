import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getListingById,
  getListingInsights,
  getSimilarListings,
  getPriceIntelligence
} from "../api/listingsApi";

function PropertyDetailPage() {
  const { id } = useParams();

  const [listing, setListing] = useState(null);
  const [insight, setInsight] = useState("");
  const [similarListings, setSimilarListings] = useState([]);
  const [priceIntel, setPriceIntel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  const fetchListing = async () => {
    try {
      const data = await getListingById(id);
      setListing(data);
      setSelectedImage(0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInsight = async () => {
    try {
      const data = await getListingInsights(id);
      setInsight(data.insight);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSimilarListings = async () => {
    try {
      const data = await getSimilarListings(id);
      setSimilarListings(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPriceIntelligence = async () => {
    try {
      const data = await getPriceIntelligence(id);
      setPriceIntel(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchListing();
    fetchInsight();
    fetchSimilarListings();
    fetchPriceIntelligence();
  }, [id]);

  if (loading) return <p className="page">Loading property...</p>;
  if (!listing) return <p className="page">Listing not found.</p>;

  const images = listing.imageUrls?.length ? listing.imageUrls : [listing.imageUrl];
  const isGoodValue = listing.price <= 2500;
  const transitLabel = listing.transitMinutes <= 10 ? "Strong" : "Moderate";

  return (
    <div className="property-page">
      <Link to="/listings" className="back-link">
        ← Back to listings
      </Link>

      <section className="property-hero-card">
        <div>
          <img
            src={images[selectedImage]}
            alt={listing.title}
            className="property-hero-image"
          />

          <div className="thumbnail-row">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="property"
                className={`thumbnail ${selectedImage === index ? "active-thumb" : ""}`}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>
        </div>

        <div className="property-hero-info">
          <p className="eyebrow">{listing.neighbourhood}</p>
          <h1>{listing.title}</h1>
          <p className="location">{listing.address}</p>

          <div className="property-price-row">
            <span>${listing.price}/month</span>
            <small>{listing.propertyType}</small>
          </div>
        </div>
      </section>

      <div className="property-layout">
        <main className="property-main">
          <section className="property-section">
            <h2>Property Overview</h2>

            <div className="property-facts">
              <div>
                <strong>{listing.bedrooms}</strong>
                <span>Bedrooms</span>
              </div>
              <div>
                <strong>{listing.bathrooms}</strong>
                <span>Bathrooms</span>
              </div>
              <div>
                <strong>{listing.sqft}</strong>
                <span>Square feet</span>
              </div>
              <div>
                <strong>{listing.transitMinutes}</strong>
                <span>Min transit</span>
              </div>
            </div>
          </section>

          <section className="property-section">
            <h2>Amenities</h2>
            <div className="amenities">
              {listing.amenities?.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </section>

          <section className="property-section">
            <h2>Description</h2>
            <p className="property-description">{listing.description}</p>
          </section>

          <section className="property-section">
            <h2>Similar Listings Nearby</h2>

            {similarListings.length === 0 ? (
              <p className="property-description">
                No similar listings found for this property yet.
              </p>
            ) : (
              <div className="similar-grid">
                {similarListings.map((item) => (
                  <Link
                    to={`/listings/${item._id}`}
                    className="similar-card"
                    key={item._id}
                  >
                    <img src={item.imageUrl} alt={item.title} />
                    <div>
                      <h4>{item.title}</h4>
                      <p>{item.neighbourhood}</p>
                      <strong>${item.price}/month</strong>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </main>

        <aside className="property-sidebar">
          <div className="sidebar-card">
            <h3>AI Rental Insight</h3>
            <p>{insight || "Generating insight..."}</p>
          </div>

          <div className="sidebar-card">
            <h3>Rental Summary</h3>

            <div className="score-card">
              <span>Smart Score</span>
              <strong>{listing.matchScore}</strong>
            </div>

            <div className="score-card">
              <span>Transit</span>
              <strong>{transitLabel}</strong>
            </div>

            <div className="score-card">
              <span>Value</span>
              <strong>{isGoodValue ? "Good" : "Premium"}</strong>
            </div>
          </div>

          <div className="sidebar-card">
            <h3>Price Intelligence</h3>

            {!priceIntel ? (
              <p>Analyzing market pricing...</p>
            ) : (
              <>
                <div className="score-card">
                  <span>Market Position</span>
                  <strong>{priceIntel.label}</strong>
                </div>

                <div className="score-card">
                  <span>Area Average</span>
                  <strong>${priceIntel.avgAreaRent || "N/A"}</strong>
                </div>

                <div className="score-card">
                  <span>Bedroom Average</span>
                  <strong>${priceIntel.avgBedroomRent || "N/A"}</strong>
                </div>

                <div className="score-card">
                  <span>Difference</span>
                  <strong>
                    {priceIntel.percentDifference > 0 ? "+" : ""}
                    {priceIntel.percentDifference}%
                  </strong>
                </div>

                <p className="property-description" style={{ marginTop: "14px" }}>
                  {priceIntel.explanation}
                </p>
              </>
            )}
          </div>

          <div className="sidebar-card">
            <h3>Contact Landlord</h3>
            <p>
              <strong>{listing.contactName}</strong>
            </p>
            <p>{listing.contactEmail}</p>
            <p>{listing.contactPhone}</p>

            <a
              className="email-button"
              href={`mailto:${listing.contactEmail}?subject=Rental inquiry: ${listing.title}`}
            >
              Email Landlord
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default PropertyDetailPage;