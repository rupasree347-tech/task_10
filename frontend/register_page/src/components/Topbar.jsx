import "../App.css";

const PAGE_TITLES = {
  home:      "Dashboard",
  records:   "Record Management",
  analytics: "Analytics & Reports",
};

const Topbar = ({ onHamburger, activeNav }) => {
  return (
    <header className="topbar">
      <button className="topbar-hamburger" onClick={onHamburger} aria-label="Toggle menu">
        ☰
      </button>

      <div className="topbar-title">
        {PAGE_TITLES[activeNav] || "Dashboard"}
      </div>

      <div className="topbar-right">
        <div className="topbar-user">
          <div className="topbar-avatar">A</div>
          <span>Admin</span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
