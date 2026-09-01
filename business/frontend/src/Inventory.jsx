import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/inventory/";

function Inventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    item_name: "",
    quantity: "",
    threshold: "",
  });

  // Dynamically resolve authorization header per-request
  const getAuthHeader = () => {
    const token = localStorage.getItem("access_token");
    return {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
    };
  };

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(API_URL, getAuthHeader());
      const data = response.data;

      if (Array.isArray(data)) {
        setItems(data);
      } else if (Array.isArray(data?.results)) {
        setItems(data.results);
      } else {
        setItems([]);
      }
    } catch (err) {
      console.error("Inventory error:", err);
      setError(
        err.response?.data?.detail || "Unable to load inventory items."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);

    try {
      await axios.post(
        API_URL,
        {
          item_name: formData.item_name.trim(),
          quantity: Number(formData.quantity),
          threshold: Number(formData.threshold),
        },
        getAuthHeader()
      );

      setFormData({ item_name: "", quantity: "", threshold: "" });
      setShowForm(false);
      fetchInventory();
    } catch (err) {
      console.error("Create inventory error:", err);
      setFormError(
        err.response?.data?.detail ||
          (typeof err.response?.data === "object"
            ? JSON.stringify(err.response.data)
            : "Failed to create inventory item.")
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }

    setDeletingId(id);
    try {
      await axios.delete(`${API_URL}${id}/`, getAuthHeader());
      // Optimistic state update for faster UI response
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete inventory item.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>📦 Inventory</h1>
          <p style={styles.subtitle}>Manage and monitor stock levels</p>
        </div>

        <button
          style={styles.addButton}
          onClick={() => {
            setShowForm((prev) => !prev);
            setFormError("");
          }}
        >
          {showForm ? "Close Form" : "+ Add Inventory"}
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2 style={{ margin: "0 0 10px 0" }}>Add New Item</h2>
          {formError && <div style={styles.formError}>{formError}</div>}

          <input
            type="text"
            name="item_name"
            placeholder="Item Name"
            value={formData.item_name}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            min="0"
            value={formData.quantity}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            type="number"
            name="threshold"
            placeholder="Low Stock Threshold"
            min="0"
            value={formData.threshold}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <div style={styles.actionRow}>
            <button
              type="submit"
              disabled={submitting}
              style={{ ...styles.saveButton, opacity: submitting ? 0.7 : 1 }}
            >
              {submitting ? "Saving..." : "Save Item"}
            </button>

            <button
              type="button"
              style={styles.cancelButton}
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div style={styles.tableContainer}>
        {loading ? (
          <p style={styles.infoText}>Loading inventory...</p>
        ) : items.length === 0 ? (
          <p style={styles.infoText}>No inventory items found.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Item Name</th>
                <th style={styles.th}>Quantity</th>
                <th style={styles.th}>Threshold</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => {
                const isLowStock = Number(item.quantity) <= Number(item.threshold);

                return (
                  <tr key={item.id} style={styles.tr}>
                    <td style={styles.td}>{item.id}</td>
                    <td style={styles.td}>
                      <strong>{item.item_name}</strong>
                    </td>
                    <td style={styles.td}>{item.quantity}</td>
                    <td style={styles.td}>{item.threshold}</td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.statusBadge,
                          backgroundColor: isLowStock ? "#fee2e2" : "#dcfce7",
                          color: isLowStock ? "#991b1b" : "#15803d",
                        }}
                      >
                        {isLowStock ? "⚠️ Low Stock" : "In Stock"}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <button
                        style={{
                          ...styles.deleteButton,
                          opacity: deletingId === item.id ? 0.5 : 1,
                        }}
                        disabled={deletingId === item.id}
                        onClick={() => handleDelete(item.id)}
                      >
                        {deletingId === item.id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "30px", background: "#f5f6fa", minHeight: "100vh" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" },
  title: { margin: 0, fontSize: "24px" },
  subtitle: { margin: "4px 0 0 0", color: "#6b7280" },
  addButton: { padding: "12px 20px", border: "none", borderRadius: "8px", background: "#2563eb", color: "white", fontWeight: "600", cursor: "pointer" },
  error: { background: "#fee2e2", color: "#991b1b", padding: "15px", borderRadius: "8px", marginBottom: "20px" },
  formError: { background: "#fef2f2", color: "#dc2626", padding: "10px", borderRadius: "6px", fontSize: "14px" },
  form: { background: "white", padding: "25px", borderRadius: "12px", marginBottom: "25px", display: "flex", flexDirection: "column", gap: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" },
  input: { padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "14px" },
  actionRow: { marginTop: "5px" },
  saveButton: { padding: "10px 20px", background: "#16a34a", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", marginRight: "10px" },
  cancelButton: { padding: "10px 20px", background: "#6b7280", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" },
  tableContainer: { background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
  th: { padding: "12px", borderBottom: "2px solid #e5e7eb", color: "#4b5563" },
  td: { padding: "12px", borderBottom: "1px solid #e5e7eb" },
  tr: { transition: "background 0.2s" },
  deleteButton: { padding: "7px 12px", background: "#dc2626", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" },
  statusBadge: { padding: "4px 8px", borderRadius: "12px", fontSize: "12px", fontWeight: "600" },
  infoText: { color: "#6b7280", textAlign: "center", padding: "20px 0" },
};

export default Inventory;