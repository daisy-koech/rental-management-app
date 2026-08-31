import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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
    return <div className="home-view"><p>Loading...</p></div>;
  }

  if (!property) {
    return (
      <div className="home-view">
        <section className="hero">
          <div className="hero-text">
            <span className="hero-eyebrow">RENTAL PROPERTY MANAGEMENT</span>
            <h1>Property information isn't available yet.</h1>
            <p>Check back once the property has been set up.</p>
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
          <span className="hero-eyebrow">RENTAL PROPERTY MANAGEMENT</span>
          <h1>Everything you need to<br />manage renting, in one place.</h1>
          <p>
            Keep leases, payments, maintenance and property information
            organised, whether you're managing a property or making
            a home in one.
          </p>
          <div className="hero-actions">
            <Link to="/tenant" className="btn-primary">Tenant Dashboard</Link>
            <Link to="/landlord" className="btn-secondary">Landlord Dashboard</Link>
          </div>
        </div>
        <div className="hero-image">
          {property.image_url && <img src={property.image_url} alt={property.name} />}
        </div>
      </section>

      <section className="property-intro">
        <span className="section-eyebrow">THE PROPERTY</span>
        <h2>{property.name}</h2>
        <p>{property.location}</p>
        <Link to="/property" className="text-link">Explore the property</Link>
      </section>

      {property.latitude && property.longitude && (
        <section className="location-section">
          <div className="location-heading">
            <span className="section-eyebrow">FIND YOUR WAY AROUND</span>
            <h2>Where it is matters too.</h2>
            <p className="location-address">{property.location}</p>
          </div>
          <div className="home-map-container">
            <MapContainer center={position} zoom={15} scrollWheelZoom={false}>
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
          <span className="section-eyebrow">AROUND THE PROPERTY</span>
          <h2>Everything nearby.</h2>
        </div>
        <div className="home-amenities-list">
          {nearbyPlaces.map((place) => (
            <AmenityCard key={place.name} amenity={place} />
          ))}
        </div>
      </section>

      <section className="home-cta">
        <span className="section-eyebrow">GET STARTED</span>
        <h2>See how it works for you.</h2>
        <div className="hero-actions">
          <Link to="/tenant" className="btn-primary">Explore as a tenant</Link>
          <Link to="/landlord" className="btn-secondary">Explore as a landlord</Link>
        </div>
      </section>
    </div>
  );
}

export default HomeView;