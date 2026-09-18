import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import AmenityCard from "../components/AmenityCard";
import "./AreaView.css";

const API_URL = "https://rental-management-app-api.onrender.com";

function transformNearbyAmenities(data) {
  const categories = data.nearby_amenities || {};

  const categoryTypes = {
    schools: "school",
    hospitals: "hospital",
    clinics: "hospital",
    pharmacies: "pharmacy",
    supermarkets: "market",
    transport: "transport",
  };

  return Object.entries(categories).flatMap(
    ([category, places]) =>
      (places || []).map((place, index) => ({
        id: `${category}-${index}-${place.name}`,
        name: place.name,
        type: categoryTypes[category] || "other",
        distance_km: place.distance_km,
      }))
  );
}

function AreaView() {
  const [property, setProperty] = useState(null);
  const [nearbyAmenities, setNearbyAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [amenitiesLoading, setAmenitiesLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProperty() {
      try {
        const response = await fetch(`${API_URL}/property/public`);

        if (!response.ok) {
          throw new Error("Failed to load property.");
        }

        const data = await response.json();
        setProperty(data);
      } catch (err) {
        console.error("Property loading failed:", err);
        setError("Unable to load property information.");
      } finally {
        setLoading(false);
      }
    }

    loadProperty();
  }, []);

  useEffect(() => {
    async function loadNearbyAmenities() {
      try {
        const response = await fetch(
          `${API_URL}/property/nearby-amenities`
        );

        if (!response.ok) {
          throw new Error("Failed to load nearby amenities.");
        }

        const data = await response.json();

        console.log("Nearby amenities:", data);

        setNearbyAmenities(transformNearbyAmenities(data));
      } catch (err) {
        console.error("Nearby amenities loading failed:", err);
      } finally {
        setAmenitiesLoading(false);
      }
    }

    loadNearbyAmenities();
  }, []);

  if (loading) {
    return (
      <div className="area-view">
        <h1>The area</h1>
        <p>Loading property information...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="area-view">
        <h1>The area</h1>
        <p>{error || "Property information unavailable."}</p>
      </div>
    );
  }

  const position = [property.latitude, property.longitude];

  return (
    <div className="area-view">
      <h1>The area</h1>

      <p className="area-address">
        {property.location}
      </p>

      <div className="map-container">
        <MapContainer center={position} zoom={15}>
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={position}>
            <Popup>{property.name}</Popup>
          </Marker>
        </MapContainer>
      </div>

      <h2>Nearby</h2>

      {amenitiesLoading && (
        <p>Loading nearby amenities...</p>
      )}

      {!amenitiesLoading && nearbyAmenities.length === 0 && (
        <p>No nearby amenities found.</p>
      )}

      {!amenitiesLoading && nearbyAmenities.length > 0 && (
        <div className="amenities-list">
          {nearbyAmenities.map((place) => (
            <AmenityCard
              key={place.id}
              amenity={place}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AreaView;

