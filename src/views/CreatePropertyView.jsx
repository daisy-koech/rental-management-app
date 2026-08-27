import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProperty } from "../services/api";
import "./LoginView.css";

function CreatePropertyView() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await createProperty(
        name,
        location,
        parseFloat(latitude),
        parseFloat(longitude)
      );
      navigate("/landlord");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-view">
      <div className="login-card">
        <span className="login-eyebrow">GET STARTED</span>
        <h1>Add your property</h1>
        <p className="login-subtitle">
          Set up your property before adding units.
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label htmlFor="name">Property name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="location">Location</label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="latitude">Latitude</label>
            <input
              id="latitude"
              type="number"
              step="any"
              value={latitude}
              onChange={(event) => setLatitude(event.target.value)}
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="longitude">Longitude</label>
            <input
              id="longitude"
              type="number"
              step="any"
              value={longitude}
              onChange={(event) => setLongitude(event.target.value)}
              required
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button
            type="submit"
            className="btn-primary login-submit"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Property"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePropertyView;
