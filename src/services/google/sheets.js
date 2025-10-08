import { google } from 'googleapis';
import { getSheetsAuth } from './auth.js';

const SHEET_ID = process.env.GOOGLE_SHEET_ID || '1oou20bKK1zWKflYrXcA-AUqpQWPU9bjrR-s4LQ3DVOM';

/**
 * Google Sheets Service
 */
class SheetsService {
  /**
   * Read data from sheet
   */
  async readSheet(range = 'Data!A1:C') {
    const auth = await getSheetsAuth();
    const sheets = google.sheets({ version: 'v4', auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: range,
    });

    return response.data.values || [];
  }
}

export default new SheetsService();
