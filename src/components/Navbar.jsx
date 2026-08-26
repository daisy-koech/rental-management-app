import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../services/api";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

async function handleLogout() {
  try {
    await logout();
  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    localStorage.removeItem("user");
    navigate("/login");
  }
}

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-title">
        Cedar Court
      </NavLink>

      <div className="navbar-links">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/property"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          Property
        </NavLink>

        <NavLink
          to="/area"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          Location
        </NavLink>

        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          About
        </NavLink>

        {!user && (
          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Login
          </NavLink>
        )}

        {user?.role === "tenant" && (
          <NavLink
            to="/tenant"
            className="navbar-cta"
          >
            Tenant Dashboard
          </NavLink>
        )}

        {user?.role === "landlord" && (
          <NavLink
            to="/landlord"
            className="navbar-cta"
          >
            Landlord Dashboard
          </NavLink>
        )}

        {user && (
          <button
            type="button"
            className="navbar-logout"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

