import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { property, nearbyPlaces } from "../data/mockData";
import AmenityCard from "../components/AmenityCard";
import "./AreaView.css";

function AreaView() {
  const position = [property.latitude, property.longitude];

  return (
    <div className="area-view">
      <h1>The area</h1>
      <p className="area-address">{property.address}</p>

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
      <div className="amenities-list">
        {nearbyPlaces.map((place) => (
          <AmenityCard key={place.name} amenity={place} />
        ))}
      </div>
    </div>
  );
}

export default AreaView;


