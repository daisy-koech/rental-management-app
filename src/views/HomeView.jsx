import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { MapPin, Users, Home as HomeIcon } from "lucide-react";
import { getPublicProperty } from "../services/api";
import { nearbyPlaces } from "../data/mockData";
import AmenityCard from "../components/AmenityCard";
import "./HomeView.css";

function HomeView() {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicProperty()
      .then(setProperty)
      .catch(() => setProperty(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="home-view">
        <p>Loading property information...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="home-view">
        <section className="hero">
          <div className="hero-text">
            <span className="hero-eyebrow">PROPERTY INFORMATION</span>
            <h1>The property is being set up.</h1>
            <p>
              Property details will appear here once everything is ready.
              Please check back shortly.
            </p>
          </div>
        </section>
      </div>
    );
  }

  const position = [property.latitude, property.longitude];

  return (
    <div className="home-view">
      <section className="hero">
        <div className="hero-text">
          <span className="hero-eyebrow">WELCOME HOME</span>

          <h1>
            A better way to stay
            <br />
            connected to home.
          </h1>

          <p>
            Keep up with the things that matter during your stay. Find your
            lease details, check payments, report a repair and catch up on
            important property updates without having to search through
            messages or paperwork.
          </p>

          <div className="hero-actions">
            <Link to="/tenant" className="btn-primary">
              Tenant login
            </Link>

            <Link to="/landlord" className="btn-secondary">
              Landlord login
            </Link>
          </div>
        </div>

        <div className="hero-image">
          {property.image_url && (
            <img src={property.image_url} alt={property.name} />
          )}

          <div className="hero-image-tag">
            <HomeIcon size={15} />
            <span>{property.name}</span>
          </div>
        </div>
      </section>

      <div className="audience-band">
        <div>
          <span className="audience-label">VISITING</span>
          <p>
            Get to know the property, its location and what you can find
            nearby.
          </p>
        </div>

        <div>
          <Users size={17} className="audience-icon" />
          <span className="audience-label">TENANTS</span>
          <p>
            Check your lease, keep up with payments and let us know when
            something needs attention.
          </p>
        </div>

        <div>
          <HomeIcon size={17} className="audience-icon" />
          <span className="audience-label">LANDLORDS</span>
          <p>
            Keep track of units, tenants, rent, repairs and property
            announcements.
          </p>
        </div>
      </div>

      <section className="property-intro">
        <span className="section-eyebrow">THE PROPERTY</span>

        <h2>{property.name}</h2>

        <p>
          Located in {property.location}, {property.name} brings everyday
          rental information together in one place. From keeping track of
          leases and payments to handling repairs and property updates,
          everything is easier to find when you need it.
        </p>

        <Link to="/property" className="text-link">
          Explore the property
        </Link>
      </section>

      {property.latitude && property.longitude && (
        <section className="location-section">
          <div className="location-heading">
            <span className="section-eyebrow">LOCATION</span>

            <h2>Find us in {property.location}.</h2>

            <p className="location-address">
              <MapPin size={15} />
              {property.location}
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
                <Popup>{property.name}</Popup>
              </Marker>
            </MapContainer>
          </div>
        </section>
      )}

      <section className="home-amenities">
        <div className="amenities-heading">
          <span className="section-eyebrow">NEARBY</span>

          <h2>Everything you need, close by.</h2>

          <p>
            Take a look at some of the schools, shops, services and transport
            options around the property.
          </p>
        </div>

        <div className="home-amenities-list">
          {nearbyPlaces.map((place) => (
            <AmenityCard key={place.name} amenity={place} />
          ))}
        </div>
      </section>

      <section className="home-cta">
        <span className="cta-eyebrow">GET STARTED</span>

        <h2>Looking after a home or living in one?</h2>

        <p>
          Sign in to access the information and tools available for your
          property.
        </p>

        <div className="hero-actions">
          <Link to="/tenant" className="btn-cta-primary">
            Tenant login
          </Link>

          <Link to="/landlord" className="btn-cta-secondary">
            Landlord login
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomeView;
