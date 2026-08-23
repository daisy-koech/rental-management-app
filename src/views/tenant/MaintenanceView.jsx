import { useState } from "react";
import { currentTenant, maintenanceTickets as initialTickets } from "../../data/mockData";
import TicketForm from "../../components/TicketForm";
import TicketCard from "../../components/TicketCard";
import DashboardTabs from "../../components/DashboardTabs";
import "./MaintenanceView.css";

const TABS = [
  { label: "Home", to: "/tenant", end: true },
  { label: "Lease", to: "/tenant/lease" },
  { label: "Payments", to: "/tenant/payments" },
  { label: "Maintenance", to: "/tenant/maintenance" },
  { label: "Notices", to: "/tenant/notices" },
];

function MaintenanceView() {
  const [tickets, setTickets] = useState(
    initialTickets.filter((ticket) => ticket.unit === currentTenant.unit)
  );

  function handleNewTicket({ description, priority }) {
    const newTicket = {
      id: Date.now(),
      unit: currentTenant.unit,
      tenantName: currentTenant.name,
      description,
      priority,
      status: "Pending",
      dateSubmitted: new Date().toISOString().slice(0, 10),
    };
    // Becomes a POST to the Flask API later.
    setTickets((prev) => [newTicket, ...prev]);
  }

  return (
    <div className="maintenance-view">
      <h1>Maintenance requests</h1>
      <DashboardTabs tabs={TABS} />

      <TicketForm onSubmit={handleNewTicket} />

      {tickets.length === 0 ? (
        <p className="empty-text">No requests yet.</p>
      ) : (
        <div className="ticket-list">
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
}

export default MaintenanceView;


