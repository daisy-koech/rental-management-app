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
      {/* Hero */}
      <section className="hero">
        <div className="hero-text">
          <span className="hero-eyebrow">WELCOME</span>

          <h1>{property.name}</h1>

          <p className="hero-location">
            <MapPin size={16} />
            {property.location}
          </p>

          <p>
            Sign in below to check your lease, keep up with payments,
            report a repair, or manage the property if you're the
            landlord.
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

      {/* Who this is for */}
      <section className="audience-section">
      <div className="audience-grid">
        <div className="audience-card">
         <HomeIcon size={21} className="audience-icon" />
         <span className="audience-label">VISITING</span>
         <p>Explore the property, see where it is and find out what is nearby.</p>
        </div>

        <div className="audience-card audience-card-filled">
          <Users size={21} className="audience-icon" />
          <span className="audience-label">TENANTS</span>
          <p>View your lease, check payments and report anything that needs attention.</p>
        </div>

        <div className="audience-card">
         <HomeIcon size={21} className="audience-icon" />
         <span className="audience-label">LANDLORDS</span>
         <p>Keep track of units, tenants, payments, repairs and property updates.</p>
        </div>
      </div>
      </section>

      {/* Property intro */}
      <section className="property-intro">
        <span className="section-eyebrow">THE PROPERTY</span>

        <h2>{property.name}</h2>

        <p>
          {property.name} is located in {property.location}. This site
          brings together leases, payments, maintenance requests and
          property updates so tenants and the landlord can find what
          they need without digging through messages or paperwork.
        </p>

        <Link to="/property" className="text-link">
          View full property details
        </Link>
      </section>

      {/* Location */}
      {property.latitude && property.longitude && (
        <section className="location-section">
          <div className="location-heading">
            <span className="section-eyebrow">LOCATION</span>

            <h2>Where it is</h2>

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

      {/* Nearby */}
      <section className="home-amenities">
        <div className="amenities-heading">
          <span className="section-eyebrow">NEARBY</span>

          <h2>What's around the property</h2>

          <p>
            A look at some of the schools, shops, services and transport
            options nearby.
          </p>
        </div>

        <div className="home-amenities-list">
          {nearbyPlaces.map((place) => (
            <AmenityCard key={place.name} amenity={place} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="home-cta">
        <span className="cta-eyebrow">GET STARTED</span>

        <h2>Sign in to your dashboard</h2>

        <p>
          Tenants and landlords each have their own dashboard, with the
          information and tools relevant to them.
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
