import { useEffect, useState } from "react";
import {
  getMyLease,
  getMyPayments,
  getMyMaintenanceTickets,
  getMyNotices,
} from "../../services/api";
import StatusBadge from "../../components/StatusBadge";
import DashboardTabs from "../../components/DashboardTabs";
import "./TenantDashboard.css";

const TABS = [
  { label: "Home", to: "/tenant", end: true },
  { label: "Lease", to: "/tenant/lease" },
  { label: "Payments", to: "/tenant/payments" },
  { label: "Maintenance", to: "/tenant/maintenance" },
  { label: "Notices", to: "/tenant/notices" },
];

function TenantDashboard() {
  const [lease, setLease] = useState(null);
  const [payments, setPayments] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [
          leaseData,
          paymentData,
          ticketData,
          noticeData,
        ] = await Promise.all([
          getMyLease(),
          getMyPayments(),
          getMyMaintenanceTickets(),
          getMyNotices(),
        ]);

        setLease(
          Array.isArray(leaseData)
            ? leaseData[0] || null
            : leaseData
        );

        setPayments(paymentData);
        setTickets(ticketData);
        setNotices(noticeData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const openTicket = tickets.find(
    (ticket) => ticket.status !== "resolved"
  );

  const nextPayment = payments.find(
    (payment) =>
      payment.status === "due" ||
      payment.status === "overdue"
  );

  const recentNotice = notices[0];

  const firstName = user?.name
    ? user.name.split(" ")[0]
    : "Tenant";

  let paymentsSummary;

  if (nextPayment) {
    paymentsSummary = (
      <div className="summary-block">
        <span className="summary-label">
          Next payment
        </span>

        <span className="summary-value">
          KSh {nextPayment.amount.toLocaleString()}
        </span>

        <StatusBadge status={nextPayment.status} />
      </div>
    );
  } else if (payments.length > 0) {
    paymentsSummary = (
      <div className="summary-block">
        <span className="summary-label">
          Payments
        </span>

        <StatusBadge status="paid" />

        <span className="summary-sub">
          Nothing due right now
        </span>
      </div>
    );
  } else {
    paymentsSummary = (
      <div className="summary-block">
        <span className="summary-label">
          Payments
        </span>

        <StatusBadge status="No history" />

        <span className="summary-sub">
          No payments recorded yet
        </span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="tenant-dashboard">
        <h1>Welcome back, {firstName}</h1>
        <DashboardTabs tabs={TABS} />
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="tenant-dashboard">
      <h1>Welcome back, {firstName}</h1>

      <DashboardTabs tabs={TABS} />

      {error && (
        <p className="error-text">
          {error}
        </p>
      )}

      <div className="dashboard-summary">
        <div className="summary-block">
          <span className="summary-label">
            Unit
          </span>

          <span className="summary-value">
            {lease
              ? `Unit ${lease.unit_number || lease.unit_id}`
              : "No unit assigned"}
          </span>
        </div>

        <div className="summary-block">
          <span className="summary-label">
            Lease
          </span>

          {lease ? (
            <>
              <StatusBadge status={lease.status} />

              <span className="summary-sub">
                Ends {lease.end_date || "Not specified"}
              </span>
            </>
          ) : (
            <span className="summary-sub">
              No active lease
            </span>
          )}
        </div>

        {paymentsSummary}

        <div className="summary-block">
          <span className="summary-label">
            Open maintenance
          </span>

          {openTicket ? (
            <>
              <span className="summary-value">
                {openTicket.title}
              </span>

              <StatusBadge
                status={openTicket.status}
              />
            </>
          ) : (
            <span className="summary-sub">
              Nothing open right now
            </span>
          )}
        </div>
      </div>

      {recentNotice && (
        <section className="dashboard-section">
          <h2>Recent notice</h2>

          <div className="notice-item">
            <p className="notice-title">
              {recentNotice.title}
              <span>
                {new Date(
                  recentNotice.created_at
                ).toLocaleDateString()}
              </span>
            </p>

            <p className="notice-message">
              {recentNotice.message}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}

export default TenantDashboard;

