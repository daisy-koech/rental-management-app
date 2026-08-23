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
          <h1>A simpler way to manage {property.name}</h1>
          <p>
            Keep rent, leases and maintenance requests in one place, whether
            you're a tenant checking your account or the landlord keeping
            track of the whole building.
          </p>
          <div className="hero-actions">
            <Link to="/tenant" className="btn-primary">Tenant Dashboard</Link>
            <Link to="/landlord" className="btn-secondary">Landlord Dashboard</Link>
          </div>
        </div>
        <div className="hero-image">
          <img src={property.images.exterior} alt={property.name} />
        </div>
      </section>

      {/* 2. Property introduction */}
      <section className="property-intro">
        <h2>{property.name}</h2>
        <p>{property.description}</p>
        <div className="property-intro-facts">
          <span><strong>{property.totalUnits}</strong> units</span>
          <span>{property.address}</span>
        </div>
        <Link to="/property" className="text-link">More about the property</Link>
      </section>

      {/* 3. Tenant experience */}
      <section className="split-section">
        <img src={property.images.interior} alt="Apartment interior" />
        <div>
          <h2>For tenants</h2>
          <p>
            See your lease, check whether rent is up to date, and report a
            maintenance issue without having to call or send a message and wait.
          </p>
          <Link to="/tenant" className="text-link">Go to your dashboard</Link>
        </div>
      </section>

      {/* 4. Landlord experience */}
      <section className="split-section reverse">
        <div>
          <h2>For the landlord</h2>
          <p>
            One view of every unit: who's in it, whether rent has come in,
            and what needs fixing, without digging through separate notebooks
            or message threads.
          </p>
          <Link to="/landlord" className="text-link">Go to the landlord dashboard</Link>
        </div>
        <img src={property.images.exterior} alt="Property exterior" />
      </section>

      {/* 5 & 6. Location and map */}
      <section className="location-section">
        <h2>Where it is</h2>
        <p>{property.address}</p>
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

      {/* 7. Nearby amenities */}
      <section className="home-amenities">
        <h2>Nearby</h2>
        <div className="home-amenities-list">
          {nearbyPlaces.map((place) => (
            <AmenityCard key={place.name} amenity={place} />
          ))}
        </div>
        <Link to="/area" className="text-link">See the full area page</Link>
      </section>

      {/* 8. Call to action */}
      <section className="home-cta">
        <h2>Ready to take a look?</h2>
        <p>Enter as a tenant or as the landlord to see how it works.</p>
        <div className="hero-actions">
          <Link to="/tenant" className="btn-primary">Tenant Dashboard</Link>
          <Link to="/landlord" className="btn-secondary">Landlord Dashboard</Link>
        </div>
      </section>
    </div>
  );
}

export default HomeView;

