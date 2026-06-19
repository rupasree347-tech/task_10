import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./App.css";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app: POST /auth/login and store token
    navigate("/dashboard");
  };

  return (
    <div className="auth-wrapper">
      <div className="container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input type="email"    name="email"    placeholder="Enter your email"    value={form.email}    onChange={handleChange} required />
          <label>Password</label>
          <input type="password" name="password" placeholder="Enter your password" value={form.password} onChange={handleChange} required />
          <button type="submit" className="btn-primary">Login</button>
        </form>
        <p className="auth-link">Don't have an account? <Link to="/">Register</Link></p>
      </div>
    </div>
  );
};

export default Login;
