import { useState } from "react";
import "./TicketForm.css";

function TicketForm({ onSubmit }) {
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");

  function handleSubmit(event) {
    event.preventDefault();
    if (!description.trim()) return;
    onSubmit({ description, priority });
    setDescription("");
    setPriority("Medium");
  }

  return (
    <form className="ticket-form" onSubmit={handleSubmit}>
      <label htmlFor="ticket-description">Describe the issue</label>
      <textarea
        id="ticket-description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="For example: Kitchen sink is leaking"
        rows={3}
      />

      <label htmlFor="ticket-priority">Priority</label>
      <select id="ticket-priority" value={priority} onChange={(event) => setPriority(event.target.value)}>
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>

      <button type="submit">Submit request</button>
    </form>
  );
}

export default TicketForm;
