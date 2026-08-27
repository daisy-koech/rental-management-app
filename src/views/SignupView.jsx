import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/api";
import "./LoginView.css";

function SignupView() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("tenant");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const user = await register(name, email, password, role);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "landlord") {
        navigate("/landlord");
      } else if (user.role === "tenant") {
        navigate("/tenant");
      } else {
        setError("Unknown user role.");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-view">
      <div className="login-card">
        <span className="login-eyebrow">JOIN US</span>
        <h1>Create your Cedar Court account</h1>
        <p className="login-subtitle">
          Sign up to access your dashboard.
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="role">I am a</label>
            <select
              id="role"
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="login-select"
            >
              <option value="tenant">Tenant</option>
              <option value="landlord">Landlord</option>
            </select>
          </div>

          {error && <p className="login-error">{error}</p>}

          <button
            type="submit"
            className="btn-primary login-submit"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="login-switch">
          Already have an account? <a href="/login">Log in</a>
        </p>
      </div>
    </div>
  );
}

export default SignupView;