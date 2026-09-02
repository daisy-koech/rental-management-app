import { useEffect, useState } from "react";
import { Home as HomeIcon, MapPin, Users } from "lucide-react";
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
          <span className="property-eyebrow">PROPERTY INFORMATION</span>

          <h1>{property.name}</h1>

          <p className="property-address">
            <MapPin size={15} />
            {property.location}
          </p>

          <p className="property-hero-description">
            A comfortable residential property with the essentials close
            at hand and the day-to-day details kept simple.
          </p>
        </div>
      </section>

      {/* About the property */}
      <section className="property-introduction">
        <div className="property-section-label">ABOUT THE PROPERTY</div>

        <div className="property-introduction-content">
          <div className="property-introduction-heading">
            <HomeIcon size={22} className="intro-icon" />

            <h2>
              A place to live
              <br />
              and settle in.
            </h2>
          </div>

          <div>
            <p>
              {property.name} is a residential property located in{" "}
              {property.location}, with the everyday essentials within
              reach.
            </p>

            <p>
              Whether you're considering making it your home or already
              live here, this page gives you the information you need about
              the property and its surroundings.
            </p>
          </div>
        </div>
      </section>

      {/* Property facts */}
      <section className="property-facts-section">
        <div className="property-section-label">
          {property.name.toUpperCase()}, IN BRIEF
        </div>

        <h2>The details at a glance.</h2>

        <div className="property-facts">
          <div className="fact-card fact-card-filled">
            <MapPin size={18} />

            <span className="fact-label">Location</span>

            <span className="fact-value">{property.location}</span>

            <p>
              Conveniently located with shops, services and other
              everyday amenities nearby.
            </p>
          </div>

          <div className="fact-card">
            <Users size={18} />

            <span className="fact-label">Property type</span>

            <span className="fact-value">Residential</span>

            <p>
              A shared residential community with dedicated homes and
              spaces for its tenants.
            </p>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="property-closing">
        <span>{property.name}</span>

        <h2>
          A good place to call
          <br />
          home.
        </h2>

        <p>
          Find out more about the location, what's nearby and the
          information available to residents.
        </p>
      </section>
    </div>
  );
}

export default PropertyView;

