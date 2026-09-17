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

/*
 * Move the map when a new location is selected.
 */
function MapController({ position, centerMap }) {
  const map = useMap();

  useEffect(() => {
    if (!centerMap || !position) {
      return;
    }

    map.flyTo(position, 17, {
      animate: true,
      duration: 0.8,
    });
  }, [map, position, centerMap]);

  return null;
}

/*
 * Handle clicking the map and dragging the marker.
 */
function LocationMarker({ position, onPositionChange }) {
  useMapEvents({
    click(event) {
      onPositionChange([
        event.latlng.lat,
        event.latlng.lng,
      ]);
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

          onPositionChange([
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
  /*
   * Determine initial position from existing
   * property coordinates.
   */
  const getInitialPosition = () => {
    if (
      latitude !== "" &&
      longitude !== "" &&
      latitude !== null &&
      longitude !== null
    ) {
      const lat = Number(latitude);
      const lng = Number(longitude);

      if (
        !Number.isNaN(lat) &&
        !Number.isNaN(lng)
      ) {
        return [lat, lng];
      }
    }

    // Default location: Eldoret, Kenya
    return [0.5143, 35.2698];
  };

  const [position, setPosition] =
    useState(getInitialPosition);

  const [method, setMethod] =
    useState("map");

  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const [manualLatitude, setManualLatitude] =
    useState(
      latitude !== "" && latitude !== null
        ? String(latitude)
        : ""
    );

  const [manualLongitude, setManualLongitude] =
    useState(
      longitude !== "" && longitude !== null
        ? String(longitude)
        : ""
    );

  const [manualError, setManualError] =
    useState("");

  const [centerMap, setCenterMap] =
    useState(false);

  /*
   * Update selected position.
   */
  function handlePositionChange(newPosition) {
    setPosition(newPosition);

    setCenterMap(true);

    setManualLatitude(
      newPosition[0].toFixed(6)
    );

    setManualLongitude(
      newPosition[1].toFixed(6)
    );

    onLocationChange(
      newPosition[0],
      newPosition[1]
    );
  }

  /*
   * Search for a location.
   */
  async function handleSearch(event) {
    event?.preventDefault();
    event?.stopPropagation();

    const query = search.trim();

    if (!query) {
      setSearchError(
        "Please enter a location to search."
      );
      return;
    }

    setSearching(true);
    setSearchError("");
    setCenterMap(false);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=ke&q=${encodeURIComponent(
          query
        )}`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Location search failed."
        );
      }

      const results = await response.json();

      if (!results.length) {
        setSearchError(
          "Location not found. Try a more specific address, estate, town, or landmark."
        );
        return;
      }

      const result = results[0];

      const lat = Number(result.lat);
      const lng = Number(result.lon);

      if (
        Number.isNaN(lat) ||
        Number.isNaN(lng)
      ) {
        throw new Error(
          "Invalid coordinates returned."
        );
      }

      handlePositionChange([lat, lng]);

      setSearch(
        result.display_name || query
      );
    } catch (error) {
      console.error(
        "Property location search error:",
        error
      );

      setSearchError(
        "Unable to search for that location. Please try again."
      );
    } finally {
      setSearching(false);
    }
  }

  /*
   * Search when Enter is pressed.
   */
  function handleSearchKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();

      handleSearch(event);
    }
  }

  /*
   * Switch between map and manual coordinate entry.
   */
  function handleMethodChange(newMethod) {
    setMethod(newMethod);
    setManualError("");
    setSearchError("");
  }

  /*
   * Apply manually entered coordinates.
   */
  function handleManualCoordinates() {
    setManualError("");

    const lat = Number(
      manualLatitude.trim()
    );

    const lng = Number(
      manualLongitude.trim()
    );

    if (
      manualLatitude.trim() === "" ||
      manualLongitude.trim() === ""
    ) {
      setManualError(
        "Please enter both latitude and longitude."
      );
      return;
    }

    if (
      Number.isNaN(lat) ||
      Number.isNaN(lng)
    ) {
      setManualError(
        "Latitude and longitude must be valid numbers."
      );
      return;
    }

    if (lat < -90 || lat > 90) {
      setManualError(
        "Latitude must be between -90 and 90."
      );
      return;
    }

    if (lng < -180 || lng > 180) {
      setManualError(
        "Longitude must be between -180 and 180."
      );
      return;
    }

    handlePositionChange([lat, lng]);

    setMethod("map");
  }

  return (
    <div className="property-location-picker">
      {/*Location method*/}

      <div className="location-method">
        <button
          type="button"
          className={
            method === "map"
              ? "location-method-button active"
              : "location-method-button"
          }
          onClick={() =>
            handleMethodChange("map")
          }
        >
          Pick on map
        </button>

        <button
          type="button"
          className={
            method === "manual"
              ? "location-method-button active"
              : "location-method-button"
          }
          onClick={() =>
            handleMethodChange("manual")
          }
        >
          Enter coordinates
        </button>
      </div>

      {/*Map method*/}

      {method === "map" && (
        <>
          <div className="location-search">
            <input
              type="text"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);

                if (searchError) {
                  setSearchError("");
                }
              }}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search estate, street, town or landmark..."
              disabled={searching}
              aria-label="Search property location"
            />

            <button
              type="button"
              className="btn-secondary"
              onClick={handleSearch}
              disabled={
                searching || !search.trim()
              }
            >
              {searching
                ? "Searching..."
                : "Search"}
            </button>
          </div>

          {searchError && (
            <p
              className="location-search-error"
              role="alert"
            >
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
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <MapController
                position={position}
                centerMap={centerMap}
              />

              <LocationMarker
                position={position}
                onPositionChange={
                  handlePositionChange
                }
              />
            </MapContainer>
          </div>

          <p className="map-instruction">
            <strong>How to select:</strong>{" "}
            Search for the area, then click directly
            on the building or drag the marker to the
            exact property location.
          </p>
        </>
      )}

      {/* Manual coordinates*/}

      {method === "manual" && (
        <div className="manual-coordinates">
          <p className="form-hint">
            If you already have the exact GPS
            coordinates, enter them below.
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
                value={manualLatitude}
                onChange={(event) =>
                  setManualLatitude(
                    event.target.value
                  )
                }
                placeholder="e.g. 0.514300"
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
                value={manualLongitude}
                onChange={(event) =>
                  setManualLongitude(
                    event.target.value
                  )
                }
                placeholder="e.g. 35.269800"
              />
            </div>
          </div>

          {manualError && (
            <p
              className="location-search-error"
              role="alert"
            >
              {manualError}
            </p>
          )}

          <button
            type="button"
            className="btn-secondary"
            onClick={handleManualCoordinates}
          >
            Use these coordinates
          </button>
        </div>
      )}

      {/*Selected coordinates*/}

      <div className="selected-coordinates">
        <div>
          <span>Latitude</span>
          <strong>
            {position[0].toFixed(6)}
          </strong>
        </div>

        <div>
          <span>Longitude</span>
          <strong>
            {position[1].toFixed(6)}
          </strong>
        </div>
      </div>

      <p className="form-hint">
        These coordinates will be saved with the
        property and used to show its location on
        the tenant map.
      </p>
    </div>
  );
}

export default PropertyLocationPicker;