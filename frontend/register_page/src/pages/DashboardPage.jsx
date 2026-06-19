// pages/DashboardPage.jsx  –  Q1: Management Dashboard
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "../api";
import "../App.css";

const StatCard = ({ label, value, icon, cls, loading }) => (
  <div className={`stat-card ${cls}`}>
    <div className="stat-icon">{icon}</div>
    <div className="stat-label">{label}</div>
    <div className="stat-value">{loading ? "…" : (value ?? "—")}</div>
  </div>
);

function DashboardPage({ setActive }) {
  const navigate   = useNavigate();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setActive && setActive("home");
    api.getAnalytics()
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [setActive]);

  const s = data?.summary || {};

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <h1>Management Dashboard</h1>
        <p>Overview of all records and system statistics</p>
      </div>

      {/* Q1 – Stat cards */}
      <div className="stats-grid">
        <StatCard label="Total Records"     value={s.total_records}     icon="📁" cls="total"     loading={loading} />
        <StatCard label="Active Records"    value={s.active_records}    icon="✅" cls="active"    loading={loading} />
        <StatCard label="Completed Records" value={s.completed_records} icon="🏁" cls="completed" loading={loading} />
        <StatCard label="Pending Records"   value={s.pending_records}   icon="⏳" cls="pending"   loading={loading} />
      </div>

      {/* Quick actions */}
      <div className="section-box">
        <div className="section-box-header">
          <h2>Quick Actions</h2>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button className="btn btn-primary" onClick={() => { navigate("/dashboard/records"); setActive && setActive("records"); }}>
            📄 View All Records
          </button>
          <button className="btn btn-success" onClick={() => { navigate("/dashboard/records?add=1"); setActive && setActive("records"); }}>
            ➕ Add New Record
          </button>
          <button className="btn btn-outline" onClick={() => { navigate("/dashboard/analytics"); setActive && setActive("analytics"); }}>
            📊 View Analytics
          </button>
        </div>
      </div>

      {/* Recent summary table */}
      <div className="section-box">
        <div className="section-box-header">
          <h2>Status Summary</h2>
        </div>
        {loading ? (
          <div className="loading-state">Loading…</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Count</th>
                  <th>% of Total</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Active",    val: s.active_records,    cls: "badge-active"    },
                  { label: "Completed", val: s.completed_records, cls: "badge-completed" },
                  { label: "Pending",   val: s.pending_records,   cls: "badge-pending"   },
                ].map(({ label, val, cls }) => (
                  <tr key={label}>
                    <td><span className={`badge ${cls}`}>{label}</span></td>
                    <td><strong>{val ?? 0}</strong></td>
                    <td>{s.total_records ? ((val / s.total_records) * 100).toFixed(1) + "%" : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
