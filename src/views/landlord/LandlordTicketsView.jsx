import { useState } from "react";
import { maintenanceTickets as initialTickets } from "../../data/mockData";
import StatusBadge from "../../components/StatusBadge";
import DashboardTabs from "../../components/DashboardTabs";
import "./LandlordTicketsView.css";

const TABS = [
  { label: "Overview", to: "/landlord", end: true },
  { label: "Units", to: "/landlord/units" },
  { label: "Maintenance", to: "/landlord/tickets" },
  { label: "Payments", to: "/landlord/payments" },
  { label: "Leases", to: "/landlord/leases" },
  { label: "Notices", to: "/landlord/notices" },
];

function LandlordTicketsView() {
  const [tickets, setTickets] = useState(initialTickets);

  function toggleStatus(id) {
    // Local state only for now, becomes a PATCH to the Flask API later.
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: t.status === "Pending" ? "Resolved" : "Pending" } : t
      )
    );
  }

  return (
    <div className="landlord-tickets-view">
      <h1>Maintenance requests</h1>
      <DashboardTabs tabs={TABS} />

      {tickets.length === 0 ? (
        <p className="empty-text">No maintenance requests have been submitted.</p>
      ) : (
        <div className="ticket-list">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="ticket-row">
              <div>
                <p className="ticket-description">{ticket.description}</p>
                <p className="ticket-meta">
                  Unit {ticket.unit} · {ticket.tenantName} · Priority {ticket.priority} · Submitted {ticket.dateSubmitted}
                </p>
              </div>
              <div className="ticket-row-side">
                <StatusBadge status={ticket.status} />
                <button className="btn-toggle" onClick={() => toggleStatus(ticket.id)}>
                  Mark as {ticket.status === "Pending" ? "Resolved" : "Pending"}
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
