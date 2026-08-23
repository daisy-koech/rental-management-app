import { units } from "../../data/mockData";
import StatusBadge from "../../components/StatusBadge";
import DashboardTabs from "../../components/DashboardTabs";
import "./LandlordUnitsView.css";

const TABS = [
  { label: "Overview", to: "/landlord", end: true },
  { label: "Units", to: "/landlord/units" },
  { label: "Maintenance", to: "/landlord/tickets" },
  { label: "Payments", to: "/landlord/payments" },
  { label: "Leases", to: "/landlord/leases" },
  { label: "Notices", to: "/landlord/notices" },
];

function LandlordUnitsView() {
  return (
    <div className="landlord-units-view">
      <h1>Units</h1>
      <DashboardTabs tabs={TABS} />

      <table className="units-table">
        <thead>
          <tr>
            <th>Unit</th>
            <th>Bedrooms</th>
            <th>Bathrooms</th>
            <th>Tenant</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {units.map((unit) => (
            <tr key={unit.id}>
              <td>{unit.unitNumber}</td>
              <td>{unit.bedrooms}</td>
              <td>{unit.bathrooms}</td>
              <td>{unit.tenantName || "—"}</td>
              <td><StatusBadge status={unit.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LandlordUnitsView;
