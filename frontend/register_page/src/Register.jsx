import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./App.css";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    // In a real app: POST /users
    alert("Account created! Please login.");
    navigate("/login");
  };

  return (
    <div className="auth-wrapper">
      <div className="container">
        <h1>Create Account</h1>
        {error && <p style={{ color: "red", marginBottom: 12, textAlign: "center" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input type="text"     name="name"            placeholder="Enter your name"     value={form.name}            onChange={handleChange} required />
          <label>Email</label>
          <input type="email"    name="email"           placeholder="Enter your email"    value={form.email}           onChange={handleChange} required />
          <label>Password</label>
          <input type="password" name="password"        placeholder="Create a password"   value={form.password}        onChange={handleChange} required />
          <label>Confirm Password</label>
          <input type="password" name="confirmPassword" placeholder="Confirm password"    value={form.confirmPassword} onChange={handleChange} required />
          <button type="submit" className="btn-primary">Register</button>
        </form>
        <p className="auth-link">Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
};

export default Register;
