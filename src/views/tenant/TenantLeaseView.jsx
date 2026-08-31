import { useEffect, useState } from "react";
import { getMyLease } from "../../services/api";
import StatusBadge from "../../components/StatusBadge";
import DashboardTabs from "../../components/DashboardTabs";
import EndOfStayForm from "../../components/EndOfStayForm";
import "./TenantLeaseView.css";

const TABS = [
  { label: "Home", to: "/tenant", end: true },
  { label: "Lease", to: "/tenant/lease" },
  { label: "Payments", to: "/tenant/payments" },
  { label: "Maintenance", to: "/tenant/maintenance" },
  { label: "Notices", to: "/tenant/notices" },
];

function TenantLeaseView() {
  const [lease, setLease] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEndOfStayForm, setShowEndOfStayForm] = useState(false);

  useEffect(() => {
    async function loadLease() {
      try {
        const data = await getMyLease();
        setLease(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadLease();
  }, []);

  return (
    <div className="tenant-lease-view">
      <h1>My Lease</h1>

      <DashboardTabs tabs={TABS} />

      {loading && <p>Loading lease...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && lease && (
        <>
          <div className="lease-card">
            <div>
              <span className="lease-label">Lease ID</span>
              <strong>{lease.id}</strong>
            </div>
            <div>
              <span className="lease-label">Unit</span>
              <strong>{lease.unit_number || lease.unit_id}</strong>
            </div>
            <div>
              <span className="lease-label">Monthly Rent</span>
              <strong>KSh {lease.monthly_rent.toLocaleString()}</strong>
            </div>
            <div>
              <span className="lease-label">Start Date</span>
              <strong>{lease.start_date}</strong>
            </div>
            <div>
              <span className="lease-label">End Date</span>
              <strong>{lease.end_date || "—"}</strong>
            </div>
            <div>
              <span className="lease-label">Status</span>
              <StatusBadge status={lease.status} />
            </div>
          </div>

          <section className="end-of-stay-section">
            <h2>Notify landlord of end of stay</h2>

            {!showEndOfStayForm ? (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowEndOfStayForm(true)}
              >
                Submit a notice
              </button>
            ) : (
              <EndOfStayForm />
            )}
          </section>
        </>
      )}

      {!loading && !error && !lease && (
        <p className="empty-text">No active lease found.</p>
      )}
    </div>
  );
}

export default TenantLeaseView;
