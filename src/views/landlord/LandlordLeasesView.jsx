import { leases } from "../../data/mockData";
import StatusBadge from "../../components/StatusBadge";
import DashboardTabs from "../../components/DashboardTabs";
import "./LandlordLeasesView.css";

const TABS = [
  { label: "Overview", to: "/landlord", end: true },
  { label: "Units", to: "/landlord/units" },
  { label: "Maintenance", to: "/landlord/tickets" },
  { label: "Payments", to: "/landlord/payments" },
  { label: "Leases", to: "/landlord/leases" },
  { label: "Notices", to: "/landlord/notices" },
];

function LandlordLeasesView() {
  return (
    <div className="landlord-leases-view">
      <h1>Leases</h1>
      <DashboardTabs tabs={TABS} />

      <table className="leases-table">
        <thead>
          <tr>
            <th>Unit</th>
            <th>Tenant</th>
            <th>Start</th>
            <th>End</th>
            <th>Rent</th>
            <th>Status</th>
            <th>End of stay notice</th>
          </tr>
        </thead>
        <tbody>
          {leases.map((lease) => (
            <tr key={lease.id}>
              <td>{lease.unit}</td>
              <td>{lease.tenantName}</td>
              <td>{lease.startDate}</td>
              <td>{lease.endDate}</td>
              <td>KSh {lease.rentAmount.toLocaleString()}</td>
              <td><StatusBadge status={lease.status} /></td>
              <td>{lease.endOfStayNoticeSubmitted ? "Submitted" : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LandlordLeasesView;
