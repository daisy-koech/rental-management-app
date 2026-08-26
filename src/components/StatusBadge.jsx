import "./StatusBadge.css";

const STYLES = {
  active: {
    label: "Active",
    className: "status-badge status-good",
  },

  paid: {
    label: "Paid",
    className: "status-badge status-good",
  },

  occupied: {
    label: "Occupied",
    className: "status-badge status-good",
  },

  resolved: {
    label: "Resolved",
    className: "status-badge status-good",
  },

  due: {
    label: "Due",
    className: "status-badge status-warn",
  },

  pending: {
    label: "Pending",
    className: "status-badge status-warn",
  },

  in_progress: {
    label: "In Progress",
    className: "status-badge status-warn",
  },

  overdue: {
    label: "Overdue",
    className: "status-badge status-bad",
  },

  "not paid": {
    label: "Not Paid",
    className: "status-badge status-bad",
  },

  vacant: {
    label: "Vacant",
    className: "status-badge status-neutral",
  },
};

function StatusBadge({ status }) {
  const normalizedStatus = status?.toLowerCase() || "";

  const config =
    STYLES[normalizedStatus] || {
      label: status,
      className: "status-badge status-neutral",
    };

  return (
    <span className={config.className}>
      {config.label}
    </span>
  );
}

export default StatusBadge;
