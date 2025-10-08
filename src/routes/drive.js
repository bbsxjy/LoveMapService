import express from 'express';
import driveService from '../services/google/drive.js';

const router = express.Router();

/**
 * GET /api/drive/images - List all images from Drive folder
 */
router.get('/images', async (req, res) => {
  try {
    const files = await driveService.listImages();

    if (files.length === 0) {
      return res.status(404).json({
        error: 'No images found',
        hint: 'Make sure folder is shared with service account/OAuth user'
      });
    }

    // Group in pairs for backward compatibility
    const paired = [];
    let temp = [];

    for (const file of files) {
      temp.push([file.name, file.id]);
      if (temp.length === 2) {
        paired.push(temp);
        temp = [];
      }
    }
    if (temp.length > 0) paired.push(temp);

    res.json({ success: true, data: paired, total: files.length });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to list images',
      message: error.message,
      hint: 'Check config/google credentials'
    });
  }
});

/**
 * GET /api/drive/files/:id - Get file by ID
 */
router.get('/files/:id', async (req, res) => {
  try {
    const file = await driveService.getFileById(req.params.id);
    res.json({ success: true, data: file });
  } catch (error) {
    const status = error.code === 404 ? 404 : 500;
    res.status(status).json({
      error: 'Failed to get file',
      message: error.message
    });
  }
});

export default router;
