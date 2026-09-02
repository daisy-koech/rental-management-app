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
          <span className="property-eyebrow">STEP INSIDE</span>
          <h1>{property.name}</h1>
          <p className="property-address">{property.location}</p>
          <p className="property-hero-description">
            A residential property with more attention paid to the
            details than the address alone lets on.
          </p>
        </div>
      </section>

      {/* About the property */}
      <section className="property-introduction">
        <div className="property-section-label">THE PLACE ITSELF</div>

        <div className="property-introduction-content">
          <div>
            <h2>
              Built for living,
              <br />
              not just leasing.
            </h2>
          </div>

          <div>
            <p>
              {property.name} isn't trying to be flashy. It's trying to
              be somewhere you don't mind coming back to at the end of
              a long day.
            </p>
            <p>
              If you're looking, or you already live here, this page is
              the honest version: where it is, what's around, and who
              to talk to about the rest.
            </p>
          </div>
        </div>
      </section>

      {/* Property facts */}
      <section className="property-facts-section">
        <div className="property-section-label">
          {property.name.toUpperCase()}, IN BRIEF
        </div>

        <h2>A few things worth knowing.</h2>

        <div className="property-facts">
          <div>
            <span className="fact-label">Location</span>
            <span className="fact-value">{property.location}</span>
            <p>Close enough to the essentials that you stop thinking about the commute.</p>
          </div>

          <div>
            <span className="fact-label">Community</span>
            <span className="fact-value">Residential</span>
            <p>Neighbours, not strangers passing through.</p>
          </div>
        </div>
      </section>

      <section className="property-closing">
        <span>{property.name}</span>
        <h2>
          This is the part where you
          <br />
          stop scrolling and go see it.
        </h2>
        <p>
          An address is just information until you've stood in the
          doorway. {property.name} is worth the trip.
        </p>
      </section>
    </div>
  );
}

export default PropertyView;
