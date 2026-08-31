import { useEffect, useState } from "react";
import {
  getLandlordProperty,
  createProperty,
  updateProperty,
} from "../../services/api";
import DashboardTabs from "../../components/DashboardTabs";
import "./LandlordPropertyView.css";

const TABS = [
  { label: "Overview", to: "/landlord", end: true },
  { label: "Property", to: "/landlord/property" },
  { label: "Units", to: "/landlord/units" },
  { label: "Maintenance", to: "/landlord/tickets" },
  { label: "Payments", to: "/landlord/payments" },
  { label: "Leases", to: "/landlord/leases" },
  { label: "Notices", to: "/landlord/notices" },
];

function LandlordPropertyView() {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    async function loadProperty() {
      try {
        const data = await getLandlordProperty();
        setProperty(data);
      } catch {
        setProperty(null);
      } finally {
        setLoading(false);
      }
    }

    loadProperty();
  }, []);

  function openForm() {
    setName(property?.name || "");
    setLocation(property?.location || "");
    setLatitude(property?.latitude ?? "");
    setLongitude(property?.longitude ?? "");
    setImageUrl(property?.image_url || "");
    setError("");
    setShowForm(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!name.trim() || !location.trim()) {
      setError("Property name and location are required.");
      return;
    }

    // latitude/longitude are required (not nullable) on the backend model.
    if (latitude === "" || longitude === "") {
      setError("Latitude and longitude are required.");
      return;
    }

    setSaving(true);
    setError("");

    const payload = {
      name: name.trim(),
      location: location.trim(),
      latitude: Number(latitude),
      longitude: Number(longitude),
      // Harmless to send even before the backend supports it —
      // Flask will just ignore the extra key until the column exists.
      image_url: imageUrl.trim() || null,
    };

    try {
      const result = property
        ? await updateProperty(payload)
        : await createProperty(payload);

      setProperty(result);
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="landlord-property-view">
        <h1>Property</h1>
        <DashboardTabs tabs={TABS} />
        <p>Loading property...</p>
      </div>
    );
  }

  return (
    <div className="landlord-property-view">
      <h1>Property</h1>
      <DashboardTabs tabs={TABS} />

      {error && <p className="error-message">{error}</p>}

      {!showForm && !property && (
        <div className="property-empty-state">
          <p>You haven't added your property yet.</p>
          <button type="button" className="btn-primary" onClick={openForm}>
            Add your property
          </button>
        </div>
      )}

      {!showForm && property && (
        <div className="property-summary-card">
          {property.image_url && (
            <img
              src={property.image_url}
              alt={property.name}
              className="property-summary-image"
            />
          )}
          <div className="property-summary-details">
            <h2>{property.name}</h2>
            <p className="property-summary-location">{property.location}</p>
            <p className="property-summary-coords">
              {property.latitude}, {property.longitude}
            </p>
            <button type="button" className="btn-secondary" onClick={openForm}>
              Edit property
            </button>
          </div>
        </div>
      )}

      {showForm && (
        <form className="property-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="property-name">Property name</label>
            <input
              id="property-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Cedar Court"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="property-location">Location</label>
            <input
              id="property-location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Elgon View, Eldoret"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="property-lat">Latitude</label>
              <input
                id="property-lat"
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="e.g. 0.5254"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="property-lng">Longitude</label>
              <input
                id="property-lng"
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="e.g. 35.2698"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="property-image">Photo URL (optional)</label>
            <input
              id="property-image"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
            />
            <p className="form-hint">
              Won't be saved yet until the backend supports it. See the model note.
            </p>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save property"}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setShowForm(false)}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default LandlordPropertyView;