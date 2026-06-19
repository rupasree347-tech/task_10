import { useNavigate, useLocation } from "react-router-dom";
import "../App.css";

const NAV_ITEMS = [
  { key: "home",      label: "Dashboard",  icon: "", path: "/dashboard/home"      },
  { key: "records",   label: "Records",    icon: "", path: "/dashboard/records"   },
  { key: "analytics", label: "Analytics",  icon: "", path: "/dashboard/analytics" },
];

const Sidebar = ({ open, onNavigate }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (item) => {
    navigate(item.path);
    onNavigate(item.key);
  };

  const isActive = (item) => location.pathname === item.path || location.pathname.startsWith(item.path + "/");

  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <h2> RecordMS</h2>
        <p>Management System</p>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section-label">Main Menu</div>

        {NAV_ITEMS.map((item) => (
          <div
            key={item.key}
            className={`nav-item ${isActive(item) ? "active" : ""}`}
            onClick={() => handleNav(item)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </div>
        ))}

        <div className="nav-section-label" style={{ marginTop: 12 }}>Management</div>
        <div
          className="nav-item"
          onClick={() => { navigate("/dashboard/records"); onNavigate("records"); }}
        >
          <span className="nav-icon">➕</span>
          Add Record
        </div>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="nav-item" onClick={() => navigate("/login")}>
          <span className="nav-icon">🚪</span>
          Logout
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
