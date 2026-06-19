// src/components/RecordTable.jsx
import "../App.css";

const statusBadge = (status) => {
  const map = {
    Active:    "badge badge-active",
    Completed: "badge badge-completed",
    Pending:   "badge badge-pending",
  };
  return <span className={map[status] || "badge"}>{status}</span>;
};

const RecordTable = ({ records, loading, onEdit, onDelete }) => {
  if (loading) return <div className="loading">Loading records…</div>;

  if (!records.length)
    return <div className="empty-state">No records found. Try adjusting your search or add a new record.</div>;

  return (
    <div className="table-responsive">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Category</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((rec) => (
            <tr key={rec.id}>
              <td>{rec.id}</td>
              <td>{rec.name}</td>
              <td>{rec.email || "—"}</td>
              <td>{rec.category_name}</td>
              <td>{statusBadge(rec.status)}</td>
              <td>{new Date(rec.created_at).toLocaleDateString()}</td>
              <td>
                <div className="actions">
                  <button className="btn btn-success btn-sm" onClick={() => onEdit(rec)}>
                     Edit
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => onDelete(rec.id)}>
                     Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecordTable;
