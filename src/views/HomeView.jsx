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
            <span className="hero-eyebrow">A HOME, MANAGED PROPERLY</span>
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
          <span className="hero-eyebrow">A HOME, MANAGED PROPERLY</span>
          <h1>Everything about home,<br />kept in order.</h1>
          <p>
            The lease, the payments, the little repairs, the notice that
            used to get lost in a group chat — all of it lives here now,
            somewhere you can actually find it again.
          </p>
          <div className="hero-actions">
            <Link to="/tenant" className="btn-primary">I'm a tenant</Link>
            <Link to="/landlord" className="btn-secondary">I'm the landlord</Link>
          </div>
        </div>
        <div className="hero-image">
          {property.image_url && <img src={property.image_url} alt={property.name} />}
        </div>
      </section>

      <div className="audience-strip">
        <div>
          <span className="audience-label">VISITING</span>
          <p>Take a look around before you decide.</p>
        </div>
        <div>
          <span className="audience-label">RENTING</span>
          <p>Your lease, your payments, your say.</p>
        </div>
        <div>
          <span className="audience-label">MANAGING</span>
          <p>Every unit, one clear view.</p>
        </div>
      </div>

      <section className="property-intro">
        <span className="section-eyebrow">WHERE THIS ALL HAPPENS</span>
        <h2>{property.name}</h2>
        <p>
          Tucked into {property.location}, this is the address behind
          every lease, every payment and every fixed tap logged here.
        </p>
        <Link to="/property" className="text-link">See the full picture</Link>
      </section>

      {property.latitude && property.longitude && (
        <section className="location-section">
          <div className="location-heading">
            <span className="section-eyebrow">GETTING HERE</span>
            <h2>Not just an address.</h2>
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
          <span className="section-eyebrow">WHAT'S CLOSE BY</span>
          <h2>Life happens around the corner.</h2>
          <p>A shortlist of what's nearby, so you're not guessing on move-in day.</p>
        </div>
        <div className="home-amenities-list">
          {nearbyPlaces.map((place) => (
            <AmenityCard key={place.name} amenity={place} />
          ))}
        </div>
      </section>

      <section className="home-cta">
        <span className="section-eyebrow">WHERE DO YOU FIT IN</span>
        <h2>Two logins. One home.</h2>
        <p>
          Whether you're paying rent or collecting it, the view is
          built around what you actually need to see.
        </p>
        <div className="hero-actions">
          <Link to="/tenant" className="btn-primary">I'm a tenant</Link>
          <Link to="/landlord" className="btn-secondary">I'm the landlord</Link>
        </div>
      </section>
    </div>
  );
}

export default HomeView;