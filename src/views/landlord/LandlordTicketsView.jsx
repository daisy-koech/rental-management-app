import { useEffect, useState } from "react";
import {
  getLandlordMaintenanceTickets,
  updateMaintenanceTicket,
} from "../../services/api";
import StatusBadge from "../../components/StatusBadge";
import DashboardTabs from "../../components/DashboardTabs";
import "./LandlordTicketsView.css";

const TABS = [
  { label: "Overview", to: "/landlord", end: true },
  { label: "Property", to: "/landlord/property" },
  { label: "Units", to: "/landlord/units" },
  { label: "Maintenance", to: "/landlord/tickets" },
  { label: "Payments", to: "/landlord/payments" },
  { label: "Leases", to: "/landlord/leases" },
  { label: "Notices", to: "/landlord/notices" },
];

function formatDate(dateString) {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function LandlordTicketsView() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTickets() {
      try {
        const data = await getLandlordMaintenanceTickets();
        setTickets(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadTickets();
  }, []);

  async function toggleStatus(ticket) {
    const newStatus =
      ticket.status === "pending"
        ? "resolved"
        : "pending";

    try {
      const updatedTicket = await updateMaintenanceTicket(
        ticket.id,
        newStatus
      );

      setTickets((prev) =>
        prev.map((item) =>
          item.id === ticket.id ? updatedTicket : item
        )
      );
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="landlord-tickets-view">
      <h1>Maintenance requests</h1>

      <DashboardTabs tabs={TABS} />

      {loading && (
        <p>Loading maintenance requests...</p>
      )}

      {error && <p>{error}</p>}

      {!loading && !error && tickets.length === 0 && (
        <p className="empty-text">
          No maintenance requests have been submitted.
        </p>
      )}

      {!loading && !error && tickets.length > 0 && (
        <div className="ticket-list">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="ticket-row"
            >
              <div>
                <p className="ticket-description">
                  {ticket.description}
                </p>

                <p className="ticket-meta">
                  Unit {ticket.unit_number || ticket.unit_id}{" "}
                  ·{" "}
                  {ticket.tenant_name || ticket.tenant_id}{" "}
                  · Submitted{" "}
                  {formatDate(
                    ticket.created_at || ticket.date_submitted
                  )}
                </p>
              </div>

              <div className="ticket-row-side">
                <StatusBadge status={ticket.status} />

                <button
                  type="button"
                  className="btn-toggle"
                  onClick={() => toggleStatus(ticket)}
                >
                  Mark as{" "}
                  {ticket.status === "pending"
                    ? "Resolved"
                    : "Pending"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LandlordTicketsView;

