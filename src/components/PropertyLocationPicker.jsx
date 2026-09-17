import { useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER = [0.5143, 35.2698];

const markerIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapClickHandler({ onLocationChange }) {
  useMapEvents({
    click(event) {
      onLocationChange(
        event.latlng.lat.toFixed(6),
        event.latlng.lng.toFixed(6)
      );
    },
  });

  return null;
}

function MapController({ position }) {
  const map = useMap();

  if (position) {
    map.setView(position);
  }

  return null;
}

function PropertyLocationPicker({
  latitude,
  longitude,
  onLocationChange,
}) {
  const hasCoordinates =
    latitude !== "" &&
    latitude !== null &&
    latitude !== undefined &&
    longitude !== "" &&
    longitude !== null &&
    longitude !== undefined;

  const [mode, setMode] = useState("map");
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const position = hasCoordinates
    ? [Number(latitude), Number(longitude)]
    : DEFAULT_CENTER;

  function handleLatitudeChange(value) {
    onLocationChange(value, longitude);
  }

  function handleLongitudeChange(value) {
    onLocationChange(latitude, value);
  }

  function handleMapLocationChange(newLatitude, newLongitude) {
    onLocationChange(newLatitude, newLongitude);
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
        `https://nominatim.openstreetmap.org/search?format=json&countrycodes=ke&limit=1&q=${encodeURIComponent(
          search.trim()
        )}`
      );

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const results = await response.json();

      if (!results.length) {
        setSearchError("Location not found. Try a more specific search.");
        return;
      }

      const result = results[0];

      onLocationChange(
        Number(result.lat).toFixed(6),
        Number(result.lon).toFixed(6)
      );
    } catch {
      setSearchError(
        "Unable to search for that location. Please try again."
      );
    } finally {
      setSearching(false);
    }
  }

  return (
    <div className="property-location-picker">
      <div className="location-method">
        <button
          type="button"
          className={`location-method-button ${
            mode === "map" ? "active" : ""
          }`}
          onClick={() => setMode("map")}
        >
          Pick on map
        </button>

        <button
          type="button"
          className={`location-method-button ${
            mode === "manual" ? "active" : ""
          }`}
          onClick={() => setMode("manual")}
        >
          Enter coordinates
        </button>
      </div>

      {mode === "map" && (
        <>
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
              placeholder="Search for your property..."
              disabled={searching}
            />

            <button
              type="submit"
              className="btn-secondary"
              disabled={searching || !search.trim()}
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
              zoom={15}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <MapController position={position} />

              <MapClickHandler
                onLocationChange={handleMapLocationChange}
              />

              {hasCoordinates && (
                <Marker
                  position={position}
                  icon={markerIcon}
                  draggable={true}
                  eventHandlers={{
                    dragend(event) {
                      const marker =
                        event.target;

                      const newPosition =
                        marker.getLatLng();

                      onLocationChange(
                        newPosition.lat.toFixed(6),
                        newPosition.lng.toFixed(6)
                      );
                    },
                  }}
                />
              )}
            </MapContainer>
          </div>

          <p className="map-instruction">
            Search for your property, then click the exact
            building on the map or drag the marker to the
            correct location.
          </p>
        </>
      )}

      {mode === "manual" && (
        <div className="manual-coordinates">
          <p className="form-hint">
            Enter the exact latitude and longitude of your
            property.
          </p>

          <div className="manual-coordinate-fields">
            <div className="form-group">
              <label htmlFor="property-latitude">
                Latitude
              </label>

              <input
                id="property-latitude"
                type="number"
                step="any"
                min="-90"
                max="90"
                value={latitude}
                onChange={(event) =>
                  handleLatitudeChange(
                    event.target.value
                  )
                }
                placeholder="e.g. 0.503600"
              />
            </div>

            <div className="form-group">
              <label htmlFor="property-longitude">
                Longitude
              </label>

              <input
                id="property-longitude"
                type="number"
                step="any"
                min="-180"
                max="180"
                value={longitude}
                onChange={(event) =>
                  handleLongitudeChange(
                    event.target.value
                  )
                }
                placeholder="e.g. 35.278900"
              />
            </div>
          </div>

          <p className="form-hint">
            Latitude must be between -90 and 90.
            Longitude must be between -180 and 180.
          </p>
        </div>
      )}

      {hasCoordinates && (
        <div className="selected-coordinates">
          <div>
            <span>Latitude</span>
            <strong>{latitude}</strong>
          </div>

          <div>
            <span>Longitude</span>
            <strong>{longitude}</strong>
          </div>
        </div>
      )}
    </div>
  );
}

export default PropertyLocationPicker;