import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./App.css";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/dashboard/home");
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <p className="brand">📋 RecordMS – Management System</p>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" placeholder="email@example.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" placeholder="Your password" value={form.password} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: 6 }}>Login</button>
        </form>
        <p className="auth-link">Don't have an account? <Link to="/">Register</Link></p>
      </div>
    </div>
  );
};
export default Login;
