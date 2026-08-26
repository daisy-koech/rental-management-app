import StatusBadge from "./StatusBadge";
import "./TicketCard.css";

function TicketCard({ ticket, showUnit = false }) {
  const submittedDate = ticket.created_at
    ? new Date(ticket.created_at).toLocaleDateString()
    : "—";

  return (
    <div className="ticket-card">
      <div className="ticket-card-header">
        <div>
          <p className="ticket-title">
            {ticket.title}
          </p>

          <p className="ticket-description">
            {ticket.description}
          </p>
        </div>

        <StatusBadge status={ticket.status} />
      </div>

      <div className="ticket-meta">
        {showUnit && (
          <span>Unit {ticket.unit_id}</span>
        )}

        <span>
          Submitted {submittedDate}
        </span>
      </div>
    </div>
  );
}

export default TicketCard;
