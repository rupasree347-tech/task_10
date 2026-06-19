import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./Register";
import Login    from "./Login";
import AppShell from "./AppShell";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"          element={<Register />} />
        <Route path="/login"     element={<Login />} />
        {/* All dashboard pages live inside AppShell */}
        <Route path="/dashboard/*" element={<AppShell />} />
        <Route path="*"          element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
