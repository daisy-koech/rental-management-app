import { useEffect, useState } from "react";
import {
  Home as HomeIcon,
  Building2,
  User,
  Mail,
  Phone,
  Layers3,
} from "lucide-react";
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
          <span className="property-eyebrow">THE PROPERTY</span>

          <h1>{property.name}</h1>

          <p className="property-hero-description">
            {property.description || "Property information coming soon."}
          </p>
        </div>
      </section>

      {/* About */}
      <section className="property-introduction">
        <div className="property-section-label">
          ABOUT THE PROPERTY
        </div>

        <div className="property-introduction-content">
          <div className="property-introduction-heading">
            <HomeIcon size={22} className="intro-icon" />

            <h2>
              {property.name}
              <br />
              in {property.location}.
            </h2>
          </div>

          <div>
            <p>
              {property.description ||
                "Property information coming soon."}
            </p>

            <p>
              {property.number_of_units
                ? `${property.name} currently has ${property.number_of_units} rental units.`
                : "Property unit information coming soon."}
            </p>
          </div>
        </div>
      </section>

      {/* Property details */}
      <section className="property-facts-section">
        <div className="property-section-label">
          PROPERTY DETAILS
        </div>

        <h2>Property information at a glance.</h2>

        <div className="property-facts">
          {/* Property type */}
          <div className="fact-card">
            <Building2 size={20} className="fact-icon" />

            <span className="fact-label">PROPERTY TYPE</span>

            <span className="fact-value">
              {property.property_type || "Not specified"}
            </span>

            <p>
              The type of property being managed.
            </p>
          </div>

          {/* Units */}
          <div className="fact-card">
            <Layers3 size={20} className="fact-icon" />

            <span className="fact-label">UNITS</span>

            <span className="fact-value">
              {property.number_of_units ?? "Not specified"}
            </span>

            <p>
              Rental units currently associated with the property.
            </p>
          </div>

          {/* Tenancy */}
          <div className="fact-card">
            <HomeIcon size={20} className="fact-icon" />

            <span className="fact-label">TENANCY</span>

            <span className="fact-value">
              {property.tenancy_type || "Not specified"}
            </span>

            <p>
              The tenancy arrangement used for the property.
            </p>
          </div>

          {/* Property manager */}
          <div className="fact-card fact-card-filled">
            <User size={20} className="fact-icon" />

            <span className="fact-label">PROPERTY MANAGER</span>

            <span className="fact-value">
              {property.manager?.name || "Property Manager"}
            </span>

            <div className="fact-contact">
              {property.manager?.email && (
                <a href={`mailto:${property.manager.email}`}>
                  <Mail size={15} />
                  {property.manager.email}
                </a>
              )}

              {property.manager?.phone && (
                <a
                  href={`tel:${property.manager.phone.replace(
                    /\s/g,
                    ""
                  )}`}
                >
                  <Phone size={15} />
                  {property.manager.phone}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Living here */}
      <section className="property-details">
        <div className="property-details-heading">
          <span className="property-section-label">
            LIVING HERE
          </span>

          <h2>
            The everyday details
            <br />
            matter.
          </h2>
        </div>

        <div className="property-details-copy">
          <p>
            A good rental experience is about more than the home
            itself. It is also about knowing where to find your
            information and who to contact when something needs
            attention.
          </p>

          <p>
            At {property.name}, leases, payments, maintenance
            requests and property updates are kept organised so
            residents and management can stay informed without
            having to search through old messages or paperwork.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section className="property-closing">
        <span>PROPERTY MANAGEMENT</span>

        <h2>Have a question?</h2>

        <p>
          For questions about {property.name}, arranging a viewing,
          renting a unit or anything else related to the property,
          get in touch with the property manager.
        </p>

        <div className="closing-contact">
          {property.manager?.email && (
            <a
              href={`mailto:${property.manager.email}`}
              className="btn-cta-primary"
            >
              <Mail size={16} />
              Email {property.manager.name || "Property Manager"}
            </a>
          )}

          {property.manager?.phone && (
            <a
              href={`tel:${property.manager.phone.replace(/\s/g, "")}`}
              className="btn-cta-secondary"
            >
              <Phone size={16} />
              Call {property.manager.name || "Property Manager"}
            </a>
          )}
        </div>
      </section>
    </div>
  );
}

export default PropertyView;

