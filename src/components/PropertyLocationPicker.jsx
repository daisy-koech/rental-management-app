import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icons when using Vite/React
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function MapCenter({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, 17);
    }
  }, [position, map]);

  return null;
}

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(event) {
      const newPosition = [
        event.latlng.lat,
        event.latlng.lng,
      ];

      setPosition(newPosition);
    },
  });

  if (!position) {
    return null;
  }

  return (
    <Marker
      position={position}
      draggable={true}
      eventHandlers={{
        dragend(event) {
          const marker = event.target;
          const location = marker.getLatLng();

          setPosition([
            location.lat,
            location.lng,
          ]);
        },
      }}
    />
  );
}

function PropertyLocationPicker({
  latitude,
  longitude,
  onLocationChange,
}) {
  const [search, setSearch] = useState("");
  const [position, setPosition] = useState(
    latitude !== "" && longitude !== ""
      ? [Number(latitude), Number(longitude)]
      : [-0.0917, 34.7680]
  );

  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  useEffect(() => {
    if (latitude !== "" && longitude !== "") {
      const newPosition = [
        Number(latitude),
        Number(longitude),
      ];

      setPosition(newPosition);
    }
  }, [latitude, longitude]);

  function handlePositionChange(newPosition) {
    setPosition(newPosition);

    onLocationChange(
      newPosition[0],
      newPosition[1]
    );
  }

  async function handleSearch(event) {
    event.preventDefault();

    if (!search.trim()) {
      return;
    }

    setSearching(true);
    setSearchError("");

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
          search
        )}`
      );

      if (!response.ok) {
        throw new Error("Location search failed.");
      }

      const results = await response.json();

      if (!results.length) {
        setSearchError(
          "Location not found. Try a more specific address."
        );
        return;
      }

      const result = results[0];

      const newPosition = [
        Number(result.lat),
        Number(result.lon),
      ];

      setPosition(newPosition);

      onLocationChange(
        newPosition[0],
        newPosition[1]
      );
    } catch {
      setSearchError(
        "Unable to search for that location."
      );
    } finally {
      setSearching(false);
    }
  }

  return (
    <div className="property-location-picker">
      <form
        className="location-search"
        onSubmit={handleSearch}
      >
        <input
          type="text"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search property location..."
        />

        <button
          type="submit"
          className="btn-secondary"
          disabled={searching}
        >
          {searching ? "Searching..." : "Search"}
        </button>
      </form>

      {searchError && (
        <p className="location-search-error">
          {searchError}
        </p>
      )}

      <div className="property-map">
        <MapContainer
          center={position}
          zoom={17}
          scrollWheelZoom={true}
          style={{
            width: "100%",
            height: "360px",
          }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapCenter position={position} />

          <LocationMarker
            position={position}
            setPosition={handlePositionChange}
          />
        </MapContainer>
      </div>

      <p className="map-instruction">
        Search for your property, then click the exact
        building on the map or drag the marker to the
        correct location.
      </p>

      <div className="selected-coordinates">
        <div>
          <span>Latitude</span>
          <strong>{position[0].toFixed(6)}</strong>
        </div>

        <div>
          <span>Longitude</span>
          <strong>{position[1].toFixed(6)}</strong>
        </div>
      </div>
    </div>
  );
}

export default PropertyLocationPicker;