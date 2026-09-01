import { useEffect, useState } from "react";
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

function LandlordEndOfStayView() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <div className="landlord-eos-view">
      <h1>End of Stay Requests</h1>
      <DashboardTabs tabs={TABS} />

      {error && <p className="error-message">{error}</p>}

      {loading && <p>Loading requests...</p>}

      {!loading && requests.length === 0 && (
        <p className="eos-empty">No end of stay requests yet.</p>
      )}

      {!loading && (
        <div className="eos-list">
          {requests.map((request) => (
            <div key={request.id} className="eos-card">
              <div className="eos-card-header">
                <span className="eos-unit">Unit {request.unit_number}</span>
                <span className={`eos-status eos-status-${request.status}`}>
                  {request.status}
                </span>
              </div>

              <p className="eos-tenant">{request.tenant_name}</p>

              <div className="eos-details">
                <div>
                  <span className="eos-label">Move-out date</span>
                  <span className="eos-value">{request.move_out_date}</span>
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

              <select
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
          ))}
        </div>
      )}
    </div>
  );
}

export default LandlordEndOfStayView;

