import { School, Hospital, Bus, ShoppingCart, Store, MapPin } from "lucide-react";
import "./AmenityCard.css";

function AmenityCard({ amenity }) {
  const icons = {
    school: School,
    hospital: Hospital,
    transport: Bus,
    market: ShoppingCart,
    mall: Store,
  };

  const labels = {
    school: "School",
    hospital: "Hospital",
    transport: "Matatu / Public Transport",
    market: "Market",
    mall: "Mall / Shopping Centre",
  };

  const Icon = icons[amenity.type] || MapPin;

  return (
    <div className="amenity-card">
      <Icon size={28} />
      <div>
        <h3>{amenity.name}</h3>
        <span className="amenity-type">{labels[amenity.type] || "Other"}</span>
        {amenity.distance && <span className="amenity-distance">{amenity.distance}</span>}
      </div>
    </div>
  );
}

export default AmenityCard;