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
 * Moves the map when a new location is selected.
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
 * Handles clicking the map and dragging the marker.
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
   * Determine the initial marker position.
   *
   * If the property already has coordinates,
   * use them. Otherwise start around Eldoret.
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

    return [0.5143, 35.2698];
  };

  const [position, setPosition] =
    useState(getInitialPosition);

  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [centerMap, setCenterMap] = useState(false);

  /*
   * Update the selected position.
   */
  function handlePositionChange(newPosition) {
    setPosition(newPosition);
    setCenterMap(true);

    onLocationChange(
      newPosition[0],
      newPosition[1]
    );
  }

  /*
   * Search for a location using OpenStreetMap.
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
        throw new TypeError(
          "Invalid coordinates returned."
        );
      }

      /*
       * Move marker to search result.
       */
      setPosition([lat, lng]);

      /*
       * Save coordinates in parent state.
       */
      onLocationChange(lat, lng);

      /*
       * Tell the map to move to the new location.
       */
      setCenterMap(true);

      /*
       * Display the location that was found.
       */
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
   * Search when Enter is pressed without
   * submitting the main property form.
   */
  function handleSearchKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();

      handleSearch(event);
    }
  }

  return (
    <div className="property-location-picker">
      {/* Search */}

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

      {/* Search error */}

      {searchError && (
        <p
          className="location-search-error"
          role="alert"
        >
          {searchError}
        </p>
      )}

      {/* Map */}

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

      {/* Instructions */}

      <p className="map-instruction">
        <strong>How to select your property:</strong>{" "}
        Search for the area first. Then click directly
        on your building or drag the marker to the exact
        property location.
      </p>

      {/* Coordinates */}

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
        The selected location will be saved with your
        property and used to show its position on the
        tenant map.
      </p>
    </div>
  );
}

export default PropertyLocationPicker;