import React, { useState } from "react";
import { BrowserRouter } from "react-router-dom";

import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import AIAssistant from "./AIAssistant";
import Assets from "./Assets";
import Inventory from "./Inventory";
import Accounts from "./Accounts";
import Assignments from "./Assignments";
import Tickets from "./Tickets";
import Login from "./Login";
import Register from "./Register";

function App() {
  // Check if JWT already exists
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("access_token")
  );

  const [authPage, setAuthPage] = useState("login");
  const [page, setPage] = useState("dashboard");

  const handleLogin = (data) => {
    console.log("App received login data:", data);

    // Save tokens here as an extra safety measure
    if (data?.access) {
      localStorage.setItem("access_token", data.access);
    }

    if (data?.refresh) {
      localStorage.setItem("refresh_token", data.refresh);
    }

    setLoggedIn(true);
    setPage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    setLoggedIn(false);
    setAuthPage("login");
    setPage("dashboard");
  };

  // =========================
  // LOGIN / REGISTER
  // =========================

  if (!loggedIn) {
    return (
      <BrowserRouter>
        {authPage === "login" ? (
          <Login
            onLogin={handleLogin}
            goToRegister={() => setAuthPage("register")}
          />
        ) : (
          <Register
            goToLogin={() => setAuthPage("login")}
          />
        )}
      </BrowserRouter>
    );
  }

  // =========================
  // MAIN APPLICATION
  // =========================

  return (
    <BrowserRouter>
      <div style={{ minHeight: "100vh" }}>

        <Sidebar
          setPage={setPage}
          activePage={page}
          onLogout={handleLogout}
        />

        <main
          style={{
            marginLeft: "250px",
            padding: "30px",
            minHeight: "100vh",
          }}
        >

          {page === "dashboard" && (
            <Dashboard />
          )}

          {page === "ai" && (
            <AIAssistant />
          )}

          {page === "assets" && (
            <Assets />
          )}

          {page === "inventory" && (
            <Inventory />
          )}

          {page === "accounts" && (
            <Accounts />
          )}

          {page === "assignments" && (
            <Assignments />
          )}

          {page === "tickets" && (
            <Tickets />
          )}

        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;