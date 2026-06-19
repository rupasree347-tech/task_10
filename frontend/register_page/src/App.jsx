import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register    from "./Register";
import Login       from "./Login";
import DashboardPage from "./DashboardPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"          element={<Register />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*"          element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
