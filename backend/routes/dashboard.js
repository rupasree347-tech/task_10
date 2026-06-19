// routes/dashboard.js
const express = require('express');
const router  = express.Router();
const db      = require('../config/db');

// ── GET /dashboard/analytics ───────────────────────────────────
router.get('/analytics', async (req, res) => {
  try {
    // Summary counts
    const summary = await db.query(`
      SELECT
        COUNT(*)                                            AS total_records,
        COUNT(*) FILTER (WHERE status = 'Active')          AS active_records,
        COUNT(*) FILTER (WHERE status = 'Completed')       AS completed_records,
        COUNT(*) FILTER (WHERE status = 'Pending')         AS pending_records
      FROM records
    `);

    // Category distribution
    const categoryDist = await db.query(`
      SELECT c.name AS category, COUNT(r.id)::int AS count
      FROM categories c
      LEFT JOIN records r ON r.category_id = c.id
      GROUP BY c.name
      ORDER BY c.name
    `);

    // Status distribution
    const statusDist = await db.query(`
      SELECT status, COUNT(*)::int AS count
      FROM records
      GROUP BY status
    `);

    // Monthly trend (last 12 months)
    const monthly = await db.query(`
      SELECT
        TO_CHAR(created_at, 'Mon YYYY') AS month,
        TO_CHAR(created_at, 'YYYY-MM')  AS sort_key,
        COUNT(*)::int                    AS count
      FROM records
      WHERE created_at >= NOW() - INTERVAL '12 months'
      GROUP BY TO_CHAR(created_at, 'Mon YYYY'), TO_CHAR(created_at, 'YYYY-MM')
      ORDER BY sort_key
    `);

    res.json({
      success: true,
      data: {
        summary:              summary.rows[0],
        categoryDistribution: categoryDist.rows,
        statusDistribution:   statusDist.rows,
        monthlyTrend:         monthly.rows,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
