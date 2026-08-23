import { NavLink } from "react-router-dom";
import "./DashboardTabs.css";

function DashboardTabs({ tabs }) {
  return (
    <div className="dashboard-tabs">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          {tab.label}
        </NavLink>
      ))}
    </div>
  );
}

export default DashboardTabs;
