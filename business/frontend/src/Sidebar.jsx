import React from "react";

function Sidebar({ setPage, activePage, onLogout }) {

  const menuItems = [
    {
      id: "dashboard",
      icon: "🏠",
      label: "Dashboard",
    },
    {
      id: "assets",
      icon: "💻",
      label: "Assets",
    },
    {
      id: "inventory",
      icon: "📦",
      label: "Inventory",
    },
    {
      id: "accounts",
      icon: "👥",
      label: "Accounts",
    },
    {
      id: "assignments",
      icon: "🔄",
      label: "Assignments",
    },
    {
      id: "tickets",
      icon: "🔧",
      label: "Repair Tickets",
    },
    {
      id: "ai",
      icon: "🤖",
      label: "AI Assistant",
    },
  ];

  return (
    <aside style={styles.sidebar}>

      {/* LOGO */}
      <div style={styles.logo}>
        <span style={styles.logoIcon}>💻</span>

        <div>
          <div style={styles.logoTitle}>
            IT Management
          </div>

          <div style={styles.logoSubtitle}>
            System
          </div>
        </div>
      </div>

      {/* MENU */}
      <div style={styles.menu}>

        {menuItems.map((item) => {

          const active = activePage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              style={{
                ...styles.button,
                ...(active ? styles.activeButton : {}),
              }}
            >

              <span style={styles.icon}>
                {item.icon}
              </span>

              <span>
                {item.label}
              </span>

            </button>
          );
        })}

      </div>

      {/* FOOTER */}
      <div style={styles.footer}>

        <div style={styles.footerText}>
          IT Management System
        </div>

        <div style={styles.version}>
          v1.0
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            style={styles.logout}
          >
            🚪 Logout
          </button>
        )}

      </div>

    </aside>
  );
}

const styles = {

  sidebar: {
    position: "fixed",
    left: 0,
    top: 0,
    bottom: 0,

    width: "250px",

    background:
      "linear-gradient(180deg, #172554 0%, #1e3a8a 50%, #172554 100%)",

    borderRight: "1px solid rgba(255,255,255,0.1)",

    display: "flex",
    flexDirection: "column",

    padding: "25px 15px",

    boxSizing: "border-box",

    zIndex: 1000,

    boxShadow:
      "5px 0 25px rgba(0,0,0,0.25)",
  },

  logo: {
    display: "flex",
    alignItems: "center",

    gap: "12px",

    padding: "5px 10px 30px 10px",

    borderBottom:
      "1px solid rgba(255,255,255,0.1)",
  },

  logoIcon: {
    fontSize: "28px",
  },

  logoTitle: {
    color: "#ffffff",

    fontSize: "18px",

    fontWeight: "700",
  },

  logoSubtitle: {
    color: "#93c5fd",

    fontSize: "11px",

    marginTop: "2px",
  },

  menu: {
    display: "flex",

    flexDirection: "column",

    gap: "8px",

    marginTop: "25px",
  },

  button: {
    width: "100%",

    display: "flex",

    alignItems: "center",

    gap: "12px",

    padding: "13px 15px",

    border: "none",

    borderRadius: "10px",

    background: "transparent",

    color: "#cbd5e1",

    fontSize: "14px",

    fontWeight: "600",

    cursor: "pointer",

    textAlign: "left",

    transition: "all 0.2s ease",
  },

  activeButton: {
    background:
      "linear-gradient(90deg, #2563eb, #3b82f6)",

    color: "#ffffff",

    boxShadow:
      "0 5px 15px rgba(37,99,235,0.35)",
  },

  icon: {
    width: "25px",

    textAlign: "center",

    fontSize: "17px",
  },

  footer: {
    marginTop: "auto",

    padding:
      "20px 10px 5px",

    borderTop:
      "1px solid rgba(255,255,255,0.1)",

    textAlign: "center",
  },

  footerText: {
    color: "#94a3b8",

    fontSize: "11px",
  },

  version: {
    color: "#64748b",

    fontSize: "10px",

    marginTop: "4px",
  },

  logout: {
    marginTop: "15px",

    width: "100%",

    padding: "9px",

    borderRadius: "8px",

    border:
      "1px solid rgba(239,68,68,0.3)",

    background:
      "rgba(239,68,68,0.1)",

    color: "#fca5a5",

    cursor: "pointer",

    fontWeight: "600",
  },
};

export default Sidebar;