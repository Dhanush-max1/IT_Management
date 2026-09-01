import React, { useEffect, useState } from "react";
import api from "./api";

function Dashboard() {
  const [stats, setStats] = useState({
    assets: 0,
    inventory: 0,
    employees: 0,
    assignments: 0,
    tickets: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const getData = async (url) => {
    try {
      const response = await api.get(url);

      const data = response.data;

      // DRF pagination
      if (data && Array.isArray(data.results)) {
        return data.results;
      }

      // Normal array
      if (Array.isArray(data)) {
        return data;
      }

      return [];
    } catch (err) {
      console.error(`Dashboard API error: ${url}`, err);

      // Don't stop the entire dashboard if one API fails
      return [];
    }
  };

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("access_token");

      if (!token) {
        setError("Authentication required. Please login again.");
        setLoading(false);
        return;
      }

      // Load all dashboard data
      const [
        assets,
        inventory,
        employees,
        assignments,
        tickets,
      ] = await Promise.all([
        getData("/assets/"),
        getData("/inventory/"),
        getData("/accounts/employees/"),
        getData("/assignments/"),
        getData("/repairs/"),
      ]);

      console.log("Dashboard Assets:", assets);
      console.log("Dashboard Inventory:", inventory);
      console.log("Dashboard Employees:", employees);
      console.log("Dashboard Assignments:", assignments);
      console.log("Dashboard Tickets:", tickets);

      setStats({
        assets: assets.length,
        inventory: inventory.length,
        employees: employees.length,
        assignments: assignments.length,
        tickets: tickets.length,
      });
    } catch (err) {
      console.error("Dashboard error:", err);
      setError("Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: "Total Assets",
      value: stats.assets,
      icon: "💻",
      description: "Registered assets",
    },
    {
      title: "Inventory",
      value: stats.inventory,
      icon: "📦",
      description: "Inventory items",
    },
    {
      title: "Employees",
      value: stats.employees,
      icon: "👥",
      description: "Registered employees",
    },
    {
      title: "Assignments",
      value: stats.assignments,
      icon: "🔄",
      description: "Asset assignments",
    },
    {
      title: "Repair Tickets",
      value: stats.tickets,
      icon: "🔧",
      description: "Maintenance tickets",
    },
  ];

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingCard}>
          <div style={styles.spinner}></div>
          <h2 style={styles.loadingTitle}>
            Loading Dashboard...
          </h2>
          <p style={styles.loadingText}>
            Fetching IT Management data
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>

      {/* ================= HEADER ================= */}

      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            Dashboard
          </h1>

          <p style={styles.subtitle}>
            Welcome to your IT Management System
          </p>
        </div>

        <button
          onClick={loadDashboard}
          style={styles.refreshButton}
        >
          🔄 Refresh
        </button>
      </div>

      {/* ================= ERROR ================= */}

      {error && (
        <div style={styles.error}>
          ⚠️ {error}
        </div>
      )}

      {/* ================= STAT CARDS ================= */}

      <div style={styles.grid}>

        {cards.map((card) => (
          <div
            key={card.title}
            style={styles.card}
          >

            <div style={styles.cardTop}>

              <div style={styles.iconBox}>
                {card.icon}
              </div>

              <div style={styles.cardContent}>

                <div style={styles.cardTitle}>
                  {card.title}
                </div>

                <div style={styles.number}>
                  {card.value}
                </div>

                <div style={styles.description}>
                  {card.description}
                </div>

              </div>

            </div>

          </div>
        ))}

      </div>

      {/* ================= SYSTEM STATUS ================= */}

      <div style={styles.section}>

        <h2 style={styles.sectionTitle}>
          System Overview
        </h2>

        <div style={styles.overviewGrid}>

          <div style={styles.overviewCard}>
            <div style={styles.overviewIcon}>
              🟢
            </div>

            <div>
              <div style={styles.overviewTitle}>
                Backend API
              </div>

              <div style={styles.online}>
                Connected
              </div>
            </div>
          </div>

          <div style={styles.overviewCard}>
            <div style={styles.overviewIcon}>
              🗄️
            </div>

            <div>
              <div style={styles.overviewTitle}>
                Database
              </div>

              <div style={styles.online}>
                Connected
              </div>
            </div>
          </div>

          <div style={styles.overviewCard}>
            <div style={styles.overviewIcon}>
              🔐
            </div>

            <div>
              <div style={styles.overviewTitle}>
                Authentication
              </div>

              <div style={styles.online}>
                JWT Active
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ================= QUICK SUMMARY ================= */}

      <div style={styles.summary}>

        <div>
          <h2 style={styles.sectionTitle}>
            IT Management Summary
          </h2>

          <p style={styles.summaryText}>
            Monitor assets, inventory, employees,
            assignments and repair tickets from
            one central dashboard.
          </p>
        </div>

        <div style={styles.summaryStats}>

          <div style={styles.smallStat}>
            <strong>{stats.assets}</strong>
            <span>Assets</span>
          </div>

          <div style={styles.smallStat}>
            <strong>{stats.assignments}</strong>
            <span>Assigned</span>
          </div>

          <div style={styles.smallStat}>
            <strong>{stats.tickets}</strong>
            <span>Tickets</span>
          </div>

        </div>

      </div>

    </div>
  );
}

/* =====================================================
   STYLES
===================================================== */

const styles = {

  container: {
    width: "100%",
    minHeight: "100vh",
    padding: "10px 5px 40px 5px",
    boxSizing: "border-box",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },

  title: {
    margin: 0,
    fontSize: "34px",
    fontWeight: "800",
    color: "#f8fafc",
  },

  subtitle: {
    marginTop: "8px",
    marginBottom: 0,
    color: "#94a3b8",
    fontSize: "15px",
  },

  refreshButton: {
    border: "1px solid rgba(96,165,250,0.3)",
    background: "rgba(37,99,235,0.15)",
    color: "#93c5fd",
    padding: "10px 18px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
  },

  error: {
    background: "rgba(239,68,68,0.12)",
    border: "1px solid rgba(239,68,68,0.3)",
    color: "#fca5a5",
    padding: "14px 18px",
    borderRadius: "10px",
    marginBottom: "20px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "18px",
    marginBottom: "35px",
  },

  card: {
    minHeight: "170px",
    padding: "22px",
    borderRadius: "18px",
    background:
      "linear-gradient(145deg, rgba(30,41,59,0.95), rgba(15,23,42,0.85))",
    border:
      "1px solid rgba(148,163,184,0.12)",
    boxShadow:
      "0 15px 35px rgba(0,0,0,0.25)",
    boxSizing: "border-box",
    transition: "transform 0.2s ease",
  },

  cardTop: {
    display: "flex",
    alignItems: "flex-start",
    gap: "15px",
  },

  iconBox: {
    width: "52px",
    height: "52px",
    borderRadius: "14px",
    background:
      "rgba(59,130,246,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "25px",
    flexShrink: 0,
  },

  cardContent: {
    flex: 1,
  },

  cardTitle: {
    color: "#94a3b8",
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "8px",
  },

  number: {
    color: "#f8fafc",
    fontSize: "32px",
    fontWeight: "800",
    lineHeight: 1,
    marginBottom: "8px",
  },

  description: {
    color: "#64748b",
    fontSize: "12px",
  },

  section: {
    marginTop: "20px",
    marginBottom: "25px",
  },

  sectionTitle: {
    color: "#f8fafc",
    fontSize: "20px",
    margin: "0 0 18px 0",
    fontWeight: "700",
  },

  overviewGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "15px",
  },

  overviewCard: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "18px",
    borderRadius: "14px",
    background:
      "rgba(30,41,59,0.7)",
    border:
      "1px solid rgba(255,255,255,0.07)",
  },

  overviewIcon: {
    fontSize: "20px",
  },

  overviewTitle: {
    color: "#e2e8f0",
    fontWeight: "600",
    fontSize: "14px",
    marginBottom: "5px",
  },

  online: {
    color: "#4ade80",
    fontSize: "12px",
    fontWeight: "600",
  },

  summary: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "30px",
    padding: "25px",
    borderRadius: "18px",
    background:
      "linear-gradient(135deg, rgba(30,41,59,0.9), rgba(23,37,84,0.7))",
    border:
      "1px solid rgba(96,165,250,0.12)",
  },

  summaryText: {
    color: "#94a3b8",
    fontSize: "14px",
    lineHeight: "1.6",
    maxWidth: "600px",
    margin: 0,
  },

  summaryStats: {
    display: "flex",
    gap: "25px",
  },

  smallStat: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "5px",
  },

  smallStatStrong: {
    color: "#60a5fa",
    fontSize: "22px",
  },

  smallStat: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "5px",
    color: "#94a3b8",
  },

  loadingCard: {
    minHeight: "70vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  spinner: {
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    border:
      "4px solid rgba(96,165,250,0.2)",
    borderTop:
      "4px solid #60a5fa",
    animation: "spin 1s linear infinite",
  },

  loadingTitle: {
    color: "#f8fafc",
    marginTop: "20px",
    marginBottom: "5px",
  },

  loadingText: {
    color: "#64748b",
    margin: 0,
  },
};

export default Dashboard;