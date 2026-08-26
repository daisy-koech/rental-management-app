import { useState } from "react";
import "./TicketForm.css";

function TicketForm({ onSubmit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");

  function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim() || !description.trim()) return;

    onSubmit({
      title,
      description,
      priority,
    });

    setTitle("");
    setDescription("");
    setPriority("Medium");
  }

  return (
    <form className="ticket-form" onSubmit={handleSubmit}>
      <label htmlFor="ticket-title">Issue</label>

      <input
        id="ticket-title"
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="For example: Kitchen sink leaking"
      />

      <label htmlFor="ticket-description">
        Describe the issue
      </label>

      <textarea
        id="ticket-description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Provide more details about the problem"
        rows={3}
      />

      <label htmlFor="ticket-priority">Priority</label>

      <select
        id="ticket-priority"
        value={priority}
        onChange={(event) => setPriority(event.target.value)}
      >
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>

      <button type="submit">
        Submit request
      </button>
    </form>
  );
}

export default TicketForm;
