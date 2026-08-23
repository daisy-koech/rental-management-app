import { currentTenant, notices, maintenanceTickets, payments, property } from "../../data/mockData";
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
  const myTickets = maintenanceTickets.filter((ticket) => ticket.unit === currentTenant.unit);
  const openTicket = myTickets.find((ticket) => ticket.status !== "Resolved");
  const nextPayment = payments.find(
    (p) => p.unit === currentTenant.unit && (p.status === "due" || p.status === "overdue")
  );
  const recentNotice = notices[0];

  return (
    <div className="tenant-dashboard">
      <h1>Welcome back, {currentTenant.name.split(" ")[0]}</h1>
      <DashboardTabs tabs={TABS} />

      <div className="dashboard-summary">
        <div className="summary-block">
          <span className="summary-label">Unit</span>
          <span className="summary-value">{currentTenant.unit}, {property.name}</span>
        </div>

        <div className="summary-block">
          <span className="summary-label">Lease</span>
          <StatusBadge status={currentTenant.leaseStatus} />
          <span className="summary-sub">Ends {currentTenant.leaseEnd}</span>
        </div>

        {nextPayment ? (
          <div className="summary-block">
            <span className="summary-label">Next payment, {nextPayment.period}</span>
            <span className="summary-value">KSh {nextPayment.total.toLocaleString()}</span>
            <StatusBadge status={nextPayment.status} />
          </div>
        ) : (
          <div className="summary-block">
            <span className="summary-label">Rent</span>
            <StatusBadge status="paid" />
            <span className="summary-sub">Nothing due right now</span>
          </div>
        )}

        <div className="summary-block">
          <span className="summary-label">Open maintenance</span>
          {openTicket ? (
            <>
              <span className="summary-value">{openTicket.description}</span>
              <StatusBadge status={openTicket.status} />
            </>
          ) : (
            <span className="summary-sub">Nothing open right now</span>
          )}
        </div>
      </div>

      {recentNotice && (
        <section className="dashboard-section">
          <h2>Recent notice</h2>
          <div className="notice-item">
            <p className="notice-title">{recentNotice.title} <span>{recentNotice.date}</span></p>
            <p className="notice-message">{recentNotice.message}</p>
          </div>
        </section>
      )}
    </div>
  );
}

export default TenantDashboard;
