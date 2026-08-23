import { useState } from "react";
import { notices as initialNotices } from "../../data/mockData";
import NoticeCard from "../../components/NoticeCard";
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
  const [notices, setNotices] = useState(initialNotices);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    if (!title.trim() || !message.trim()) return;

    const newNotice = {
      id: Date.now(),
      title,
      message,
      date: new Date().toISOString().slice(0, 10),
      audience: "all",
    };
    // Local state only for now, becomes a POST to the Flask API later.
    setNotices((prev) => [newNotice, ...prev]);
    setTitle("");
    setMessage("");
  }

  return (
    <div className="landlord-notices-view">
      <h1>Notices</h1>
      <DashboardTabs tabs={TABS} />

      <form className="notice-form" onSubmit={handleSubmit}>
        <label htmlFor="notice-title">Title</label>
        <input
          id="notice-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="For example: Water maintenance tomorrow"
        />

        <label htmlFor="notice-message">Message</label>
        <textarea
          id="notice-message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={3}
        />

        <button type="submit">Post notice</button>
      </form>

      {notices.map((notice) => (
        <NoticeCard key={notice.id} notice={notice} />
      ))}
    </div>
  );
}

export default LandlordNoticesView;
