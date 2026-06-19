// src/components/RecordForm.jsx
import { useState, useEffect } from "react";
import "../App.css";

const EMPTY = { name: "", email: "", category_id: "", status: "Active", notes: "" };

const RecordForm = ({ record, categories, onSave, onClose }) => {
  const [form,   setForm]   = useState(EMPTY);
  const [errors, setErrors] = useState({});

  // Populate form when editing
  useEffect(() => {
    if (record) {
      setForm({
        name:        record.name        || "",
        email:       record.email       || "",
        category_id: record.category_id || "",
        status:      record.status      || "Active",
        notes:       record.notes       || "",
      });
    } else {
      setForm(EMPTY);
    }
    setErrors({});
  }, [record]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim())        errs.name        = "Name is required.";
    if (!form.category_id)        errs.category_id = "Category is required.";
    if (!form.status)             errs.status      = "Status is required.";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                                  errs.email       = "Invalid email address.";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave({ ...form, category_id: Number(form.category_id) });
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <h2>{record ? " Edit Record" : "➕ Add New Record"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="record-form">

            {/* Name */}
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text" name="name"
                placeholder="Full name"
                value={form.name} onChange={handleChange}
              />
              {errors.name && <span style={{ color: "red", fontSize: ".8rem" }}>{errors.name}</span>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label>Email</label>
              <input
                type="email" name="email"
                placeholder="email@example.com"
                value={form.email} onChange={handleChange}
              />
              {errors.email && <span style={{ color: "red", fontSize: ".8rem" }}>{errors.email}</span>}
            </div>

            {/* Category */}
            <div className="form-group">
              <label>Category *</label>
              <select name="category_id" value={form.category_id} onChange={handleChange}>
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {errors.category_id && <span style={{ color: "red", fontSize: ".8rem" }}>{errors.category_id}</span>}
            </div>

            {/* Status */}
            <div className="form-group">
              <label>Status *</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            {/* Notes */}
            <div className="form-group full-row">
              <label>Notes</label>
              <textarea
                name="notes"
                placeholder="Optional notes…"
                value={form.notes} onChange={handleChange}
              />
            </div>

          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-success">
              {record ? "Update Record" : "Add Record"}
            </button>
            <button type="button" className="btn btn-danger" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecordForm;
