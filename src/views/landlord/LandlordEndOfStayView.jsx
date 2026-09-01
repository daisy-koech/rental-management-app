import { useEffect, useMemo, useState } from "react";
import { getLandlordEndOfStay, updateEndOfStay } from "../../services/api";
import DashboardTabs from "../../components/DashboardTabs";
import "./LandlordEndOfStayView.css";

const TABS = [
  { label: "Overview", to: "/landlord", end: true },
  { label: "Property", to: "/landlord/property" },
  { label: "Units", to: "/landlord/units" },
  { label: "Maintenance", to: "/landlord/tickets" },
  { label: "Payments", to: "/landlord/payments" },
  { label: "Leases", to: "/landlord/leases" },
  { label: "Notices", to: "/landlord/notices" },
  { label: "End of Stay", to: "/landlord/end-of-stay" },
];

const FILTERS = ["all", "submitted", "reviewed", "completed"];

function initials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function daysUntil(dateString) {
  const target = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((target - today) / (1000 * 60 * 60 * 24));

  if (diff < 0) return { label: `${Math.abs(diff)}d overdue`, tone: "overdue" };
  if (diff === 0) return { label: "Today", tone: "soon" };
  if (diff <= 7) return { label: `In ${diff}d`, tone: "soon" };
  return { label: `In ${diff}d`, tone: "normal" };
}

function LandlordEndOfStayView() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    setLoading(true);
    try {
      const data = await getLandlordEndOfStay();
      setRequests(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id, status) {
    try {
      await updateEndOfStay(id, status);
      loadRequests();
    } catch (err) {
      setError(err.message);
    }
  }

  const counts = useMemo(() => {
    const base = { all: requests.length, submitted: 0, reviewed: 0, completed: 0 };
    requests.forEach((r) => {
      base[r.status] = (base[r.status] || 0) + 1;
    });
    return base;
  }, [requests]);

  const visibleRequests = useMemo(() => {
    if (filter === "all") return requests;
    return requests.filter((r) => r.status === filter);
  }, [requests, filter]);

  return (
    <div className="landlord-eos-view">
      <div className="eos-page-header">
        <div>
          <h1>End of Stay Requests</h1>
          <p className="eos-subtitle">
            {requests.length === 0
              ? "Nothing to review right now."
              : `${counts.submitted} awaiting review, ${requests.length} total.`}
          </p>
        </div>
      </div>

      <DashboardTabs tabs={TABS} />

      {error && <p className="error-message">{error}</p>}

      <div className="eos-filters">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            className={`eos-filter-pill ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            <span className="eos-filter-count">{counts[f] || 0}</span>
          </button>
        ))}
      </div>

      {loading && <p className="eos-loading">Loading requests...</p>}

      {!loading && requests.length === 0 && (
        <div className="eos-empty-state">
          <div className="eos-empty-icon">🏠</div>
          <p>No end of stay requests yet.</p>
          <span>Tenant move-out notices will show up here.</span>
        </div>
      )}

      {!loading && requests.length > 0 && visibleRequests.length === 0 && (
        <p className="eos-empty">No requests in "{filter}".</p>
      )}

      {!loading && visibleRequests.length > 0 && (
        <div className="eos-list">
          {visibleRequests.map((request) => {
            const countdown = daysUntil(request.move_out_date);

            return (
              <div key={request.id} className="eos-card">
                <div className="eos-card-main">
                  <div className="eos-avatar">{initials(request.tenant_name)}</div>

                  <div className="eos-card-body">
                    <div className="eos-card-top">
                      <div>
                        <span className="eos-tenant-name">{request.tenant_name}</span>
                        <span className="eos-unit-tag">Unit {request.unit_number}</span>
                      </div>
                      <span className={`eos-status eos-status-${request.status}`}>
                        {request.status}
                      </span>
                    </div>

                    <div className="eos-details">
                      <div>
                        <span className="eos-label">Move-out date</span>
                        <span className="eos-value">
                          {request.move_out_date}
                          <span className={`eos-countdown eos-countdown-${countdown.tone}`}>
                            {countdown.label}
                          </span>
                        </span>
                      </div>
                      <div>
                        <span className="eos-label">Reason</span>
                        <span className="eos-value">
                          {request.reason || "Not specified"}
                        </span>
                      </div>
                    </div>

                    {request.notes && (
                      <p className="eos-notes">{request.notes}</p>
                    )}
                  </div>
                </div>

                <div className="eos-card-footer">
                  <label htmlFor={`status-${request.id}`}>Update status</label>
                  <select
                    id={`status-${request.id}`}
                    className="eos-select"
                    value={request.status}
                    onChange={(e) =>
                      handleStatusChange(request.id, e.target.value)
                    }
                  >
                    <option value="submitted">Submitted</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default LandlordEndOfStayView;
