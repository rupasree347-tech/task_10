// src/components/SearchBar.jsx
import "../App.css";

function SearchBar({ search, onSearchChange, searchId, onSearchIdChange }) {
  return (
    <div className="search-section">
      <input
        type="text"
        placeholder="🔍 Search by Name"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <input
        type="number"
        placeholder="🔍 Search by ID"
        value={searchId}
        onChange={(e) => onSearchIdChange(e.target.value)}
        min="1"
      />
    </div>
  );
}

export default SearchBar;
