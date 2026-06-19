// pages/RecordsPage.jsx  –  Q2, Q3, Q4, Q5, Q6
import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import RecordTable from "../components/RecordTable";
import RecordForm  from "../components/RecordForm";
import Toast       from "../components/Toast";
import * as api    from "../api";
import "../App.css";

function RecordsPage() {
  const location = useLocation();

  // Data
  const [records,    setRecords]    = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);

  // Search / Filter  (Q6)
  const [search,         setSearch]         = useState("");
  const [searchId,       setSearchId]       = useState("");
  const [filterStatus,   setFilterStatus]   = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  // Modal
  const [showForm,   setShowForm]   = useState(false);
  const [editRecord, setEditRecord] = useState(null);

  // Toast
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Fetch ───────────────────────────────────────────────────
  const fetchRecords = useCallback(async () => {
    try {
      const res = await api.getRecords({ search, searchId, status: filterStatus, category_id: filterCategory });
      setRecords(res.data);
    } catch {
      showToast("Failed to load records.", "error");
    } finally {
      setLoading(false);
    }
  }, [search, searchId, filterStatus, filterCategory]);

  useEffect(() => {
    api.getCategories().then((r) => setCategories(r.data)).catch(() => {});
  }, []);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  // Auto-open add form if navigated with ?add=1
  useEffect(() => {
    if (new URLSearchParams(location.search).get("add") === "1") {
      setEditRecord(null);
      setShowForm(true);
    }
  }, [location.search]);

  // ── CRUD ────────────────────────────────────────────────────
  const handleSave = async (formData) => {
    try {
      if (editRecord) {
        await api.updateRecord(editRecord.id, formData);
        showToast("Record updated successfully!");
      } else {
        await api.createRecord(formData);
        showToast("Record added successfully!");
      }
      setShowForm(false);
      setEditRecord(null);
      fetchRecords();
    } catch (err) {
      showToast(err.message || "Save failed.", "error");
    }
  };

  const handleEdit   = (rec) => { setEditRecord(rec); setShowForm(true); };

  const handleDelete = async (id) => {
    if (!window.confirm(`Delete record #${id}? This cannot be undone.`)) return;
    try {
      await api.deleteRecord(id);
      showToast("Record deleted.");
      fetchRecords();
    } catch (err) {
      showToast(err.message || "Delete failed.", "error");
    }
  };

  const handleReset = () => {
    setSearch(""); setSearchId(""); setFilterStatus(""); setFilterCategory("");
  };

  // ── Render ──────────────────────────────────────────────────
  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1>Record Management</h1>
            <p>Create, view, update and delete records</p>
          </div>
          <button className="btn btn-success" onClick={() => { setEditRecord(null); setShowForm(true); }}>
            ➕ Add New Record
          </button>
        </div>
      </div>

      {/* Q6 – Search & Filter */}
      <div className="section-box">
        <div className="section-box-header">
          <h2>🔍 Search &amp; Filter</h2>
          <button className="btn btn-outline btn-sm" onClick={handleReset}>✕ Reset</button>
        </div>
        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search by Name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <input
            type="number"
            placeholder="Search by ID…"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            min="1"
          />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
          </select>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div style={{ fontSize: ".82rem", color: "var(--text-muted)" }}>
          Showing <strong>{records.length}</strong> record(s)
        </div>
      </div>

      {/* Q3 – Table  |  Q4 Edit  |  Q5 Delete */}
      <div className="section-box">
        <div className="section-box-header">
          <h2>📄 Records</h2>
        </div>
        <RecordTable
          records={records}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Q2 / Q4 – Add / Edit Modal */}
      {showForm && (
        <RecordForm
          record={editRecord}
          categories={categories}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditRecord(null); }}
        />
      )}

      {toast && <Toast message={toast.msg} type={toast.type} />}
    </div>
  );
}

export default RecordsPage;
