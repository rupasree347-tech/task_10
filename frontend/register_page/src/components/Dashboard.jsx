// src/components/Dashboard.jsx
import "../App.css";

const Dashboard = ({ analytics, loading }) => {
  const summary = analytics?.summary || {};

  const cards = [
    { label: "Total Records",     value: summary.total_records     ?? "—", cls: "card-total"     },
    { label: "Active Records",    value: summary.active_records    ?? "—", cls: "card-active"    },
    { label: "Completed Records", value: summary.completed_records ?? "—", cls: "card-completed" },
    { label: "Pending Records",   value: summary.pending_records   ?? "—", cls: "card-pending"   },
  ];

  return (
    <div className="dashboard">
      {cards.map((c) => (
        <div key={c.label} className={`card ${c.cls}`}>
          <h3>{c.label}</h3>
          <h2>{loading ? "…" : c.value}</h2>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
