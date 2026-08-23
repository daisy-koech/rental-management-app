import { payments } from "../../data/mockData";
import PaymentRow from "../../components/PaymentRow";
import DashboardTabs from "../../components/DashboardTabs";
import "./LandlordPaymentsView.css";

const TABS = [
  { label: "Overview", to: "/landlord", end: true },
  { label: "Units", to: "/landlord/units" },
  { label: "Maintenance", to: "/landlord/tickets" },
  { label: "Payments", to: "/landlord/payments" },
  { label: "Leases", to: "/landlord/leases" },
  { label: "Notices", to: "/landlord/notices" },
];

function LandlordPaymentsView() {
  return (
    <div className="landlord-payments-view">
      <h1>Payments</h1>
      <DashboardTabs tabs={TABS} />

      <div className="payment-list">
        {payments.map((p) => (
          <PaymentRow key={p.id} payment={p} showTenant />
        ))}
      </div>
    </div>
  );
}

export default LandlordPaymentsView;
