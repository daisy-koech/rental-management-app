import { useEffect, useState } from "react";
import { getMyNotices } from "../../services/api";
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
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadNotices() {
      try {
        const data = await getMyNotices();
        setNotices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadNotices();
  }, []);

  return (
    <div className="tenant-notices-view">
      <h1>Notices</h1>

      <DashboardTabs tabs={TABS} />

      {loading && <p>Loading notices...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && notices.length === 0 ? (
        <p className="empty-text">No notices right now.</p>
      ) : (
        !loading &&
        !error &&
        notices.map((notice) => (
          <NoticeCard key={notice.id} notice={notice} />
        ))
      )}
    </div>
  );
}

export default TenantNoticesView;

