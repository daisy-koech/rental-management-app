import { currentTenant, payments } from "../../data/mockData";
import PaymentRow from "../../components/PaymentRow";
import DashboardTabs from "../../components/DashboardTabs";
import "./TenantPaymentsView.css";

const TABS = [
  { label: "Home", to: "/tenant", end: true },
  { label: "Lease", to: "/tenant/lease" },
  { label: "Payments", to: "/tenant/payments" },
  { label: "Maintenance", to: "/tenant/maintenance" },
  { label: "Notices", to: "/tenant/notices" },
];

function TenantPaymentsView() {
  const myPayments = payments.filter((p) => p.unit === currentTenant.unit);
  const upcoming = myPayments.find((p) => p.status === "due" || p.status === "overdue");
  const history = myPayments.filter((p) => p.status === "paid");

  return (
    <div className="tenant-payments-view">
      <h1>Payments</h1>
      <DashboardTabs tabs={TABS} />

      <section className="dashboard-section">
        <h2>Upcoming</h2>
        {upcoming ? (
          <PaymentRow payment={upcoming} />
        ) : (
          <p className="empty-text">Nothing due right now.</p>
        )}
      </section>

      <section className="dashboard-section">
        <h2>Payment history</h2>
        {history.length === 0 ? (
          <p className="empty-text">No payments on file yet.</p>
        ) : (
          <div className="payment-list">
            {history.map((p) => (
              <PaymentRow key={p.id} payment={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default TenantPaymentsView;
