import { useEffect, useRef, useState } from "react";
import { getListingInsights, getListings } from "../api/listingsApi";
import ListingCard from "../components/ListingCard";
import SearchFilters from "../components/SearchFilters";
import ListingsMap from "../components/ListingsMap";

function ListingsPage() {
  const [listings, setListings] = useState([]);
  const [total, setTotal] = useState(0);
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(false);
  const insightRef = useRef(null);

  const [filters, setFilters] = useState({
    search: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    bathrooms: "",
    sort: "best_match",
    page: 1,
    limit: 12
  });

  const fetchListings = async (customFilters = filters) => {
    setLoading(true);

    try {
      const data = await getListings(customFilters);
      setListings(data.results);
      setTotal(data.total);
    } catch (error) {
      console.error(error);
      alert("Failed to load listings");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const resetFilters = {
      ...filters,
      page: 1
    };

    setFilters(resetFilters);
    fetchListings(resetFilters);
  };

  const handlePageChange = (newPage) => {
    const updatedFilters = {
      ...filters,
      page: newPage
    };

    setFilters(updatedFilters);
    fetchListings(updatedFilters);
  };

  const handleInsight = async (id) => {
    try {
      const data = await getListingInsights(id);
      setInsight(data.insight);

      setTimeout(() => {
        insightRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }, 100);
    } catch (error) {
      console.error(error);
      alert("Failed to load insight");
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <div className="listings-page">
      <div className="listings-header">
        <div>
          <h1>Toronto Rental Listings</h1>
          <p>{total} rentals found</p>
        </div>
      </div>

      <div className="listings-layout">
        <aside className="filters-sidebar">
          <h3>Filters</h3>

          <SearchFilters
            filters={filters}
            setFilters={setFilters}
            onSearch={handleSearch}
          />

          <div className="sidebar-info">
            <h4>Smart Matching</h4>
          </div>
        </aside>

        <main className="listings-content">
          {listings.length > 0 && <ListingsMap listings={listings} />}

          {insight && (
            <div className="insight-box" ref={insightRef}>
              <h3>AI Insight</h3>
              <p>{insight}</p>
              <button onClick={() => setInsight("")}>Close</button>
            </div>
          )}

          {loading ? (
            <p>Loading listings...</p>
          ) : listings.length === 0 ? (
            <div className="empty-listings">
              <h2>No listings match your filters</h2>

              <p>
                Try increasing your budget, changing the neighbourhood,
                or removing one of the filters.
              </p>
            </div>
          ) : (
            <>
              <div className="listings-grid">
                {listings.map((listing) => (
                  <ListingCard
                    key={listing._id}
                    listing={listing}
                  />
                ))}
              </div>

              <div className="pagination">
                <button
                  disabled={filters.page === 1}
                  onClick={() => handlePageChange(filters.page - 1)}
                >
                  Previous
                </button>

                <span>Page {filters.page}</span>

                <button
                  disabled={filters.page * filters.limit >= total}
                  onClick={() => handlePageChange(filters.page + 1)}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default ListingsPage;