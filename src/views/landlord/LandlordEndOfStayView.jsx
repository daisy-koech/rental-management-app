import { useEffect, useState } from "react";
import { getLandlordEndOfStay, updateEndOfStay } from "../../services/api";
import DashboardTabs from "../../components/DashboardTabs";
import "./LandlordPropertyView.css";

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
    <div className="landlord-property-view">
      <h1>End of Stay Requests</h1>
      <DashboardTabs tabs={TABS} />

      {error && <p className="error-message">{error}</p>}

      {loading && <p>Loading requests...</p>}

      {!loading && requests.length === 0 && (
        <p>No end of stay requests yet.</p>
      )}

      {!loading &&
        requests.map((request) => (
          <div key={request.id} className="property-summary-card">
            <div className="property-summary-details">
              <h2>Move-out: {request.move_out_date}</h2>
              <p>Reason: {request.reason || "Not specified"}</p>
              {request.notes && <p>Notes: {request.notes}</p>}
              <p>Status: {request.status}</p>

              <select
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
        ))}
    </div>
  );
}

export default LandlordEndOfStayView;

