// pages/AnalyticsPage.jsx  –  Q7: Analytics Cards & Charts
import { useState, useEffect } from "react";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
} from "recharts";
import * as api from "../api";
import "../App.css";

const COLORS = ["#2563eb", "#16a34a", "#d97706", "#7c3aed", "#dc2626", "#0891b2"];
const STATUS_COLORS = { Active: "#16a34a", Completed: "#2563eb", Pending: "#d97706" };

function AnalyticsPage() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAnalytics()
      .then((r) => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-state">Loading analytics…</div>;
  if (!data)   return <div className="empty-state"><span>⚠️</span>Analytics unavailable.</div>;

  const { summary, categoryDistribution = [], statusDistribution = [], monthlyTrend = [] } = data;

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <h1>Analytics &amp; Reports</h1>
        <p>Category distribution, status breakdown and monthly trends</p>
      </div>

      {/* Q7 – Analytics summary cards */}
      <div className="analytics-summary">
        {[
          { label: "Total",     val: summary.total_records,     color: "#7c3aed" },
          { label: "Active",    val: summary.active_records,    color: "#16a34a" },
          { label: "Completed", val: summary.completed_records, color: "#2563eb" },
          { label: "Pending",   val: summary.pending_records,   color: "#d97706" },
        ].map(({ label, val, color }) => (
          <div className="a-card" key={label}>
            <div className="a-val" style={{ color }}>{val ?? 0}</div>
            <div className="a-lbl">{label}</div>
          </div>
        ))}
      </div>

      {/* Charts grid */}
      <div className="charts-grid">

        {/* Category Distribution – Pie */}
        <div className="chart-card">
          <h3>Category Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={categoryDistribution}
                dataKey="count"
                nameKey="category"
                cx="50%" cy="50%"
                outerRadius={95}
                label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
              >
                {categoryDistribution.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [`${v} records`, "Count"]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution – Bar */}
        <div className="chart-card">
          <h3>Status Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={statusDistribution} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="status" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" name="Records" radius={[5, 5, 0, 0]}>
                {statusDistribution.map((entry, i) => (
                  <Cell key={i} fill={STATUS_COLORS[entry.status] || COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Trend – Line (full width) */}
        <div className="chart-card" style={{ gridColumn: "1 / -1" }}>
          <h3>Monthly Record Creation Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyTrend} margin={{ top: 10, right: 30, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                name="Records Created"
                stroke="#2563eb"
                strokeWidth={2.5}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Category breakdown table */}
      <div className="section-box" style={{ marginTop: 24 }}>
        <div className="section-box-header"><h2>Category Breakdown Table</h2></div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Record Count</th>
                <th>% of Total</th>
              </tr>
            </thead>
            <tbody>
              {categoryDistribution.map((row) => (
                <tr key={row.category}>
                  <td><strong>{row.category}</strong></td>
                  <td>{row.count}</td>
                  <td>
                    {summary.total_records
                      ? ((row.count / summary.total_records) * 100).toFixed(1) + "%"
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;
