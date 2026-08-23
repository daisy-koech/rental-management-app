import { property } from "../data/mockData";
import "./PropertyView.css";

function PropertyView() {
  return (
    <div className="property-view">
      <img src={property.images.exterior} alt={property.name} className="property-hero-image" />

      <h1>{property.name}</h1>
      <p className="property-address">{property.address}</p>
      <p className="property-description">{property.description}</p>

      <div className="property-facts">
        <div>
          <span className="fact-label">Units</span>
          <span className="fact-value">{property.totalUnits}</span>
        </div>
        <div>
          <span className="fact-label">Managed by</span>
          <span className="fact-value">{property.landlord.name}</span>
        </div>
        <div>
          <span className="fact-label">Contact</span>
          <span className="fact-value">{property.landlord.phone}</span>
        </div>
      </div>

      <img src={property.images.interior} alt="Inside a unit at Cedar Court" className="property-secondary-image" />
    </div>
  );
}

export default PropertyView;
