// This file is kept for backward compatibility.
// The actual dashboard is in src/pages/DashboardPage.jsx
// AppShell handles routing now.
import { Navigate } from "react-router-dom";
export default function DashboardPage() {
  return <Navigate to="/dashboard/home" replace />;
}
