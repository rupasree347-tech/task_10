// server.js
require('dotenv').config();
const express   = require('express');
const cors      = require('cors');

const recordsRouter    = require('./routes/records');
const dashboardRouter  = require('./routes/dashboard');
const categoriesRouter = require('./routes/categories');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ─────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ─────────────────────────────────────────────────────
app.use('/records',            recordsRouter);
app.use('/dashboard',          dashboardRouter);
app.use('/categories',         categoriesRouter);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Task 10 API is running 🚀', status: 'OK' });
});

// ── Global error handler ───────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ── Start ──────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
