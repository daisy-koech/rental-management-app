import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { property, nearbyPlaces } from "../data/mockData";
import AmenityCard from "../components/AmenityCard";
import "./HomeView.css";

function HomeView() {
  const position = [property.latitude, property.longitude];

  return (
    <div className="home-view">

      {/* 1. Hero */}
      <section className="hero">
        <div className="hero-text">
          <span className="hero-eyebrow">
            RENTAL PROPERTY MANAGEMENT
          </span>

          <h1>
            Everything you need to
            <br />
            manage renting, in one place.
          </h1>

          <p>
            Keep leases, payments, maintenance and property information
            organised, whether you're managing a property or making
            a home in one.
          </p>

          <div className="hero-actions">
            <Link to="/tenant" className="btn-primary">
              Tenant Dashboard
            </Link>

            <Link to="/landlord" className="btn-secondary">
              Landlord Dashboard
            </Link>
          </div>
        </div>

        <div className="hero-image">
          <img
            src={property.images.exterior}
            alt={property.name}
          />
        </div>
      </section>


      {/* 2. Property introduction */}
      <section className="property-intro">

        <span className="section-eyebrow">
          THE PROPERTY
        </span>

        <h2>{property.name}</h2>

        <p>
          {property.description}
        </p>

        <div className="property-intro-facts">
          <span>
            <strong>{property.totalUnits}</strong>
            <small> units</small>
          </span>

          <span>
            {property.address}
          </span>
        </div>

        <Link
          to="/property"
          className="text-link"
        >
          Explore the property
        </Link>

      </section>


      {/* 3. Tenant experience */}
      <section className="split-section">

        <img
          src={property.images.interior}
          alt="Apartment interior"
        />

        <div className="split-section-content">

          <span className="section-eyebrow">
            FOR TENANTS
          </span>

          <h2>
            Know what's happening
            <br />
            with your home.
          </h2>

          <p>
            Your lease, payments, maintenance requests and important
            property information are all easier to find in one place.
          </p>

          <p>
            Need to report something? Check your payments? See an
            important notice? You can find it without having to search
            through old messages.
          </p>

          <Link
            to="/tenant"
            className="text-link"
          >
            Visit the tenant dashboard
          </Link>

        </div>

      </section>


      {/* 4. Landlord experience */}
      <section className="split-section reverse">

        <div className="split-section-content">

          <span className="section-eyebrow">
            FOR LANDLORDS
          </span>

          <h2>
            See the whole property
            <br />
            at a glance.
          </h2>

          <p>
            Keep track of your units, tenants, leases, payments and
            maintenance requests without having to piece information
            together from different places.
          </p>

          <p>
            From an individual payment to a maintenance request,
            everything is easier to see and manage.
          </p>

          <Link
            to="/landlord"
            className="text-link"
          >
            Visit the landlord dashboard
          </Link>

        </div>

        <img
          src={property.images.exterior}
          alt="Property exterior"
        />

      </section>


      {/* 5. Location */}
      <section className="location-section">

        <div className="location-heading">

          <span className="section-eyebrow">
            FIND YOUR WAY AROUND
          </span>

          <h2>
            Where it is matters too.
          </h2>

          <p>
            See where the property is located and get a feel for
            what is around it.
          </p>

          <p className="location-address">
            {property.address}
          </p>

        </div>

        <div className="home-map-container">

          <MapContainer
            center={position}
            zoom={15}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={position}>
              <Popup>
                {property.name}
              </Popup>
            </Marker>

          </MapContainer>

        </div>

      </section>


      {/* 6. Nearby amenities */}
      <section className="home-amenities">

        <div className="amenities-heading">

          <span className="section-eyebrow">
            AROUND THE PROPERTY
          </span>

          <h2>
            Everything nearby.
          </h2>

          <p>
            From everyday shopping to transport, schools and other
            useful places, see what is around the property.
          </p>

        </div>

        <div className="home-amenities-list">

          {nearbyPlaces.map((place) => (
            <AmenityCard
              key={place.name}
              amenity={place}
            />
          ))}

        </div>

        <Link
          to="/area"
          className="text-link"
        >
          Explore the surrounding area
        </Link>

      </section>


      {/* 7. Closing CTA */}
      <section className="home-cta">

        <span className="section-eyebrow">
          GET STARTED
        </span>

        <h2>
          See how it works
          <br />
          for you.
        </h2>

        <p>
          Whether you're looking after a property or living in one,
          start by exploring the experience from your side.
        </p>

        <div className="hero-actions">

          <Link
            to="/tenant"
            className="btn-primary"
          >
            Explore as a tenant
          </Link>

          <Link
            to="/landlord"
            className="btn-secondary"
          >
            Explore as a landlord
          </Link>

        </div>

      </section>

    </div>
  );
}

export default HomeView;
