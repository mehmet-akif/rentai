import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

function ListingsMap({ listings }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapRef = useRef(null);

  const validListings = listings.filter(
    (item) =>
      typeof item.latitude === "number" &&
      typeof item.longitude === "number"
  );

  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current.invalidateSize();
      }, 250);
    }
  }, [isFullscreen]);

  if (validListings.length === 0) {
    return null;
  }

  return (
    <div className={isFullscreen ? "map-wrapper fullscreen-map" : "map-wrapper"}>
      <button
        className="map-fullscreen-btn"
        onClick={() => setIsFullscreen(!isFullscreen)}
      >
        {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
      </button>

      <MapContainer
        ref={mapRef}
        center={[43.6532, -79.3832]}
        zoom={11}
        scrollWheelZoom={true}
        style={{ height: "320px", width: "100%", borderRadius: "22px" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {validListings.map((listing) => (
          <Marker
            key={listing._id}
            position={[listing.latitude, listing.longitude]}
          >
            <Popup>
              <a href={`/listings/${listing._id}`} className="map-popup-link">
                <img
                  src={listing.imageUrl}
                  alt={listing.title}
                  className="map-popup-image"
                />

                <strong>{listing.title}</strong>
                <span>{listing.neighbourhood}</span>
                <small>${listing.price}/month</small>
              </a>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default ListingsMap;