import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard   from "./components/Dashboard";
import SearchBar   from "./components/SearchBar";
import Filters     from "./components/Filters";
import RecordTable from "./components/RecordTable";
import RecordForm  from "./components/RecordForm";
import Analytics   from "./components/Analytics";
import Toast       from "./components/Toast";
import * as api    from "./api";
import "./App.css";

function DashboardPage() {
  const navigate = useNavigate();

  // ── State ──────────────────────────────────────────────────
  const [records,    setRecords]    = useState([]);
  const [analytics,  setAnalytics]  = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);

  // Search / Filter
  const [search,      setSearch]      = useState("");
  const [searchId,    setSearchId]    = useState("");
  const [filterStatus,   setFilterStatus]   = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  // Modal / form
  const [showForm,   setShowForm]   = useState(false);
  const [editRecord, setEditRecord] = useState(null);   // null = add mode

  // Toast
  const [toast, setToast] = useState(null);

  // ── Helpers ────────────────────────────────────────────────
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Data fetching ──────────────────────────────────────────
  const fetchRecords = useCallback(async () => {
    try {
      const res = await api.getRecords({
        search,
        searchId,
        status:      filterStatus,
        category_id: filterCategory,
      });
      setRecords(res.data);
    } catch {
      showToast("Failed to load records.", "error");
    }
  }, [search, searchId, filterStatus, filterCategory]);

  const fetchAnalytics = async () => {
    try {
      const res = await api.getAnalytics();
      setAnalytics(res.data);
    } catch {
      // analytics non-critical
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.getCategories();
      setCategories(res.data);
    } catch {
      // fallback handled in RecordForm
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([fetchRecords(), fetchAnalytics(), fetchCategories()]);
      setLoading(false);
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-fetch records whenever filters change
  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // ── CRUD handlers ──────────────────────────────────────────
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
      await Promise.all([fetchRecords(), fetchAnalytics()]);
    } catch (err) {
      showToast(err.message || "Save failed.", "error");
    }
  };

  const handleEdit = (record) => {
    setEditRecord(record);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete record #${id}? This action cannot be undone.`)) return;
    try {
      await api.deleteRecord(id);
      showToast("Record deleted.");
      await Promise.all([fetchRecords(), fetchAnalytics()]);
    } catch (err) {
      showToast(err.message || "Delete failed.", "error");
    }
  };

  const handleReset = () => {
    setSearch("");
    setSearchId("");
    setFilterStatus("");
    setFilterCategory("");
  };

  // ── Render ─────────────────────────────────────────────────
  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <h2>Record Management System</h2>
        <div className="nav-links">
          <a href="#dashboard">Dashboard</a>
          <a href="#records">Records</a>
          <a href="#analytics">Analytics</a>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); navigate("/login"); }}
          >
            Logout
          </a>
        </div>
      </nav>

      <div className="page-wrapper">

        {/* Q1 – Dashboard Summary Cards */}
        <section id="dashboard">
          <Dashboard analytics={analytics} loading={loading} />
        </section>

        {/* Q6 – Search & Filter */}
        <section id="records" className="section-box">
          <h2>🔍 Search &amp; Filter</h2>
          <SearchBar
            search={search}           onSearchChange={setSearch}
            searchId={searchId}       onSearchIdChange={setSearchId}
          />
          <div style={{ marginTop: 12 }}>
            <Filters
              categories={categories}
              filterStatus={filterStatus}       onStatusChange={setFilterStatus}
              filterCategory={filterCategory}   onCategoryChange={setFilterCategory}
              onReset={handleReset}
            />
          </div>
        </section>

        {/* Q2 – Add Record button + Q3/Q4/Q5 – Table */}
        <section className="section-box">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ marginBottom: 0, borderBottom: "none", paddingBottom: 0 }}>Records</h2>
            <button
              className="btn btn-success"
              onClick={() => { setEditRecord(null); setShowForm(true); }}
            >
              + Add Record
            </button>
          </div>
          <RecordTable
            records={records}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </section>

        {/* Q7 – Analytics Charts */}
        <section id="analytics">
          <Analytics analytics={analytics} />
        </section>

      </div>

      {/* Q2/Q4 – Add / Edit Modal */}
      {showForm && (
        <RecordForm
          record={editRecord}
          categories={categories}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditRecord(null); }}
        />
      )}

      {/* Toast notification */}
      {toast && <Toast message={toast.msg} type={toast.type} />}
    </>
  );
}

export default DashboardPage;
