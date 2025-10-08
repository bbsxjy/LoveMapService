import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { parse } from 'csv-parse/sync';
import GPSExtractor from '../services/gps/extractor.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|heic|heif|tiff/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    cb(mime && ext ? null : new Error('Only images allowed'), mime && ext);
  }
});

/**
 * POST /api/gps/extract - Upload single image and extract GPS
 */
router.post('/extract', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const gpsData = await GPSExtractor.extractFromImage(req.file.path);
    const keepFile = req.query.keepFile === 'true';

    if (!keepFile) {
      await fs.unlink(req.file.path).catch(() => {});
    }

    if (!gpsData) {
      return res.status(404).json({
        error: 'No GPS data found',
        filename: req.file.originalname
      });
    }

    res.json({
      success: true,
      data: {
        ...gpsData,
        originalFilename: req.file.originalname,
        fileSize: req.file.size
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/gps/extract/batch - Upload multiple images
 */
router.post('/extract/batch', upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No images uploaded' });
    }

    const results = [];
    const stats = { total: req.files.length, success: 0, failed: 0 };
    const keepFile = req.query.keepFile === 'true';

    for (const file of req.files) {
      const gpsData = await GPSExtractor.extractFromImage(file.path);

      if (gpsData) {
        stats.success++;
        results.push({
          ...gpsData,
          originalFilename: file.originalname,
          fileSize: file.size
        });
      } else {
        stats.failed++;
        results.push({
          success: false,
          filename: file.originalname,
          error: 'No GPS data found'
        });
      }

      if (!keepFile) {
        await fs.unlink(file.path).catch(() => {});
      }
    }

    res.json({ success: true, stats, results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/gps/check - Check if image has GPS data
 */
router.post('/check', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const hasGPS = await GPSExtractor.hasGPSData(req.file.path);
    await fs.unlink(req.file.path).catch(() => {});

    res.json({
      success: true,
      filename: req.file.originalname,
      hasGPSData: hasGPS
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/gps/local - Read GPS data from local CSV
 */
router.get('/local', async (req, res) => {
  try {
    const content = await fs.readFile('gps.csv', 'utf-8');
    const rows = parse(content, {
      columns: false,
      trim: true,
      skip_empty_lines: true
    });

    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to read GPS data',
      message: error.message
    });
  }
});

export default router;
