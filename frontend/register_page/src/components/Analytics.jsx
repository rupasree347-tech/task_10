// src/components/Analytics.jsx
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
} from "recharts";
import "../App.css";

const COLORS = ["#2563eb", "#16a34a", "#d97706", "#dc2626", "#8b5cf6", "#0891b2"];

const Analytics = ({ analytics }) => {
  if (!analytics) return null;

  const categoryData = analytics.categoryDistribution || [];
  const statusData   = analytics.statusDistribution   || [];
  const monthlyData  = analytics.monthlyTrend         || [];

  return (
    <div>
      <h2 style={{ fontSize: "1.2rem", marginBottom: 16 }}>📊 Analytics</h2>

      <div className="charts-grid">

        {/* Category Distribution – Pie */}
        <div className="chart-card">
          <h3>Category Distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="count"
                nameKey="category"
                cx="50%" cy="50%"
                outerRadius={90}
                label={({ category, percent }) =>
                  `${category} (${(percent * 100).toFixed(0)}%)`
                }
              >
                {categoryData.map((_, i) => (
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
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={statusData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" name="Records" radius={[4,4,0,0]}>
                {statusData.map((entry, i) => {
                  const colorMap = { Active: "#16a34a", Completed: "#2563eb", Pending: "#d97706" };
                  return <Cell key={i} fill={colorMap[entry.status] || COLORS[i % COLORS.length]} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Trend – Line */}
        <div className="chart-card" style={{ gridColumn: "1 / -1" }}>
          <h3>Monthly Record Creation Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                name="Records Created"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default Analytics;
