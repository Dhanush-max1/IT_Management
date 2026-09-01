import React, { useState, useRef, useEffect } from "react";
import api from "./api";

function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! 👋 I'm your IT Management AI Assistant. I can help you analyze assets, inventory, assignments, employees, and repair tickets.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  // =========================
  // AUTO SCROLL
  // =========================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  // =========================
  // SEND MESSAGE
  // =========================

  const sendMessage = async (customPrompt = null) => {
    const prompt = customPrompt || input.trim();

    if (!prompt || loading) return;

    const userMessage = {
      role: "user",
      content: prompt,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await api.post("/ai/", {
        prompt: prompt,
      });

      console.log("AI Response:", response.data);

const aiResponse =
  response.data?.reply ||
  response.data?.response ||
  response.data?.answer ||
  response.data?.message ||
  "I couldn't generate a response.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: aiResponse,
        },
      ]);
    } catch (error) {
      console.error("AI Assistant Error:", error);

      let errorMessage =
        "Sorry, something went wrong while connecting to the AI Assistant.";

      if (error.response?.status === 401) {
        errorMessage =
          "Your session has expired. Please login again.";
      }

      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }

      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `⚠️ ${errorMessage}`,
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // ENTER KEY
  // =========================

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // =========================
  // CLEAR CHAT
  // =========================

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Chat cleared. 👋 How can I help you with your IT Management System?",
      },
    ]);
  };

  // =========================
  // QUICK PROMPTS
  // =========================

  const quickPrompts = [
    {
      icon: "💻",
      title: "Asset Overview",
      text: "Give me an overview of all IT assets.",
    },
    {
      icon: "📦",
      title: "Inventory",
      text: "Show me the current inventory situation.",
    },
    {
      icon: "🔄",
      title: "Assignments",
      text: "Tell me about current asset assignments.",
    },
    {
      icon: "🔧",
      title: "Repair Tickets",
      text: "Summarize the current repair tickets.",
    },
  ];

  return (
    <div style={styles.page}>

      {/* =========================================
          HEADER
      ========================================= */}

      <div style={styles.header}>

        <div style={styles.headerLeft}>

          <div style={styles.aiLogo}>
            👨‍💼
          </div>

          <div>
            <h1 style={styles.title}>
              AI Assistant
            </h1>

            <p style={styles.subtitle}>
              Intelligent IT Management Assistant
            </p>
          </div>

        </div>

        <div style={styles.headerRight}>

          <div style={styles.status}>
            <span style={styles.statusDot}></span>
            AI Online
          </div>

          <button
            onClick={clearChat}
            style={styles.clearButton}
          >
            🗑️ Clear
          </button>

        </div>

      </div>

      {/* =========================================
          MAIN CHAT AREA
      ========================================= */}

      <div style={styles.chatContainer}>

        {/* Chat Header */}

        <div style={styles.chatHeader}>

          <div style={styles.chatHeaderLeft}>

            <div style={styles.smallAiLogo}>
              ✨
            </div>

            <div>
              <div style={styles.chatTitle}>
                IT Management AI
              </div>

              <div style={styles.chatSubtitle}>
                Ask questions about your system
              </div>
            </div>

          </div>

          <div style={styles.secureBadge}>
            🔐 Secure
          </div>

        </div>

        {/* =========================================
            MESSAGES
        ========================================= */}

        <div style={styles.messages}>

          {/* Welcome Section */}

          {messages.length === 1 && (
            <div style={styles.welcome}>

              <div style={styles.welcomeIcon}>
                👨‍💼
              </div>

              <h2 style={styles.welcomeTitle}>
                How can I help you today?
              </h2>

              <p style={styles.welcomeText}>
                Ask me anything about your IT Management
                System. I can help you understand your
                assets, inventory, employees, assignments,
                and repair tickets.
              </p>

              <div style={styles.quickGrid}>

                {quickPrompts.map((item) => (
                  <button
                    key={item.title}
                    onClick={() => sendMessage(item.text)}
                    style={styles.quickCard}
                  >

                    <div style={styles.quickIcon}>
                      {item.icon}
                    </div>

                    <div>
                      <div style={styles.quickTitle}>
                        {item.title}
                      </div>

                      <div style={styles.quickText}>
                        {item.text}
                      </div>
                    </div>

                  </button>
                ))}

              </div>

            </div>
          )}

          {/* Messages */}

          {messages.map((message, index) => {

            const isUser =
              message.role === "user";

            return (
              <div
                key={index}
                style={{
                  ...styles.messageRow,
                  justifyContent: isUser
                    ? "flex-end"
                    : "flex-start",
                }}
              >

                {!isUser && (
                  <div style={styles.avatar}>
                    👨‍💼
                  </div>
                )}

                <div
                  style={{
                    ...styles.messageBubble,
                    ...(isUser
                      ? styles.userBubble
                      : styles.aiBubble),
                    ...(message.error
                      ? styles.errorBubble
                      : {}),
                  }}
                >
                  <div style={styles.messageLabel}>
                    {isUser
                      ? "You"
                      : "AI Assistant"}
                  </div>

                  <div style={styles.messageText}>
                    {message.content}
                  </div>
                </div>

                {isUser && (
                  <div style={styles.userAvatar}>
                    👤
                  </div>
                )}

              </div>
            );
          })}

          {/* Loading */}

          {loading && (
            <div style={styles.messageRow}>

              <div style={styles.avatar}>
                👨‍💼
              </div>

              <div style={styles.aiBubble}>

                <div style={styles.messageLabel}>
                  AI Assistant
                </div>

                <div style={styles.typing}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

              </div>

            </div>
          )}

          <div ref={messagesEndRef} />

        </div>

        {/* =========================================
            INPUT AREA
        ========================================= */}

        <div style={styles.inputArea}>

          <div style={styles.inputWrapper}>

            <textarea
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Ask your IT Management AI Assistant..."
              rows={1}
              style={styles.textarea}
              disabled={loading}
            />

            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              style={{
                ...styles.sendButton,
                opacity:
                  !input.trim() || loading
                    ? 0.5
                    : 1,
              }}
            >
              {loading ? "⏳" : "➤"}
            </button>

          </div>

          <div style={styles.inputFooter}>
            <span>
              Press <strong>Enter</strong> to send
            </span>

            <span>
              Shift + Enter for new line
            </span>
          </div>

        </div>

      </div>

      {/* =========================================
          BOTTOM INFO
      ========================================= */}

      <div style={styles.bottomInfo}>

        <div>
          🧠 AI-powered IT insights
        </div>

        <div>
          🔒 Your data is protected
        </div>

        <div>
          ⚡ Real-time assistance
        </div>

      </div>

    </div>
  );
}

/* =====================================================
   PROFESSIONAL AI ASSISTANT STYLES
===================================================== */

const styles = {

  page: {
    width: "100%",
    minHeight: "100vh",
    boxSizing: "border-box",
    padding: "10px 5px 35px",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
    color: "#f8fafc",
  },

  /* HEADER */

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "22px",
    gap: "20px",
  },

  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  aiLogo: {
    width: "58px",
    height: "58px",
    borderRadius: "17px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    background:
      "linear-gradient(135deg, #2563eb, #7c3aed)",
    boxShadow:
      "0 10px 30px rgba(37,99,235,0.3)",
  },

  title: {
    margin: 0,
    fontSize: "32px",
    fontWeight: "800",
    letterSpacing: "-0.5px",
  },

  subtitle: {
    margin: "5px 0 0",
    color: "#94a3b8",
    fontSize: "14px",
  },

  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  status: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    padding: "9px 13px",
    borderRadius: "20px",
    background: "rgba(34,197,94,0.1)",
    border:
      "1px solid rgba(34,197,94,0.2)",
    color: "#4ade80",
    fontSize: "12px",
    fontWeight: "700",
  },

  statusDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#4ade80",
    boxShadow:
      "0 0 10px rgba(74,222,128,0.8)",
  },

  clearButton: {
    padding: "9px 14px",
    borderRadius: "9px",
    border:
      "1px solid rgba(148,163,184,0.15)",
    background: "rgba(30,41,59,0.7)",
    color: "#cbd5e1",
    cursor: "pointer",
    fontWeight: "600",
  },

  /* CHAT */

  chatContainer: {
    width: "100%",
    maxWidth: "1100px",
    height: "calc(100vh - 190px)",
    minHeight: "600px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    borderRadius: "22px",
    background:
      "linear-gradient(145deg, rgba(15,23,42,0.98), rgba(17,24,39,0.98))",
    border:
      "1px solid rgba(148,163,184,0.12)",
    boxShadow:
      "0 25px 70px rgba(0,0,0,0.35)",
  },

  chatHeader: {
    minHeight: "72px",
    padding: "0 22px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom:
      "1px solid rgba(148,163,184,0.1)",
    background:
      "rgba(30,41,59,0.55)",
  },

  chatHeaderLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  smallAiLogo: {
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "rgba(124,58,237,0.15)",
    fontSize: "20px",
  },

  chatTitle: {
    fontWeight: "700",
    fontSize: "14px",
  },

  chatSubtitle: {
    color: "#64748b",
    fontSize: "11px",
    marginTop: "3px",
  },

  secureBadge: {
    fontSize: "11px",
    color: "#94a3b8",
    padding: "7px 10px",
    borderRadius: "8px",
    background:
      "rgba(15,23,42,0.8)",
  },

  /* MESSAGES */

  messages: {
    flex: 1,
    overflowY: "auto",
    padding: "25px",
    scrollbarWidth: "thin",
  },

  welcome: {
    maxWidth: "750px",
    margin: "35px auto 30px",
    textAlign: "center",
  },

  welcomeIcon: {
    width: "75px",
    height: "75px",
    margin: "0 auto 18px",
    borderRadius: "22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "38px",
    background:
      "linear-gradient(135deg, rgba(37,99,235,0.2), rgba(124,58,237,0.2))",
    border:
      "1px solid rgba(96,165,250,0.15)",
  },

  welcomeTitle: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "750",
  },

  welcomeText: {
    maxWidth: "650px",
    margin: "10px auto 25px",
    color: "#94a3b8",
    fontSize: "13px",
    lineHeight: "1.7",
  },

  quickGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(210px, 1fr))",
    gap: "12px",
    textAlign: "left",
  },

  quickCard: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "15px",
    borderRadius: "13px",
    border:
      "1px solid rgba(148,163,184,0.12)",
    background:
      "rgba(30,41,59,0.65)",
    color: "#f8fafc",
    cursor: "pointer",
    textAlign: "left",
    transition: "all 0.2s ease",
  },

  quickIcon: {
    width: "38px",
    height: "38px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "rgba(59,130,246,0.12)",
    fontSize: "18px",
    flexShrink: 0,
  },

  quickTitle: {
    fontSize: "13px",
    fontWeight: "700",
    marginBottom: "3px",
  },

  quickText: {
    fontSize: "10px",
    color: "#64748b",
    lineHeight: "1.4",
  },

  messageRow: {
    display: "flex",
    alignItems: "flex-end",
    gap: "10px",
    marginBottom: "20px",
  },

  avatar: {
    width: "35px",
    height: "35px",
    borderRadius: "11px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg, #2563eb, #7c3aed)",
    fontSize: "17px",
    flexShrink: 0,
  },

  userAvatar: {
    width: "35px",
    height: "35px",
    borderRadius: "11px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "rgba(59,130,246,0.15)",
    fontSize: "16px",
    flexShrink: 0,
  },

  messageBubble: {
    maxWidth: "70%",
    padding: "13px 16px",
    borderRadius: "15px",
    lineHeight: "1.6",
  },

  aiBubble: {
    background:
      "rgba(30,41,59,0.9)",
    border:
      "1px solid rgba(148,163,184,0.1)",
    borderBottomLeftRadius: "4px",
  },

  userBubble: {
    background:
      "linear-gradient(135deg, #2563eb, #1d4ed8)",
    borderBottomRightRadius: "4px",
  },

  errorBubble: {
    border:
      "1px solid rgba(239,68,68,0.3)",
    background:
      "rgba(127,29,29,0.25)",
  },

  messageLabel: {
    fontSize: "10px",
    fontWeight: "700",
    color: "#93c5fd",
    marginBottom: "5px",
  },

  messageText: {
    fontSize: "13px",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },

  /* TYPING */

  typing: {
    display: "flex",
    gap: "5px",
    padding: "6px 0",
  },

  /* INPUT */

  inputArea: {
    padding: "15px 20px 17px",
    borderTop:
      "1px solid rgba(148,163,184,0.1)",
    background:
      "rgba(15,23,42,0.9)",
  },

  inputWrapper: {
    display: "flex",
    alignItems: "flex-end",
    gap: "10px",
    padding: "7px 7px 7px 15px",
    borderRadius: "15px",
    border:
      "1px solid rgba(96,165,250,0.18)",
    background:
      "rgba(30,41,59,0.8)",
  },

  textarea: {
    flex: 1,
    resize: "none",
    border: "none",
    outline: "none",
    background: "transparent",
    color: "#f8fafc",
    fontSize: "13px",
    lineHeight: "1.5",
    fontFamily: "inherit",
    padding: "8px 0",
    minHeight: "24px",
    maxHeight: "120px",
  },

  sendButton: {
    width: "43px",
    height: "43px",
    border: "none",
    borderRadius: "12px",
    background:
      "linear-gradient(135deg, #2563eb, #7c3aed)",
    color: "white",
    fontSize: "20px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  inputFooter: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "8px",
    color: "#475569",
    fontSize: "10px",
  },

  /* BOTTOM */

  bottomInfo: {
    maxWidth: "1100px",
    margin: "15px auto 0",
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    flexWrap: "wrap",
    color: "#64748b",
    fontSize: "11px",
  },
};

export default AIAssistant;