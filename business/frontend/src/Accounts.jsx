import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/accounts/employees/";

function Accounts() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    employee_id: "",
    department: "",
    phone: "",
  });

  const token = localStorage.getItem("access_token");

  const getConfig = useCallback(() => ({
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }), [token]);

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API_URL, getConfig());
      const data = response.data;

      if (Array.isArray(data)) {
        setEmployees(data);
      } else if (Array.isArray(data.results)) {
        setEmployees(data.results);
      } else {
        setEmployees([]);
      }
    } catch (err) {
      console.error("Employee error:", err);
      setError(
        err.response?.data?.detail || "Unable to fetch employee data"
      );
    } finally {
      setLoading(false);
    }
  }, [getConfig]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(API_URL, formData, getConfig());
      alert("Employee created successfully");

      setFormData({
        username: "",
        password: "",
        employee_id: "",
        department: "",
        phone: "",
      });

      setShowForm(false);
      fetchEmployees();
    } catch (err) {
      console.error("Create employee error:", err);
      alert(
        err.response?.data
          ? JSON.stringify(err.response.data)
          : "Failed to create employee"
      );
    }
  };

  return (
    <div className="accounts-container">
      {/* Modern CSS Injection */}
      <style>{`
        :root {
          --bg-main: #0f172a;
          --card-bg: rgba(30, 41, 59, 0.7);
          --card-border: rgba(255, 255, 255, 0.08);
          --text-primary: #f8fafc;
          --text-secondary: #94a3b8;
          --accent-indigo: #6366f1;
        }

        .accounts-container {
          padding: 40px 32px;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: var(--text-primary);
          box-sizing: border-box;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--card-border);
        }

        .header h1 {
          margin: 0;
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .header p {
          margin: 4px 0 0 0;
          color: var(--text-secondary);
          font-size: 15px;
        }

        .add-btn {
          padding: 12px 24px;
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          color: #ffffff;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
          transition: all 0.25s ease;
        }

        .add-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5);
        }

        .error-banner {
          background: rgba(239, 68, 68, 0.12);
          color: #fca5a5;
          border: 1px solid rgba(239, 68, 68, 0.3);
          padding: 16px 20px;
          border-radius: 12px;
          margin-bottom: 24px;
          font-size: 14px;
        }

        .form-container {
          background: var(--card-bg);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid var(--card-border);
          padding: 32px;
          border-radius: 16px;
          margin-bottom: 32px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5);
          animation: fadeIn 0.3s ease-out;
        }

        .form-container h2 {
          margin: 0 0 12px 0;
          font-size: 20px;
        }

        .form-input {
          width: 100%;
          padding: 12px 16px;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid var(--card-border);
          border-radius: 10px;
          color: var(--text-primary);
          font-size: 14px;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s ease;
        }

        .form-input:focus {
          border-color: var(--accent-indigo);
        }

        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }

        .save-btn {
          padding: 10px 22px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: #ffffff;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
          transition: all 0.2s ease;
        }

        .save-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
        }

        .cancel-btn {
          padding: 10px 22px;
          background: rgba(255, 255, 255, 0.06);
          color: var(--text-secondary);
          border: 1px solid var(--card-border);
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .cancel-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-primary);
        }

        .table-container {
          background: var(--card-bg);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid var(--card-border);
          padding: 24px;
          border-radius: 16px;
          overflow-x: auto;
          box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5);
        }

        .custom-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 14px;
        }

        .custom-table th {
          padding: 14px 16px;
          color: var(--text-secondary);
          font-weight: 600;
          border-bottom: 1px solid var(--card-border);
          text-transform: uppercase;
          font-size: 12px;
          letter-spacing: 0.5px;
        }

        .custom-table td {
          padding: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          color: var(--text-primary);
        }

        .custom-table tbody tr {
          transition: background-color 0.2s ease;
        }

        .custom-table tbody tr:hover {
          background-color: rgba(255, 255, 255, 0.03);
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Header */}
      <div className="header">
        <div>
          <h1>👥 Employees</h1>
          <p>Manage employees and their information</p>
        </div>

        <button className="add-btn" onClick={() => setShowForm(!showForm)}>
          + Add Employee
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {/* Employee Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="form-container">
          <h2>Add Employee</h2>

          <input
            className="form-input"
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <input
            className="form-input"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <input
            className="form-input"
            type="text"
            name="employee_id"
            placeholder="Employee ID"
            value={formData.employee_id}
            onChange={handleChange}
            required
          />

          <input
            className="form-input"
            type="text"
            name="department"
            placeholder="Department"
            value={formData.department}
            onChange={handleChange}
            required
          />

          <input
            className="form-input"
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <div className="form-actions">
            <button type="submit" className="save-btn">
              Save Employee
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Data Table */}
      <div className="table-container">
        {loading ? (
          <p style={{ color: "var(--text-secondary)" }}>Loading employees...</p>
        ) : employees.length === 0 ? (
          <p style={{ color: "var(--text-secondary)" }}>No employees found.</p>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee ID</th>
                <th>Username</th>
                <th>Department</th>
                <th>Phone</th>
              </tr>
            </thead>

            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.id}</td>
                  <td>{employee.employee_id}</td>
                  <td>
                    {employee.username ||
                      employee.user?.username ||
                      "-"}
                  </td>
                  <td>{employee.department}</td>
                  <td>{employee.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Accounts;