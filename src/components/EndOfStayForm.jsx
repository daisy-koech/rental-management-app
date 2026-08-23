import { useState } from "react";
import "./EndOfStayForm.css";

function EndOfStayForm({ onSubmit }) {
  const [moveOutDate, setMoveOutDate] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    if (!moveOutDate) return;
    // Local state only for now. This becomes a POST to the Flask API
    // once end of stay notices are a real resource.
    onSubmit({ moveOutDate, reason, message });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="end-of-stay-confirmation">
        Your notice has been recorded. The landlord will be in touch to confirm the details.
      </div>
    );
  }

  return (
    <form className="end-of-stay-form" onSubmit={handleSubmit}>
      <label htmlFor="move-out-date">Intended move out date</label>
      <input
        id="move-out-date"
        type="date"
        value={moveOutDate}
        onChange={(event) => setMoveOutDate(event.target.value)}
        required
      />

      <label htmlFor="reason">Reason (optional)</label>
      <input
        id="reason"
        type="text"
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        placeholder="For example: relocating for work"
      />

      <label htmlFor="eos-message">Additional message (optional)</label>
      <textarea
        id="eos-message"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        rows={3}
      />

      <button type="submit">Submit notice</button>
    </form>
  );
}

export default EndOfStayForm;

