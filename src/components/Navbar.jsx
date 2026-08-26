import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-title">Cedar Court</NavLink>

      <div className="navbar-links">
        <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>Home</NavLink>
        <NavLink to="/property" className={({ isActive }) => (isActive ? "active" : "")}>Property</NavLink>
        <NavLink to="/area" className={({ isActive }) => (isActive ? "active" : "")}>Location</NavLink>
        <NavLink to="/about" className={({ isActive }) => (isActive ? "active" : "")}>About</NavLink>
        <NavLink to="/login" className={({ isActive }) => (isActive ? "active" : "")}>Login</NavLink>
        <NavLink to="/tenant" className="navbar-cta">Tenant Dashboard</NavLink>
      </div>
    </nav>
  );
}

export default Navbar;


