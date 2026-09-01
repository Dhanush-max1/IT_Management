import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/repairs/";

function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("access_token");

      if (!token) {
        setError("Please login again.");
        return;
      }

      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      console.log("Repair Tickets API:", response.data);

      let data = response.data;

      // DRF pagination
      if (data && Array.isArray(data.results)) {
        data = data.results;
      }

      // Normal array
      if (Array.isArray(data)) {
        setTickets(data);
      } else {
        setError("Invalid ticket data received from server.");
      }
    } catch (err) {
      console.error("Ticket API Error:", err);

      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
      } else if (err.response?.status === 404) {
        setError("Repair tickets API not found.");
      } else {
        setError("Unable to load repair tickets.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    const value = String(status || "").toLowerCase();

    if (
      value.includes("open") ||
      value.includes("pending")
    ) {
      return styles.pending;
    }

    if (
      value.includes("progress") ||
      value.includes("assigned")
    ) {
      return styles.progress;
    }

    if (
      value.includes("close") ||
      value.includes("complete") ||
      value.includes("resolved") ||
      value.includes("return")
    ) {
      return styles.resolved;
    }

    return styles.defaultBadge;
  };

  const getAssetName = (ticket) => {
    if (ticket.asset_name) return ticket.asset_name;

    if (ticket.asset?.name) return ticket.asset.name;

    if (typeof ticket.asset === "string") return ticket.asset;

    if (typeof ticket.asset === "number") {
      return `Asset #${ticket.asset}`;
    }

    return "-";
  };

  const getTechnicianName = (ticket) => {
    if (ticket.assigned_technician_name) {
      return ticket.assigned_technician_name;
    }

    if (ticket.assigned_technician?.username) {
      return ticket.assigned_technician.username;
    }

    if (ticket.assigned_technician?.name) {
      return ticket.assigned_technician.name;
    }

    if (typeof ticket.assigned_technician === "string") {
      return ticket.assigned_technician;
    }

    if (typeof ticket.assigned_technician === "number") {
      return `Technician #${ticket.assigned_technician}`;
    }

    return "Not assigned";
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <p>Loading repair tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>

      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>🛠️ Repair Tickets</h1>
          <p style={styles.subtitle}>
            Manage and monitor hardware maintenance requests
          </p>
        </div>

        <button
          onClick={fetchTickets}
          style={styles.refreshButton}
        >
          🔄 Refresh
        </button>
      </div>

      {error && (
        <div style={styles.error}>
          ⚠️ {error}
        </div>
      )}

      <div style={styles.stats}>
        <div style={styles.statCard}>
          <span style={styles.statIcon}>🛠️</span>
          <div>
            <p style={styles.statLabel}>Total Tickets</p>
            <h2 style={styles.statNumber}>{tickets.length}</h2>
          </div>
        </div>
      </div>

      <div style={styles.card}>

        <div style={styles.cardHeader}>
          <h2 style={styles.cardTitle}>
            Repair Ticket List
          </h2>

          <span style={styles.count}>
            {tickets.length} Tickets
          </span>
        </div>

        {tickets.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>🛠️</div>
            <h3>No Repair Tickets</h3>
            <p>No repair tickets are currently available.</p>
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>

              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Asset</th>
                  <th style={styles.th}>Issue</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Technician</th>
                </tr>
              </thead>

              <tbody>
                {tickets.map((ticket, index) => {

                  const status = ticket.status || "Unknown";

                  return (
                    <tr key={ticket.id || index}>

                      <td style={styles.td}>
                        <span style={styles.id}>
                          #{ticket.id || index + 1}
                        </span>
                      </td>

                      <td style={styles.td}>
                        <strong style={styles.asset}>
                          {getAssetName(ticket)}
                        </strong>
                      </td>

                      <td style={styles.td}>
                        {ticket.issue || "-"}
                      </td>

                      <td style={styles.td}>
                        <span style={getStatusClass(status)}>
                          {status}
                        </span>
                      </td>

                      <td style={styles.td}>
                        {getTechnicianName(ticket)}
                      </td>

                    </tr>
                  );
                })}
              </tbody>

            </table>
          </div>
        )}

      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    padding: "30px",
    background:
      "linear-gradient(135deg, #0f172a, #1e293b, #0f172a)",
    color: "#f8fafc",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    boxSizing: "border-box",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
    gap: "20px",
  },

  title: {
    margin: 0,
    fontSize: "30px",
    fontWeight: "700",
  },

  subtitle: {
    marginTop: "7px",
    color: "#94a3b8",
    fontSize: "15px",
  },

  refreshButton: {
    border: "none",
    borderRadius: "10px",
    padding: "11px 18px",
    background: "#2563eb",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
  },

  error: {
    padding: "15px",
    marginBottom: "20px",
    borderRadius: "10px",
    background: "rgba(239,68,68,0.15)",
    border: "1px solid rgba(239,68,68,0.3)",
    color: "#fca5a5",
  },

  stats: {
    display: "flex",
    marginBottom: "25px",
  },

  statCard: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "18px 25px",
    borderRadius: "14px",
    background: "rgba(30,41,59,0.8)",
    border: "1px solid rgba(255,255,255,0.08)",
  },

  statIcon: {
    fontSize: "30px",
  },

  statLabel: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "13px",
  },

  statNumber: {
    margin: "3px 0 0",
    fontSize: "25px",
  },

  card: {
    background: "rgba(30,41,59,0.75)",
    borderRadius: "16px",
    padding: "22px",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 15px 40px rgba(0,0,0,0.25)",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  cardTitle: {
    margin: 0,
    fontSize: "20px",
  },

  count: {
    color: "#94a3b8",
    fontSize: "14px",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    padding: "15px",
    color: "#94a3b8",
    fontSize: "12px",
    textTransform: "uppercase",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },

  td: {
    padding: "17px 15px",
    color: "#cbd5e1",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  },

  id: {
    color: "#60a5fa",
    fontWeight: "700",
  },

  asset: {
    color: "#f8fafc",
  },

  pending: {
    display: "inline-block",
    padding: "5px 11px",
    borderRadius: "20px",
    background: "rgba(245,158,11,0.15)",
    color: "#fcd34d",
    fontSize: "12px",
    fontWeight: "600",
  },

  progress: {
    display: "inline-block",
    padding: "5px 11px",
    borderRadius: "20px",
    background: "rgba(59,130,246,0.15)",
    color: "#93c5fd",
    fontSize: "12px",
    fontWeight: "600",
  },

  resolved: {
    display: "inline-block",
    padding: "5px 11px",
    borderRadius: "20px",
    background: "rgba(34,197,94,0.15)",
    color: "#86efac",
    fontSize: "12px",
    fontWeight: "600",
  },

  defaultBadge: {
    display: "inline-block",
    padding: "5px 11px",
    borderRadius: "20px",
    background: "rgba(148,163,184,0.15)",
    color: "#cbd5e1",
    fontSize: "12px",
    fontWeight: "600",
  },

  empty: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#94a3b8",
  },

  emptyIcon: {
    fontSize: "50px",
    marginBottom: "10px",
  },

  loading: {
    minHeight: "70vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#94a3b8",
  },

  spinner: {
    width: "35px",
    height: "35px",
    border: "4px solid #334155",
    borderTop: "4px solid #3b82f6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "15px",
  },
};

export default Tickets;