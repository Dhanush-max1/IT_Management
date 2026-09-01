import React, { useState } from "react";
import "./Auth.css";

const API_BASE = "http://127.0.0.1:8000/api";

function Register({ goToLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const trimmedUsername = username.trim();

    if (!trimmedUsername || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/accounts/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: trimmedUsername,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Extract DRF validation errors dynamically
        if (data.username) {
          setError(`Username: ${data.username.join(" ")}`);
        } else if (data.password) {
          setError(`Password: ${data.password.join(" ")}`);
        } else if (data.detail) {
          setError(data.detail);
        } else {
          setError("Registration failed. Please check your credentials.");
        }
        setLoading(false);
        return;
      }

      setSuccess("Account created successfully! Redirecting to login...");

      // Short delay before sending user back to login screen
      setTimeout(() => {
        if (goToLogin) goToLogin();
      }, 1500);
    } catch (err) {
      console.error("Registration error:", err);
      setError("Unable to connect to server. Please ensure backend is running.");
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>IT Management</h1>
        <h2>Create Account</h2>

        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="success-message" role="status">
            {success}
          </div>
        )}

        <form onSubmit={handleRegister} noValidate>
          <div className="form-group">
            <label htmlFor="reg-username">Username</label>
            <input
              id="reg-username"
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-confirm-password">Confirm Password</label>
            <input
              id="reg-confirm-password"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              disabled={loading}
              required
            />
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="register-section">
          <p>Already have an account?</p>
          <button
            type="button"
            className="register-link"
            onClick={goToLogin}
            disabled={loading}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;