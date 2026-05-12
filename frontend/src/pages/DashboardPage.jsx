import { useEffect, useState } from "react";
import { getListings } from "../api/listingsApi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

function DashboardPage() {
  const [listings, setListings] = useState([]);
  const [neighbourhoodStats, setNeighbourhoodStats] = useState([]);
  const [bedroomStats, setBedroomStats] = useState([]);
  const [amenityStats, setAmenityStats] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await getListings({ limit: 150 });
      const items = data.results;
      setListings(items);

      const neighbourhoodGrouped = {};
      const bedroomGrouped = {};
      const amenityGrouped = {};

      items.forEach((item) => {
        if (!neighbourhoodGrouped[item.neighbourhood]) {
          neighbourhoodGrouped[item.neighbourhood] = { total: 0, count: 0 };
        }

        neighbourhoodGrouped[item.neighbourhood].total += item.price;
        neighbourhoodGrouped[item.neighbourhood].count += 1;

        const bedroomLabel = item.bedrooms === 0 ? "Studio" : `${item.bedrooms} Bed`;
        bedroomGrouped[bedroomLabel] = (bedroomGrouped[bedroomLabel] || 0) + 1;

        item.amenities?.forEach((amenity) => {
          amenityGrouped[amenity] = (amenityGrouped[amenity] || 0) + 1;
        });
      });

      const neighbourhoodResult = Object.entries(neighbourhoodGrouped)
        .map(([name, value]) => ({
          name,
          avgRent: Math.round(value.total / value.count),
          count: value.count
        }))
        .sort((a, b) => a.avgRent - b.avgRent);

      const bedroomResult = Object.entries(bedroomGrouped).map(([name, value]) => ({
        name,
        value
      }));

      const amenityResult = Object.entries(amenityGrouped)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);

      setNeighbourhoodStats(neighbourhoodResult);
      setBedroomStats(bedroomResult);
      setAmenityStats(amenityResult);
    };

    loadData();
  }, []);

  const avgRent =
    listings.length > 0
      ? Math.round(listings.reduce((sum, item) => sum + item.price, 0) / listings.length)
      : 0;

  const cheapestArea = neighbourhoodStats[0];
  const expensiveArea = neighbourhoodStats[neighbourhoodStats.length - 1];

  return (
    <div className="dashboard-page">
      <header className="dashboard-hero">
        <p className="eyebrow">Rental market analytics</p>
        <h1>Toronto Rental Intelligence Dashboard</h1>
        <p>
          Explore rental pricing, neighbourhood comparisons, bedroom distribution,
          and amenity trends from the RentAI dataset.
        </p>
      </header>

      <section className="kpi-grid">
        <div className="kpi-card">
          <span>Total Listings</span>
          <strong>{listings.length}</strong>
        </div>

        <div className="kpi-card">
          <span>Average Rent</span>
          <strong>${avgRent}</strong>
        </div>

        <div className="kpi-card">
          <span>Most Affordable Area</span>
          <strong>{cheapestArea?.name || "Loading"}</strong>
        </div>

        <div className="kpi-card">
          <span>Highest Rent Area</span>
          <strong>{expensiveArea?.name || "Loading"}</strong>
        </div>
      </section>

      <section className="dashboard-chart-grid">
        <div className="chart-card wide">
          <h3>Average Rent by Neighbourhood</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={neighbourhoodStats}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-25} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avgRent" fill="#2563eb" radius={[8, 8, 0, 0]} /> 
              </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Bedroom Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={bedroomStats}
                dataKey="value"
                nameKey="name"
                outerRadius={95}
                label
                stroke="#ffffff"
                strokeWidth={2}
              >
                {bedroomStats.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={["#2563eb", "#60a5fa", "#93c5fd", "#1e40af", "#38bdf8"][index % 5]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Top Amenities</h3>
          <div className="amenity-list">
            {amenityStats.map((item) => (
              <div className="amenity-row" key={item.name}>
                <span>{item.name}</span>
                <strong>{item.count}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;