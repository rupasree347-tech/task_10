// src/components/Toast.jsx
import "../App.css";

const Toast = ({ message, type }) => (
  <div className={`toast toast-${type}`}>
    {type === "success" ? "✅" : "❌"} {message}
  </div>
);

export default Toast;
