import { notices } from "../../data/mockData";
import NoticeCard from "../../components/NoticeCard";
import DashboardTabs from "../../components/DashboardTabs";
import "./TenantNoticesView.css";

const TABS = [
  { label: "Home", to: "/tenant", end: true },
  { label: "Lease", to: "/tenant/lease" },
  { label: "Payments", to: "/tenant/payments" },
  { label: "Maintenance", to: "/tenant/maintenance" },
  { label: "Notices", to: "/tenant/notices" },
];

function TenantNoticesView() {
  return (
    <div className="tenant-notices-view">
      <h1>Notices</h1>
      <DashboardTabs tabs={TABS} />

      {notices.length === 0 ? (
        <p className="empty-text">No notices right now.</p>
      ) : (
        notices.map((notice) => <NoticeCard key={notice.id} notice={notice} />)
      )}
    </div>
  );
}

export default TenantNoticesView;


