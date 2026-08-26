import { useEffect, useState } from "react";
import {getMyMaintenanceTickets, createMaintenanceTicket,}
from "../../services/api";
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
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTickets() {
      try {
        const data = await getMyMaintenanceTickets();
        setTickets(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadTickets();
  }, []);

  async function handleNewTicket({ title, description }) {
    try {
      setError("");

      const newTicket = await createMaintenanceTicket(
        title,
        description
      );

      setTickets((prev) => [newTicket, ...prev]);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="maintenance-view">
      <h1>Maintenance requests</h1>

      <DashboardTabs tabs={TABS} />

      {error && (
        <p className="error-text">
          {error}
        </p>
      )}

      <TicketForm onSubmit={handleNewTicket} />

      {loading && (
        <p>Loading maintenance requests...</p>
      )}

      {!loading && tickets.length === 0 && (
        <p className="empty-text">
          No requests yet.
        </p>
      )}

      {!loading && tickets.length > 0 && (
        <div className="ticket-list">
          {tickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MaintenanceView;


