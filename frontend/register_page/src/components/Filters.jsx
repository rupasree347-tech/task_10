// src/components/Filters.jsx
import "../App.css";

const Filters = ({
  categories,
  filterStatus,    onStatusChange,
  filterCategory,  onCategoryChange,
  onReset,
}) => {
  return (
    <div className="search-section">
      <select value={filterStatus} onChange={(e) => onStatusChange(e.target.value)}>
        <option value="">All Statuses</option>
        <option value="Active">Active</option>
        <option value="Completed">Completed</option>
        <option value="Pending">Pending</option>
      </select>

      <select value={filterCategory} onChange={(e) => onCategoryChange(e.target.value)}>
        <option value="">All Categories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <button className="btn btn-warning btn-sm" onClick={onReset}>
        ✕ Reset Filters
      </button>
    </div>
  );
};

export default Filters;
