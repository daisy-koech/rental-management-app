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

const MANAGER = {
  name: "Johnson Koech",
  email: "johnsonkoech@example.com",
  phone: "0799 000 000",
};

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
            A residential property designed for comfortable,
            everyday living, with the important details kept simple.
          </p>
        </div>
      </section>

      {/* About */}
      <section className="property-introduction">
        <div className="property-section-label">A CLOSER LOOK</div>

        <div className="property-introduction-content">
          <div className="property-introduction-heading">
            <HomeIcon size={22} className="intro-icon" />

            <h2>
              A place to live,
              <br />
              settle in and stay.
            </h2>
          </div>

          <div>
            <p>
              {property.name} is a residential property in{" "}
              {property.location}, made up of individual units for
              tenants to call their own.
            </p>

            <p>
              The focus is on comfortable homes and straightforward
              day-to-day management. From tenancy details to property
              maintenance, the things that matter are kept organised
              and easy to access.
            </p>
          </div>
        </div>
      </section>

      {/* Property details */}
      <section className="property-facts-section">
        <div className="property-section-label">PROPERTY DETAILS</div>

        <h2>What makes up the property.</h2>

        <div className="property-facts">
          <div className="fact-card">
            <Building2 size={20} className="fact-icon" />

            <span className="fact-label">PROPERTY TYPE</span>

            <span className="fact-value">Residential</span>

            <p>
              A residential property with individually managed
              rental units.
            </p>
          </div>

          <div className="fact-card">
            <Layers3 size={20} className="fact-icon" />

            <span className="fact-label">UNITS</span>

            <span className="fact-value">
              {property.number_of_units || "Multiple"}
            </span>

            <p>
              Individual homes within the property, each with its
              own tenancy and lease details.
            </p>
          </div>

          <div className="fact-card">
            <HomeIcon size={20} className="fact-icon" />

            <span className="fact-label">TENANCY</span>

            <span className="fact-value">Long-term rental</span>

            <p>
              Homes intended for residents looking for a place to
              live rather than a short stay.
            </p>
          </div>

          <div className="fact-card fact-card-filled">
            <User size={20} className="fact-icon" />

            <span className="fact-label">PROPERTY MANAGER</span>

            <span className="fact-value">{MANAGER.name}</span>

            <div className="fact-contact">
              <a href={`mailto:${MANAGER.email}`}>
                <Mail size={15} />
                {MANAGER.email}
              </a>

              <a
                href={`tel:${MANAGER.phone.replace(/\s/g, "")}`}
              >
                <Phone size={15} />
                {MANAGER.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Living here */}
      <section className="property-details">
        <div className="property-details-heading">
          <span className="property-section-label">LIVING HERE</span>

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
          <a
            href={`mailto:${MANAGER.email}`}
            className="btn-cta-primary"
          >
            <Mail size={16} />
            Email {MANAGER.name}
          </a>

          <a
            href={`tel:${MANAGER.phone.replace(/\s/g, "")}`}
            className="btn-cta-secondary"
          >
            <Phone size={16} />
            Call {MANAGER.name}
          </a>
        </div>
      </section>
    </div>
  );
}

export default PropertyView;

