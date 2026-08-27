import { property } from "../data/mockData";
import "./PropertyView.css";

function PropertyView() {
  return (
    <div className="property-view">
      {/* Hero */}
      <section className="property-hero">
        <img
          src={property.images.exterior}
          alt={property.name}
          className="property-hero-image"
        />

        <div className="property-hero-content">
          <span className="property-eyebrow">
            WELCOME HOME
          </span>

          <h1>{property.name}</h1>

          <p className="property-address">
            {property.address}
          </p>

          <p className="property-hero-description">
            A comfortable residential community designed for
            everyday living, with everything you need close to home.
          </p>
        </div>
      </section>

      {/* About the property */}
      <section className="property-introduction">
        <div className="property-section-label">
          ABOUT THE PROPERTY
        </div>

        <div className="property-introduction-content">
          <div>
            <h2>
              A place that feels
              <br />
              like home.
            </h2>
          </div>

          <div>
            <p className="property-description">
              {property.description}
            </p>

            <p>
              Cedar Court brings together comfortable homes,
              a welcoming environment and the convenience of
              having the essentials of everyday life within reach.
            </p>

            <p>
              Whether you are looking for your first home,
              somewhere closer to work or simply a place where
              you can settle down, Cedar Court offers a practical
              space to make your own.
            </p>
          </div>
        </div>
      </section>

      {/* Property facts */}
      <section className="property-facts-section">
        <div className="property-section-label">
          CEDAR COURT AT A GLANCE
        </div>

        <h2>
          Everything starts with a good place to live.
        </h2>

        <div className="property-facts">
          <div>
            <span className="fact-label">Homes</span>
            <span className="fact-value">
              {property.totalUnits}
            </span>
            <p>
              A small residential community with a more personal
              feel.
            </p>
          </div>

          <div>
            <span className="fact-label">Location</span>
            <span className="fact-value">
              {property.address}
            </span>
            <p>
              Conveniently located for everyday travel and errands.
            </p>
          </div>

          <div>
            <span className="fact-label">Community</span>
            <span className="fact-value">
              Residential
            </span>
            <p>
              A comfortable setting for individuals and families.
            </p>
          </div>
        </div>
      </section>

      {/* Interior */}
      <section className="property-living-section">
        <div className="property-living-image">
          <img
            src={property.images.interior}
            alt="Inside a unit at Cedar Court"
            className="property-secondary-image"
          />
        </div>

        <div className="property-living-content">
          <span className="property-section-label">
            INSIDE YOUR HOME
          </span>

          <h2>
            Comfortable spaces
            <br />
            for everyday life.
          </h2>

          <p>
            Your home should be somewhere you can relax after
            a long day, prepare a meal, welcome friends and
            enjoy your own space.
          </p>

          <p>
            The homes at Cedar Court are designed around those
            simple moments — giving residents a comfortable
            place to live, rest and build their routines.
          </p>
        </div>
      </section>

      {/* Lifestyle */}
      <section className="property-lifestyle">
        <div className="property-section-label">
          LIFE AT CEDAR COURT
        </div>

        <h2>
          A convenient place
          <br />
          for everyday living.
        </h2>

        <div className="property-lifestyle-grid">
          <div className="property-lifestyle-card">
            <span className="lifestyle-icon">01</span>

            <h3>Convenient location</h3>

            <p>
              Stay connected to the places that matter, from
              shopping and transport to schools, work and
              everyday services.
            </p>
          </div>

          <div className="property-lifestyle-card">
            <span className="lifestyle-icon">02</span>

            <h3>A comfortable home</h3>

            <p>
              Come home to a space that gives you room to relax,
              settle in and enjoy your own routine.
            </p>
          </div>

          <div className="property-lifestyle-card">
            <span className="lifestyle-icon">03</span>

            <h3>A welcoming community</h3>

            <p>
              Cedar Court is more than individual units. It is
              a shared residential space where people can feel
              comfortable calling home.
            </p>
          </div>
        </div>
      </section>

      {/* Landlord / contact */}
      <section className="property-contact">
        <div>
          <span className="property-section-label">
            NEED TO KNOW MORE?
          </span>

          <h2>
            Have a question
            <br />
            about Cedar Court?
          </h2>
        </div>

        <div className="property-contact-details">
          <p>
            If you would like to know more about the property,
            availability or living at Cedar Court, you can
            contact the property manager directly.
          </p>

          <div className="property-manager">
            <span className="fact-label">
              PROPERTY MANAGER
            </span>

            <strong>
              {property.landlord.name}
            </strong>

            <span>
              {property.landlord.phone}
            </span>
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
