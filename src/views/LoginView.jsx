import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";
import "./LoginView.css";

function LoginView() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const user = await login(email, password);
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
        <span className="login-eyebrow">WELCOME BACK</span>
        <h1>Sign in to Cedar Court</h1>
        <p className="login-subtitle">
          Enter your details to reach your dashboard.
        </p>

        <form onSubmit={handleSubmit} className="login-form">
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

          {error && <p className="login-error">{error}</p>}

          <button
            type="submit"
            className="btn-primary login-submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginView;

