// routes/records.js
const express  = require('express');
const router   = express.Router();
const { body, param } = require('express-validator');
const validate = require('../middleware/validate');
const db       = require('../config/db');

// ── Validation rules ───────────────────────────────────────────
const recordRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('category_id')
    .isInt({ min: 1 }).withMessage('Valid category_id is required'),
  body('status')
    .isIn(['Active', 'Completed', 'Pending'])
    .withMessage('Status must be Active, Completed, or Pending'),
  body('email').optional({ checkFalsy: true }).isEmail().withMessage('Invalid email'),
  body('notes').optional().trim(),
];

// ── GET /records ───────────────────────────────────────────────
// Supports query params: search, searchId, status, category_id
router.get('/', async (req, res) => {
  try {
    const { search, searchId, status, category_id } = req.query;

    let query = `
      SELECT r.*, c.name AS category_name
      FROM records r
      JOIN categories c ON c.id = r.category_id
      WHERE 1=1
    `;
    const params = [];
    let idx = 1;

    if (search) {
      query += ` AND LOWER(r.name) LIKE LOWER($${idx++})`;
      params.push(`%${search}%`);
    }
    if (searchId) {
      query += ` AND r.id = $${idx++}`;
      params.push(Number(searchId));
    }
    if (status) {
      query += ` AND r.status = $${idx++}`;
      params.push(status);
    }
    if (category_id) {
      query += ` AND r.category_id = $${idx++}`;
      params.push(Number(category_id));
    }

    query += ' ORDER BY r.id DESC';

    const result = await db.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── GET /records/:id ───────────────────────────────────────────
router.get('/:id',
  [param('id').isInt().withMessage('ID must be an integer')],
  validate,
  async (req, res) => {
    try {
      const result = await db.query(
        `SELECT r.*, c.name AS category_name
         FROM records r
         JOIN categories c ON c.id = r.category_id
         WHERE r.id = $1`,
        [req.params.id]
      );
      if (!result.rows.length) {
        return res.status(404).json({ success: false, message: 'Record not found' });
      }
      res.json({ success: true, data: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// ── POST /records ──────────────────────────────────────────────
router.post('/', recordRules, validate, async (req, res) => {
  try {
    const { name, email, category_id, status, notes } = req.body;
    const result = await db.query(
      `INSERT INTO records (name, email, category_id, status, notes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, email || null, category_id, status || 'Active', notes || null]
    );
    res.status(201).json({ success: true, data: result.rows[0], message: 'Record created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── PUT /records/:id ───────────────────────────────────────────
router.put('/:id',
  [param('id').isInt(), ...recordRules],
  validate,
  async (req, res) => {
    try {
      const { name, email, category_id, status, notes } = req.body;
      const result = await db.query(
        `UPDATE records
         SET name=$1, email=$2, category_id=$3, status=$4, notes=$5, updated_at=NOW()
         WHERE id=$6
         RETURNING *`,
        [name, email || null, category_id, status, notes || null, req.params.id]
      );
      if (!result.rows.length) {
        return res.status(404).json({ success: false, message: 'Record not found' });
      }
      res.json({ success: true, data: result.rows[0], message: 'Record updated' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// ── DELETE /records/:id ────────────────────────────────────────
router.delete('/:id',
  [param('id').isInt().withMessage('ID must be an integer')],
  validate,
  async (req, res) => {
    try {
      const result = await db.query(
        'DELETE FROM records WHERE id=$1 RETURNING id',
        [req.params.id]
      );
      if (!result.rows.length) {
        return res.status(404).json({ success: false, message: 'Record not found' });
      }
      res.json({ success: true, message: `Record ${req.params.id} deleted` });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

module.exports = router;
