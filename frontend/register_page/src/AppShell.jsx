import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar   from "./components/Sidebar";
import Topbar    from "./components/Topbar";
import DashboardPage  from "./pages/DashboardPage";
import RecordsPage    from "./pages/RecordsPage";
import AnalyticsPage  from "./pages/AnalyticsPage";
import "./App.css";

function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav,   setActiveNav]   = useState("dashboard");

  const toggleSidebar = () => setSidebarOpen((v) => !v);
  const closeSidebar  = () => setSidebarOpen(false);

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        active={activeNav}
        onNavigate={(key) => { setActiveNav(key); closeSidebar(); }}
      />
      {/* Overlay for mobile */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`}
        onClick={closeSidebar}
      />

      {/* Topbar */}
      <Topbar onHamburger={toggleSidebar} activeNav={activeNav} />

      {/* Main content */}
      <main className="main-content">
        <Routes>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home"      element={<DashboardPage  setActive={setActiveNav} />} />
          <Route path="records"   element={<RecordsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="*"         element={<Navigate to="home" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default AppShell;
