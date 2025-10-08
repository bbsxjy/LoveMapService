import express from 'express';
import sheetsService from '../services/google/sheets.js';

const router = express.Router();

/**
 * GET /api/sheets/data - Read data from Google Sheet
 */
router.get('/data', async (req, res) => {
  try {
    const range = req.query.range || 'Data!A1:C';
    const rows = await sheetsService.readSheet(range);

    if (rows.length === 0) {
      return res.status(404).json({
        error: 'No data found',
        hint: 'Make sure sheet is shared with service account/OAuth user'
      });
    }

    res.json({ success: true, data: rows, count: rows.length });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to read sheet',
      message: error.message,
      hint: 'Check config/google credentials'
    });
  }
});

export default router;
