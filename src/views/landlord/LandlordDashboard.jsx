import { units, maintenanceTickets, payments, property } from "../../data/mockData";
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
  const occupiedCount = units.filter((unit) => unit.status === "occupied").length;
  const openTicketCount = maintenanceTickets.filter((t) => t.status !== "Resolved").length;
  const overdueCount = payments.filter((p) => p.status === "overdue").length;

  return (
    <div className="landlord-dashboard">
      <h1>{property.name}</h1>
      <DashboardTabs tabs={TABS} />

      <div className="dashboard-summary">
        <div className="summary-block">
          <span className="summary-label">Occupancy</span>
          <span className="summary-value">{occupiedCount} / {property.totalUnits} units</span>
        </div>
        <div className="summary-block">
          <span className="summary-label">Open maintenance</span>
          <span className="summary-value">{openTicketCount}</span>
        </div>
        <div className="summary-block">
          <span className="summary-label">Overdue payments</span>
          <span className="summary-value">{overdueCount}</span>
        </div>
      </div>

      <p className="dashboard-hint">
        Use the tabs above to view units, maintenance requests, payments, leases and notices.
      </p>
    </div>
  );
}

export default LandlordDashboard;


