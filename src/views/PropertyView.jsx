import { useEffect, useState } from "react";
import {
  Home as HomeIcon,
  MapPin,
  Building2,
  User,
  Mail,
  Phone,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { getPublicProperty } from "../services/api";
import { nearbyPlaces } from "../data/mockData";
import AmenityCard from "../components/AmenityCard";
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

  const position = [property.latitude, property.longitude];
  const hasCoordinates = property.latitude && property.longitude;

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
            <MapPin size={16} />
            {property.location}
          </p>

          <p className="property-hero-description">
            A residential property with convenient access to everyday
            shops, services and transport.
          </p>
        </div>
      </section>

      {/* About the property */}
      <section className="property-introduction">
        <div className="property-section-label">ABOUT THE PROPERTY</div>

        <div className="property-introduction-content">
          <div className="property-introduction-heading">
            <HomeIcon size={22} className="intro-icon" />
            <h2>About {property.name}</h2>
          </div>

          <div>
            <p>
              {property.name} is located in {property.location}. The
              property is set up for day-to-day residential living, with
              shops, services and transport links nearby.
            </p>
            <p>
              This page covers the basics — where the property is, what to
              expect nearby, and who to contact if you have questions about
              renting or visiting.
            </p>
          </div>
        </div>
      </section>

      {/* Property details cards */}
      <section className="property-facts-section">
        <div className="property-section-label">PROPERTY DETAILS</div>
        <h2>Key details</h2>

        <div className="property-facts">
          <div className="fact-card">
            <MapPin size={20} className="fact-icon" />
            <span className="fact-label">Location</span>
            <span className="fact-value">{property.location}</span>
            <p>Close to everyday shops, services and transport links.</p>
          </div>

          <div className="fact-card">
            <Building2 size={20} className="fact-icon" />
            <span className="fact-label">Property type</span>
            <span className="fact-value">Residential</span>
            <p>A residential property with individually let units.</p>
          </div>

          <div className="fact-card fact-card-filled">
            <User size={20} className="fact-icon" />
            <span className="fact-label">Managed by</span>
            <span className="fact-value">{MANAGER.name}</span>

            <div className="fact-contact">
              <a href={`mailto:${MANAGER.email}`}>
                <Mail size={15} />
                {MANAGER.email}
              </a>
              <a href={`tel:${MANAGER.phone.replace(/\s/g, "")}`}>
                <Phone size={15} />
                {MANAGER.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Location */}
      {hasCoordinates && (
        <section className="location-section">
          <div className="location-heading">
            <div className="property-section-label">LOCATION</div>
            <h2>Where to find us</h2>
            <p className="location-address">
              <MapPin size={16} />
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
          <div className="property-section-label">NEARBY</div>
          <h2>What's around the property</h2>
          <p>
            A look at some of the schools, shops, services and transport
            options near {property.name}.
          </p>
        </div>

        <div className="home-amenities-list">
          {nearbyPlaces.map((place) => (
            <AmenityCard key={place.name} amenity={place} />
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="property-closing">
        <span>QUESTIONS?</span>
        <h2>Get in touch with the property manager</h2>
        <p>
          For questions about renting, viewing or anything else related to{" "}
          {property.name}, contact {MANAGER.name} directly.
        </p>

        <div className="closing-contact">
          <a href={`mailto:${MANAGER.email}`} className="btn-cta-primary">
            <Mail size={16} />
            {MANAGER.email}
          </a>
          <a
            href={`tel:${MANAGER.phone.replace(/\s/g, "")}`}
            className="btn-cta-secondary"
          >
            <Phone size={16} />
            {MANAGER.phone}
          </a>
        </div>
      </section>
    </div>
  );
}

export default PropertyView;
