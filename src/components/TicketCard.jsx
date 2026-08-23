import StatusBadge from "./StatusBadge";
import "./TicketCard.css";

function TicketCard({ ticket, showUnit = false }) {
  return (
    <div className="ticket-card">
      <div className="ticket-card-header">
        <p className="ticket-description">{ticket.description}</p>
        <StatusBadge status={ticket.status} />
      </div>
      <div className="ticket-meta">
        {showUnit && <span>Unit {ticket.unit}</span>}
        <span>Priority: {ticket.priority}</span>
        <span>Submitted {ticket.dateSubmitted}</span>
      </div>
    </div>
  );
}

export default TicketCard;

