import { google } from 'googleapis';
import { getDriveAuth } from './auth.js';

const IMAGE_FOLDER_ID = process.env.DRIVE_IMAGE_FOLDER_ID || '1HMlMuLpqdhbs90iUKZo3rp-Zpkz3vG_N';
const FILE_FOLDER_ID = process.env.DRIVE_FILE_FOLDER_ID || '1f5HjYjvHCsmeyptBKYNAZGCY0JPhrris';

/**
 * Google Drive Service
 */
class DriveService {
  /**
   * List images from Drive folder
   */
  async listImages() {
    const auth = await getDriveAuth();
    const drive = google.drive({ version: 'v3', auth });

    const response = await drive.files.list({
      q: `mimeType contains 'image' and '${IMAGE_FOLDER_ID}' in parents`,
      fields: 'files(id, name, mimeType, createdTime)',
      pageSize: 100,
      orderBy: 'createdTime desc'
    });

    return response.data.files || [];
  }

  /**
   * List files from Drive folder
   */
  async listFiles() {
    const auth = await getDriveAuth();
    const drive = google.drive({ version: 'v3', auth });

    const response = await drive.files.list({
      q: `'${FILE_FOLDER_ID}' in parents`,
      fields: 'files(id, name, mimeType)',
      pageSize: 100,
    });

    return response.data.files || [];
  }

  /**
   * Get file by ID
   */
  async getFileById(fileId) {
    const auth = await getDriveAuth();
    const drive = google.drive({ version: 'v3', auth });

    const response = await drive.files.get({
      fileId: fileId,
      fields: 'id, name, mimeType, size, createdTime, modifiedTime, webViewLink, thumbnailLink',
    });

    return response.data;
  }
}

export default new DriveService();
