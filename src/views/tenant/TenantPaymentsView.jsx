import { useEffect, useState } from "react";
import { getMyPayments } from "../../services/api";
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
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPayments() {
      try {
        const data = await getMyPayments();
        setPayments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadPayments();
  }, []);

  const upcoming = payments.find(
    (payment) =>
      payment.status === "due" ||
      payment.status === "overdue"
  );

  const history = payments.filter(
    (payment) => payment.status === "paid"
  );

  return (
    <div className="tenant-payments-view">
      <h1>Payments</h1>

      <DashboardTabs tabs={TABS} />

      {loading && <p>Loading payments...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && (
        <>
          <section className="dashboard-section">
            <h2>Upcoming</h2>

            {upcoming ? (
              <PaymentRow payment={upcoming} />
            ) : (
              <p className="empty-text">
                Nothing due right now.
              </p>
            )}
          </section>

          <section className="dashboard-section">
            <h2>Payment history</h2>

            {history.length === 0 ? (
              <p className="empty-text">
                No payments on file yet.
              </p>
            ) : (
              <div className="payment-list">
                {history.map((payment) => (
                  <PaymentRow
                    key={payment.id}
                    payment={payment}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default TenantPaymentsView;
