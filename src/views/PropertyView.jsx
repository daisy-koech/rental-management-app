import { useEffect, useState } from "react";
import { getPublicProperty } from "../services/api";
import "./PropertyView.css";

function PropertyView() {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getPublicProperty()
    .then(setProperty)
    .catch((err) => setError(err.message))
    .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="property-view">
        <p>Loading property...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="property-view">
        <p className="empty-text">
          Property information isn't available yet.
        </p>
      </div>
    );
  }

  return (
    <div className="property-view">
      {/* Hero */}
      <section className="property-hero">
        {property.image_url && (
          <img
            src={property.image_url}
            alt={property.name}
            className="property-hero-image"
          />
        )}

        <div className="property-hero-content">
          <span className="property-eyebrow">WELCOME HOME</span>
          <h1>{property.name}</h1>
          <p className="property-address">{property.location}</p>
          <p className="property-hero-description">
            A comfortable residential community designed for
            everyday living, with everything you need close to home.
          </p>
        </div>
      </section>

      {/* About the property */}
      <section className="property-introduction">
        <div className="property-section-label">ABOUT THE PROPERTY</div>

        <div className="property-introduction-content">
          <div>
            <h2>
              A place that feels
              <br />
              like home.
            </h2>
          </div>

          <div>
            <p>
              {property.name} brings together comfortable homes,
              a welcoming environment and the convenience of
              having the essentials of everyday life within reach.
            </p>
            <p>
              Whether you are looking for your first home,
              somewhere closer to work or simply a place where
              you can settle down, {property.name} offers a practical
              space to make your own.
            </p>
          </div>
        </div>
      </section>

      {/* Property facts */}
      <section className="property-facts-section">
        <div className="property-section-label">
          {property.name.toUpperCase()} AT A GLANCE
        </div>

        <h2>Everything starts with a good place to live.</h2>

        <div className="property-facts">
          <div>
            <span className="fact-label">Location</span>
            <span className="fact-value">{property.location}</span>
            <p>Conveniently located for everyday travel and errands.</p>
          </div>

          <div>
            <span className="fact-label">Community</span>
            <span className="fact-value">Residential</span>
            <p>A comfortable setting for individuals and families.</p>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="property-closing">
        <span>{property.name}</span>
        <h2>
          Find your place.
          <br />
          Make it home.
        </h2>
        <p>
          A comfortable home, a convenient location and a place
          to build your everyday life.
        </p>
      </section>
    </div>
  );
}

export default PropertyView;
