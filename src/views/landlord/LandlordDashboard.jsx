import { useEffect, useState } from "react";
import { getLandlordUnits } from "../../services/api";
import DashboardTabs from "../../components/DashboardTabs";
import "./LandlordDashboard.css";

const TABS = [
  { label: "Overview", to: "/landlord", end: true },
  { label: "Units", to: "/landlord/units" },
  { label: "Maintenance", to: "/landlord/tickets" },
  { label: "Payments", to: "/landlord/payments" },
  { label: "Leases", to: "/landlord/leases" },
  { label: "Notices", to: "/landlord/notices" },
];

function LandlordDashboard() {
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

  const occupiedCount = units.filter(
    (unit) => unit.status === "occupied"
  ).length;

  return (
    <div className="landlord-dashboard">
      <h1>Cedar Court</h1>

      <DashboardTabs tabs={TABS} />

      <div className="dashboard-summary">
        <div className="summary-block">
          <span className="summary-label">Occupancy</span>
          <span className="summary-value">
            {loading
              ? "Loading..."
              : `${occupiedCount} / ${units.length} units`}
          </span>
        </div>

        <div className="summary-block">
          <span className="summary-label">Open maintenance</span>
          <span className="summary-value">—</span>
        </div>

        <div className="summary-block">
          <span className="summary-label">Overdue payments</span>
          <span className="summary-value">—</span>
        </div>
      </div>

      {error && (
        <p className="dashboard-hint">
          {error}
        </p>
      )}

      {!error && !loading && (
        <p className="dashboard-hint">
          Use the tabs above to view units, maintenance requests, payments,
          leases and notices.
        </p>
      )}
    </div>
  );
}

export default LandlordDashboard;

