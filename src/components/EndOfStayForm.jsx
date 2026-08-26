import { useState } from "react";
import { submitEndOfStay } from "../services/api";
import "./EndOfStayForm.css";

function EndOfStayForm({ onSubmit }) {
  const [moveOutDate, setMoveOutDate] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (!moveOutDate) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await submitEndOfStay({
        move_out_date: moveOutDate,
        reason: reason || null,
        notes: notes || null,
      });

      if (onSubmit) {
        onSubmit(data);
      }

      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="end-of-stay-confirmation">
        Your notice has been recorded. The landlord will be in touch to
        confirm the details.
      </div>
    );
  }

  return (
    <form
      className="end-of-stay-form"
      onSubmit={handleSubmit}
    >
      <label htmlFor="move-out-date">
        Intended move out date
      </label>

      <input
        id="move-out-date"
        type="date"
        value={moveOutDate}
        onChange={(event) =>
          setMoveOutDate(event.target.value)
        }
        required
      />

      <label htmlFor="reason">
        Reason (optional)
      </label>

      <input
        id="reason"
        type="text"
        value={reason}
        onChange={(event) =>
          setReason(event.target.value)
        }
        placeholder="For example: relocating for work"
      />

      <label htmlFor="eos-message">
        Additional message (optional)
      </label>

      <textarea
        id="eos-message"
        value={notes}
        onChange={(event) =>
          setNotes(event.target.value)
        }
        rows={3}
        placeholder="Add any additional information..."
      />

      {error && (
        <p className="form-error">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit notice"}
      </button>
    </form>
  );
}

export default EndOfStayForm;
