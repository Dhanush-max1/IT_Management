import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api";

function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [assets, setAssets] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    employee: "",
    asset: "",
    status: "Assigned",
  });

  const getAuthHeader = () => {
    const token = localStorage.getItem("access_token");
    return {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
    };
  };

  const extractData = (response) => {
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.data?.results)) return response.data.results;
    return [];
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const authConfig = getAuthHeader();
      const [assignmentsRes, employeesRes, assetsRes] = await Promise.all([
        axios.get(`${API_BASE}/assignments/`, authConfig),
        axios.get(`${API_BASE}/accounts/employees/`, authConfig),
        axios.get(`${API_BASE}/assets/`, authConfig),
      ]);

      setAssignments(extractData(assignmentsRes));
      setEmployees(extractData(employeesRes));
      setAssets(extractData(assetsRes));
    } catch (err) {
      console.error("Data fetching error:", err);
      setError(
        err.response?.data?.detail || "Failed to load server data. Please retry."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.employee || !formData.asset) {
      setFormError("Please select both an employee and an asset.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        employee: Number(formData.employee),
        asset: Number(formData.asset),
        status: formData.status,
      };

      await axios.post(`${API_BASE}/assignments/`, payload, getAuthHeader());

      setFormData({ employee: "", asset: "", status: "Assigned" });
      setShowForm(false);
      fetchData();
    } catch (err) {
      console.error("Assignment error:", err);
      setFormError(
        err.response?.data?.detail ||
          (typeof err.response?.data === "object"
            ? JSON.stringify(err.response.data)
            : "Failed to create assignment.")
      );
    } finally {
      setSubmitting(false);
    }
  };

  const formatEmployeeName = (emp) => {
    if (!emp) return "-";
    if (typeof emp === "object") {
      return (
        emp.full_name ||
        `${emp.first_name || ""} ${emp.last_name || ""}`.trim() ||
        emp.username ||
        emp.employee_id ||
        `ID: ${emp.id}`
      );
    }
    const found = employees.find((e) => Number(e.id) === Number(emp));
    return found ? formatEmployeeName(found) : `Employee #${emp}`;
  };

  const formatAssetName = (ast) => {
    if (!ast) return "-";
    if (typeof ast === "object") {
      const label = ast.name || ast.model || `Asset #${ast.id}`;
      return ast.serial_number ? `${label} (${ast.serial_number})` : label;
    }
    const found = assets.find((a) => Number(a.id) === Number(ast));
    return found ? formatAssetName(found) : `Asset #${ast}`;
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>🔗 Assignments</h1>
          <p style={styles.subtitle}>Assign IT assets to employees</p>
        </div>

        <button
          style={styles.addButton}
          onClick={() => {
            setShowForm((prev) => !prev);
            setFormError("");
          }}
        >
          {showForm ? "Close Form" : "+ Create Assignment"}
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2>Create Assignment</h2>
          {formError && <div style={styles.formError}>{formError}</div>}

          <label style={styles.label}>Employee</label>
          <select
            name="employee"
            value={formData.employee}
            onChange={handleChange}
            style={styles.input}
            required
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {formatEmployeeName(emp)}
              </option>
            ))}
          </select>

          <label style={styles.label}>Asset</label>
          <select
            name="asset"
            value={formData.asset}
            onChange={handleChange}
            style={styles.input}
            required
          >
            <option value="">Select Asset</option>
            {assets.map((asset) => (
              <option key={asset.id} value={asset.id}>
                {formatAssetName(asset)}
              </option>
            ))}
          </select>

          <label style={styles.label}>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="Assigned">Assigned</option>
            <option value="Returned">Returned</option>
          </select>

          <div style={styles.actionRow}>
            <button
              type="submit"
              disabled={submitting}
              style={{
                ...styles.saveButton,
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? "Saving..." : "Create Assignment"}
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
          <p style={styles.infoText}>Loading assignments...</p>
        ) : assignments.length === 0 ? (
          <p style={styles.infoText}>No assignments found.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Employee</th>
                <th style={styles.th}>Asset</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Date Assigned</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment) => (
                <tr key={assignment.id} style={styles.tr}>
                  <td style={styles.td}>{assignment.id}</td>
                  <td style={styles.td}>
                    {formatEmployeeName(assignment.employee)}
                  </td>
                  <td style={styles.td}>
                    {formatAssetName(assignment.asset)}
                  </td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.statusBadge,
                        backgroundColor:
                          assignment.status === "Assigned"
                            ? "#dcfce7"
                            : "#f3f4f6",
                        color:
                          assignment.status === "Assigned"
                            ? "#15803d"
                            : "#4b5563",
                      }}
                    >
                      {assignment.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {assignment.date_assigned
                      ? new Date(assignment.date_assigned).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))}
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
  addButton: { padding: "12px 20px", background: "#2563eb", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" },
  error: { background: "#fee2e2", color: "#991b1b", padding: "15px", borderRadius: "8px", marginBottom: "20px" },
  formError: { background: "#fef2f2", color: "#dc2626", padding: "10px", borderRadius: "6px", fontSize: "14px" },
  form: { background: "white", padding: "25px", borderRadius: "12px", marginBottom: "25px", display: "flex", flexDirection: "column", gap: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" },
  label: { fontWeight: "600", fontSize: "14px", color: "#374151" },
  input: { padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "14px" },
  actionRow: { marginTop: "10px" },
  saveButton: { padding: "10px 20px", background: "#16a34a", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", marginRight: "10px" },
  cancelButton: { padding: "10px 20px", background: "#6b7280", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" },
  tableContainer: { background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
  th: { padding: "12px", borderBottom: "2px solid #e5e7eb", color: "#4b5563" },
  td: { padding: "12px", borderBottom: "1px solid #e5e7eb" },
  tr: { transition: "background 0.2s" },
  statusBadge: { padding: "4px 8px", borderRadius: "12px", fontSize: "12px", fontWeight: "600" },
  infoText: { color: "#6b7280", textAlign: "center", padding: "20px 0" },
};

export default Assignments;