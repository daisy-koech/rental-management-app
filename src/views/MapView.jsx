import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./MapView.css";

function MapView({ location }) {
  if (!location) {
    return (
      <div className="map-view">
        <h1>Map</h1>
        <p>Search for an area first.</p>
      </div>
    );
  }

  // Leaflet expects the map position as [latitude, longitude].
  const position = [location.latitude, location.longitude];

  return (
    <div className="map-view">
      <h1>Map</h1>

      <p className="map-location-name">
        {location.areaName}
      </p>

      <div className="map-container">
        {/* Create the interactive Leaflet map and center it on the searched area */}
        <MapContainer center={position} zoom={14}>

        {/* OpenStreetMap tiles as the map's visual background */}
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={position}>
            <Popup>
              {location.areaName}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}

export default MapView;


