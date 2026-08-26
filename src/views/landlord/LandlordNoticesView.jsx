import { useEffect, useState } from "react";
import {
  getLandlordNotices,
  createLandlordNotice,
  updateLandlordNotice,
  deleteLandlordNotice,
} from "../../services/api";
import DashboardTabs from "../../components/DashboardTabs";
import "./LandlordNoticesView.css";

const TABS = [
  { label: "Overview", to: "/landlord", end: true },
  { label: "Units", to: "/landlord/units" },
  { label: "Maintenance", to: "/landlord/tickets" },
  { label: "Payments", to: "/landlord/payments" },
  { label: "Leases", to: "/landlord/leases" },
  { label: "Notices", to: "/landlord/notices" },
];

function LandlordNoticesView() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadNotices() {
      try {
        const data = await getLandlordNotices();
        setNotices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadNotices();
  }, []);

  function openCreateForm() {
    setEditingNotice(null);
    setTitle("");
    setMessage("");
    setError("");
    setShowForm(true);
  }

  function openEditForm(notice) {
    setEditingNotice(notice);
    setTitle(notice.title);
    setMessage(notice.message);
    setError("");
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingNotice(null);
    setTitle("");
    setMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim() || !message.trim()) {
      setError("Title and message are required.");
      return;
    }

    try {
      setError("");

      if (editingNotice) {
        const updatedNotice = await updateLandlordNotice(
          editingNotice.id,
          title,
          message
        );

        setNotices((prev) =>
          prev.map((notice) =>
            notice.id === editingNotice.id
              ? updatedNotice
              : notice
          )
        );
      } else {
        const newNotice = await createLandlordNotice(
          title,
          message
        );

        setNotices((prev) => [newNotice, ...prev]);
      }

      closeForm();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(noticeId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this notice?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteLandlordNotice(noticeId);

      setNotices((prev) =>
        prev.filter((notice) => notice.id !== noticeId)
      );
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="landlord-notices-view">
      <h1>Property notices</h1>

      <DashboardTabs tabs={TABS} />

      <div className="notices-header">
        <button
          type="button"
          onClick={openCreateForm}
        >
          Add notice
        </button>
      </div>

      {error && (
        <p className="dashboard-error">
          {error}
        </p>
      )}

      {showForm && (
        <form
          className="notice-form"
          onSubmit={handleSubmit}
        >
          <h2>
            {editingNotice
              ? "Edit notice"
              : "Add notice"}
          </h2>

          <label htmlFor="notice-title">
            Title
          </label>

          <input
            id="notice-title"
            type="text"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            placeholder="e.g. Water interruption"
          />

          <label htmlFor="notice-message">
            Message
          </label>

          <textarea
            id="notice-message"
            value={message}
            onChange={(event) =>
              setMessage(event.target.value)
            }
            placeholder="Write the notice for tenants..."
            rows={5}
          />

          <div className="notice-form-actions">
            <button type="submit">
              {editingNotice
                ? "Save changes"
                : "Publish notice"}
            </button>

            <button
              type="button"
              onClick={closeForm}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading && (
        <p>Loading notices...</p>
      )}

      {!loading && !error && notices.length === 0 && (
        <p className="empty-text">
          No notices have been created yet.
        </p>
      )}

      {!loading && notices.length > 0 && (
        <div className="notice-list">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className="notice-item"
            >
              <div className="notice-content">
                <h2>{notice.title}</h2>

                <p>{notice.message}</p>

                {notice.created_at && (
                  <span className="notice-date">
                    {new Date(
                      notice.created_at
                    ).toLocaleDateString()}
                  </span>
                )}
              </div>

              <div className="notice-actions">
                <button
                  type="button"
                  onClick={() =>
                    openEditForm(notice)
                  }
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleDelete(notice.id)
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LandlordNoticesView;
