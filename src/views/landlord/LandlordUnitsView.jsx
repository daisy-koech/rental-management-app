import { useEffect, useState } from "react";
import { getLandlordUnits } from "../../services/api";
import DashboardTabs from "../../components/DashboardTabs";
import "./LandlordUnitsView.css";

const TABS = [
  { label: "Overview", to: "/landlord", end: true },
  { label: "Units", to: "/landlord/units" },
  { label: "Maintenance", to: "/landlord/tickets" },
  { label: "Payments", to: "/landlord/payments" },
  { label: "Leases", to: "/landlord/leases" },
  { label: "Notices", to: "/landlord/notices" },
];

function LandlordUnitsView() {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUnits() {
      try {
        const data = await getLandlordUnits();
        setUnits(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadUnits();
  }, []);

  return (
    <div className="landlord-units-view">
      <h1>Units</h1>
      <DashboardTabs tabs={TABS} />

      {loading && <p>Loading units...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && (
        <table className="units-table">
          <thead>
            <tr>
              <th>Unit</th>
              <th>Monthly Rent</th>
              <th>Property</th>
            </tr>
          </thead>

          <tbody>
            {units.map((unit) => (
              <tr key={unit.id}>
                <td>{unit.unit_number}</td>
                <td>KSh {unit.monthly_rent.toLocaleString()}</td>
                <td>{unit.property_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default LandlordUnitsView;
