import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/assets/";

function Assets() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    asset_type: "",
    serial_number: "",
    status: "Available",
    purchase_date: "",
  });

  // =====================================================
  // AUTH HEADER
  // =====================================================

  const getAuthConfig = () => {
    const token = localStorage.getItem("access_token");

    return {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
  };

  // =====================================================
  // FETCH ASSETS
  // =====================================================

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    setError("");

    const token = localStorage.getItem("access_token");

    if (!token) {
      setError("Authentication required. Please login again.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        API_URL,
        getAuthConfig()
      );

      console.log("ASSETS API RESPONSE:", response.data);

      const data = response.data;

      // DRF pagination
      if (Array.isArray(data?.results)) {
        setAssets(data.results);
      }

      // Normal array
      else if (Array.isArray(data)) {
        setAssets(data);
      }

      // Custom backend response
      else if (Array.isArray(data?.assets)) {
        setAssets(data.assets);
      }

      else {
        console.warn("Unexpected assets response:", data);
        setAssets([]);
      }

    } catch (err) {
      console.error("FETCH ASSETS ERROR:", err);

      if (err.response?.status === 401) {
        setError(
          "Authentication expired. Please login again."
        );
      } else {
        setError(
          err.response?.data?.detail ||
          "Unable to load assets."
        );
      }

    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (e) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  // =====================================================
  // ADD ASSET
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError("");
    setSaving(true);

    const token = localStorage.getItem("access_token");

    if (!token) {
      setFormError("Authentication required.");
      setSaving(false);
      return;
    }

    if (
      !formData.name.trim() ||
      !formData.asset_type.trim() ||
      !formData.serial_number.trim()
    ) {
      setFormError(
        "Please fill in all required fields."
      );
      setSaving(false);
      return;
    }

    try {
      const payload = {
        name: formData.name.trim(),
        asset_type: formData.asset_type.trim(),
        serial_number: formData.serial_number.trim(),
        status: formData.status,
        purchase_date:
          formData.purchase_date || null,
      };

      console.log("ADDING ASSET:", payload);

      await axios.post(
        API_URL,
        payload,
        getAuthConfig()
      );

      // Reset form
      setFormData({
        name: "",
        asset_type: "",
        serial_number: "",
        status: "Available",
        purchase_date: "",
      });

      setShowForm(false);

      // Reload assets
      await fetchAssets();

    } catch (err) {
      console.error("ADD ASSET ERROR:", err);

      if (err.response?.status === 401) {
        setFormError(
          "Authentication expired. Please login again."
        );
      } else {
        setFormError(
          typeof err.response?.data === "object"
            ? JSON.stringify(err.response.data)
            : "Failed to create asset."
        );
      }

    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE ASSET
  // =====================================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this asset?"
    );

    if (!confirmDelete) {
      return;
    }

    setDeletingId(id);

    try {
      await axios.delete(
        `${API_URL}${id}/`,
        getAuthConfig()
      );

      setAssets((previous) =>
        previous.filter(
          (asset) => asset.id !== id
        )
      );

    } catch (err) {
      console.error("DELETE ASSET ERROR:", err);

      setError(
        err.response?.data?.detail ||
        "Failed to delete asset."
      );

    } finally {
      setDeletingId(null);
    }
  };

  // =====================================================
  // STATUS
  // =====================================================

  const getStatusStyle = (status) => {
    const value = String(status || "").toLowerCase();

    if (
      value.includes("available") ||
      value.includes("active") ||
      value.includes("in use")
    ) {
      return {
        background: "rgba(34,197,94,0.15)",
        color: "#4ade80",
      };
    }

    if (
      value.includes("maintenance") ||
      value.includes("pending")
    ) {
      return {
        background: "rgba(245,158,11,0.15)",
        color: "#fbbf24",
      };
    }

    if (
      value.includes("broken") ||
      value.includes("retired")
    ) {
      return {
        background: "rgba(239,68,68,0.15)",
        color: "#f87171",
      };
    }

    return {
      background: "rgba(148,163,184,0.15)",
      color: "#cbd5e1",
    };
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="assets-page">

      <style>{`

        .assets-page {
          min-height: 100vh;
          padding: 30px;
          box-sizing: border-box;
          background:
            linear-gradient(
              135deg,
              #0f172a,
              #111827,
              #172554
            );
          color: #f8fafc;
          font-family:
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Roboto,
            Arial,
            sans-serif;
        }

        .assets-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 30px;
        }

        .assets-title {
          margin: 0;
          font-size: 32px;
          font-weight: 800;
        }

        .assets-subtitle {
          margin: 7px 0 0;
          color: #94a3b8;
        }

        .header-actions {
          display: flex;
          gap: 10px;
        }

        .button {
          border: none;
          padding: 11px 17px;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 700;
          transition: 0.2s;
        }

        .button:hover {
          transform: translateY(-1px);
        }

        .refresh-button {
          background: rgba(255,255,255,0.08);
          color: #e2e8f0;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .add-button {
          background: #2563eb;
          color: white;
        }

        .error {
          padding: 14px 18px;
          margin-bottom: 20px;
          border-radius: 10px;
          background: rgba(239,68,68,0.12);
          border: 1px solid rgba(239,68,68,0.3);
          color: #fca5a5;
        }

        .form-card {
          padding: 25px;
          margin-bottom: 25px;
          border-radius: 18px;
          background: rgba(30,41,59,0.75);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 20px 40px rgba(0,0,0,0.25);
        }

        .form-title {
          margin-top: 0;
          margin-bottom: 20px;
          font-size: 20px;
        }

        .form-grid {
          display: grid;
          grid-template-columns:
            repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
        }

        .input {
          width: 100%;
          box-sizing: border-box;
          padding: 12px;
          border-radius: 9px;
          border: 1px solid rgba(148,163,184,0.2);
          background: rgba(15,23,42,0.8);
          color: white;
          outline: none;
        }

        .input:focus {
          border-color: #60a5fa;
        }

        .form-actions {
          margin-top: 18px;
          display: flex;
          gap: 10px;
        }

        .save-button {
          background: #16a34a;
          color: white;
        }

        .cancel-button {
          background: #475569;
          color: white;
        }

        .table-card {
          background: rgba(30,41,59,0.75);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          padding: 22px;
          overflow-x: auto;
          box-shadow: 0 20px 40px rgba(0,0,0,0.25);
        }

        .assets-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 750px;
        }

        .assets-table th {
          text-align: left;
          padding: 14px;
          color: #94a3b8;
          font-size: 12px;
          text-transform: uppercase;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .assets-table td {
          padding: 16px 14px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          color: #e2e8f0;
        }

        .assets-table tbody tr:hover {
          background: rgba(255,255,255,0.03);
        }

        .status {
          display: inline-block;
          padding: 5px 11px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
        }

        .delete-button {
          background: #dc2626;
          color: white;
          padding: 7px 12px;
          border: none;
          border-radius: 7px;
          cursor: pointer;
          font-weight: 600;
        }

        .empty {
          text-align: center;
          padding: 45px;
          color: #94a3b8;
        }

        .loading {
          text-align: center;
          padding: 45px;
          color: #93c5fd;
        }

        @media (max-width: 700px) {

          .assets-page {
            padding: 20px 15px;
          }

          .assets-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .header-actions {
            width: 100%;
          }

          .header-actions button {
            flex: 1;
          }

        }

      `}</style>

      {/* HEADER */}

      <div className="assets-header">

        <div>
          <h1 className="assets-title">
            💻 Assets
          </h1>

          <p className="assets-subtitle">
            Manage and monitor company IT assets
          </p>
        </div>

        <div className="header-actions">

          <button
            className="button refresh-button"
            onClick={fetchAssets}
          >
            🔄 Refresh
          </button>

          <button
            className="button add-button"
            onClick={() => {
              setShowForm((previous) => !previous);
              setFormError("");
            }}
          >
            {showForm
              ? "✕ Close"
              : "＋ Add Asset"}
          </button>

        </div>

      </div>

      {/* ERROR */}

      {error && (
        <div className="error">
          ⚠️ {error}
        </div>
      )}

      {/* ADD FORM */}

      {showForm && (
        <form
          className="form-card"
          onSubmit={handleSubmit}
        >

          <h2 className="form-title">
            ➕ Add New Asset
          </h2>

          {formError && (
            <div className="error">
              ⚠️ {formError}
            </div>
          )}

          <div className="form-grid">

            <input
              className="input"
              name="name"
              placeholder="Asset Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              className="input"
              name="asset_type"
              placeholder="Asset Type"
              value={formData.asset_type}
              onChange={handleChange}
              required
            />

            <input
              className="input"
              name="serial_number"
              placeholder="Serial Number"
              value={formData.serial_number}
              onChange={handleChange}
              required
            />

            <select
              className="input"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Available">
                Available
              </option>

              <option value="Assigned">
                Assigned
              </option>

              <option value="Maintenance">
                Maintenance
              </option>

              <option value="Retired">
                Retired
              </option>
            </select>

            <input
              className="input"
              type="date"
              name="purchase_date"
              value={formData.purchase_date}
              onChange={handleChange}
            />

          </div>

          <div className="form-actions">

            <button
              type="submit"
              className="button save-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "💾 Save Asset"}
            </button>

            <button
              type="button"
              className="button cancel-button"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>

          </div>

        </form>
      )}

      {/* TABLE */}

      <div className="table-card">

        {loading ? (

          <div className="loading">
            🔄 Loading assets...
          </div>

        ) : assets.length === 0 ? (

          <div className="empty">
            <div style={{ fontSize: "40px" }}>
              💻
            </div>

            <h3>
              No Assets Found
            </h3>

            <p>
              Add your first IT asset using
              the "Add Asset" button.
            </p>
          </div>

        ) : (

          <table className="assets-table">

            <thead>

              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Serial Number</th>
                <th>Status</th>
                <th>Purchase Date</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              {assets.map((asset) => (

                <tr key={asset.id}>

                  <td>
                    #{asset.id}
                  </td>

                  <td>
                    <strong>
                      {asset.name || "-"}
                    </strong>
                  </td>

                  <td>
                    {asset.asset_type || "-"}
                  </td>

                  <td>
                    <code>
                      {asset.serial_number || "-"}
                    </code>
                  </td>

                  <td>

                    <span
                      className="status"
                      style={getStatusStyle(
                        asset.status
                      )}
                    >
                      {asset.status || "Unknown"}
                    </span>

                  </td>

                  <td>
                    {asset.purchase_date || "-"}
                  </td>

                  <td>

                    <button
                      className="delete-button"
                      disabled={
                        deletingId === asset.id
                      }
                      onClick={() =>
                        handleDelete(asset.id)
                      }
                    >
                      {deletingId === asset.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>

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

export default Assets;