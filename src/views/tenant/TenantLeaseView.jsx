import { currentTenant, leases } from "../../data/mockData";
import StatusBadge from "../../components/StatusBadge";
import DashboardTabs from "../../components/DashboardTabs";
import EndOfStayForm from "../../components/EndOfStayForm";
import { useState } from "react";
import "./TenantLeaseView.css";

const TABS = [
  { label: "Home", to: "/tenant", end: true },
  { label: "Lease", to: "/tenant/lease" },
  { label: "Payments", to: "/tenant/payments" },
  { label: "Maintenance", to: "/tenant/maintenance" },
  { label: "Notices", to: "/tenant/notices" },
];

function TenantLeaseView() {
  const lease = leases.find((l) => l.unit === currentTenant.unit);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="tenant-lease-view">
      <h1>Lease</h1>
      <DashboardTabs tabs={TABS} />

      {lease ? (
        <div className="lease-details">
          <div>
            <span className="lease-label">Unit</span>
            <span className="lease-value">{lease.unit}</span>
          </div>
          <div>
            <span className="lease-label">Start date</span>
            <span className="lease-value">{lease.startDate}</span>
          </div>
          <div>
            <span className="lease-label">End date</span>
            <span className="lease-value">{lease.endDate}</span>
          </div>
          <div>
            <span className="lease-label">Monthly rent</span>
            <span className="lease-value">KSh {lease.rentAmount.toLocaleString()}</span>
          </div>
          <div>
            <span className="lease-label">Status</span>
            <StatusBadge status={lease.status} />
          </div>
        </div>
      ) : (
        <p>No lease on file.</p>
      )}

      <section className="end-of-stay-section">
        <h2>Notify landlord of end of stay</h2>
        {!showForm ? (
          <button type="submit" className="btn-secondary" onClick={() => setShowForm(true)}>
            Submit a notice
          </button>
        ) : (
          <EndOfStayForm onSubmit={() => {}} />
        )}
      </section>
    </div>
  );
}

export default TenantLeaseView;
