import express from 'express';
const router = express.Router();

/**
 * API Root - Welcome & Endpoints
 */
router.get('/', (req, res) => {
  res.json({
    name: 'LovaMapService API',
    version: '2.0.0',
    description: 'Image GPS extraction and Google Drive/Sheets integration',
    endpoints: {
      gps: {
        uploadSingle: 'POST /api/gps/extract',
        uploadMultiple: 'POST /api/gps/extract/batch',
        checkGPS: 'POST /api/gps/check',
        getLocalData: 'GET /api/gps/local'
      },
      drive: {
        listImages: 'GET /api/drive/images',
        getFile: 'GET /api/drive/files/:id'
      },
      sheets: {
        readData: 'GET /api/sheets/data'
      }
    },
    docs: '/docs'
  });
});

export default router;
