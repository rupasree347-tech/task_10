// components/RecordTable.jsx  –  Q3 Read, Q4 Edit, Q5 Delete
import "../App.css";

const statusBadge = (status) => {
  const map = { Active: "badge-active", Completed: "badge-completed", Pending: "badge-pending" };
  return <span className={`badge ${map[status] || ""}`}>{status}</span>;
};

const RecordTable = ({ records, loading, onEdit, onDelete }) => {
  if (loading) return <div className="loading-state"> Loading records…</div>;
  if (!records.length) return (
    <div className="empty-state">
      <span></span>
      No records found. Try adjusting your filters or add a new record.
    </div>
  );

  return (
    <div className="table-wrap">
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
              <td>#{rec.id}</td>
              <td><strong>{rec.name}</strong></td>
              <td>{rec.email || "—"}</td>
              <td>{rec.category_name}</td>
              <td>{statusBadge(rec.status)}</td>
              <td>{new Date(rec.created_at).toLocaleDateString()}</td>
              <td>
                <div className="actions-cell">
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
