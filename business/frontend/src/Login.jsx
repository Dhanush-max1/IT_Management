import React, { useState } from "react";
import "./Auth.css";

const API_BASE = "http://localhost:8000/api";

function Login({ onLogin, goToRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    const trimmedUsername = username.trim();
d
    if (!trimmedUsername || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          username: trimmedUsername,
          password: password,
        }),
      });

      const data = await response.json();

      console.log("Login response:", response.status, data);

      // =========================
      // LOGIN FAILED
      // =========================

      if (!response.ok) {
        setError(
          data?.detail ||
            data?.non_field_errors?.[0] ||
            "Invalid username or password."
        );
        return;
      }

      // =========================
      // CHECK ACCESS TOKEN
      // =========================

      if (!data?.access) {
        console.error("No access token returned:", data);

        setError(
          "Login failed. Access token was not returned by the server."
        );

        return;
      }

      // =========================
      // CLEAR OLD TOKENS
      // =========================

      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      // =========================
      // SAVE NEW JWT TOKENS
      // =========================

      localStorage.setItem(
        "access_token",
        data.access
      );

      if (data?.refresh) {
        localStorage.setItem(
          "refresh_token",
          data.refresh
        );
      }

      // =========================
      // VERIFY TOKENS
      // =========================

      console.log(
        "Access token saved:",
        localStorage.getItem("access_token")
      );

      console.log(
        "Refresh token saved:",
        localStorage.getItem("refresh_token")
      );

      console.log("Login successful ✅");

      // =========================
      // TELL APP.JSX
      // =========================

      if (typeof onLogin === "function") {
        onLogin({
          access: data.access,
          refresh: data.refresh,
        });
      }

    } catch (err) {
      console.error("Login error:", err);

      setError(
        "Unable to connect to server. Please check the Django backend."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // REGISTER
  // =========================

  const handleRegister = () => {
    setError("");

    if (typeof goToRegister === "function") {
      goToRegister();
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        {/* =========================
            HEADER
        ========================= */}

        <h1>IT Management</h1>

        <h2>Login</h2>

        {/* =========================
            ERROR
        ========================= */}

        {error && (
          <div
            className="error-message"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* =========================
            LOGIN FORM
        ========================= */}

        <form
          onSubmit={handleLogin}
          noValidate
        >

          {/* USERNAME */}

          <div className="form-group">

            <label htmlFor="username-input">
              Username
            </label>

            <input
              id="username-input"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              autoComplete="username"
              disabled={loading}
              required
            />

          </div>

          {/* PASSWORD */}

          <div className="form-group">

            <label htmlFor="password-input">
              Password
            </label>

            <div className="password-wrapper">

              <input
                id="password-input"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                autoComplete="current-password"
                disabled={loading}
                required
              />

              <button
                type="button"
                className="toggle-password"
                onClick={() =>
                  setShowPassword(
                    (prev) => !prev
                  )
                }
                disabled={loading}
              >
                {showPassword
                  ? "Hide"
                  : "Show"}
              </button>

            </div>

          </div>

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        {/* =========================
            REGISTER
        ========================= */}

        <div className="register-section">

          <p>
            Don't have an account?
          </p>

          <button
            type="button"
            className="register-link"
            onClick={handleRegister}
            disabled={loading}
          >
            Create Account
          </button>

        </div>

      </div>
    </div>
  );
}

export default Login;