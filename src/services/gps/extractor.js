import fs from 'fs/promises';
import exifParser from 'exif-parser';

/**
 * GPS Extractor utility
 * Extracts GPS coordinates and metadata from images
 * Supports iPhone, Huawei, Xiaomi and other smartphone photos
 */

class GPSExtractor {
  /**
   * Convert GPS coordinates from degrees/minutes/seconds to decimal degrees
   */
  static convertToDecimal(degrees, minutes, seconds, direction) {
    let decimal = degrees + minutes / 60 + seconds / 3600;
    if (direction === 'S' || direction === 'W') {
      decimal = -decimal;
    }
    return decimal;
  }

  /**
   * Extract GPS and device information from an image file
   * @param {string|Buffer} imagePathOrBuffer - Path to image file or buffer
   * @returns {Promise<Object|null>} GPS data and metadata
   */
  static async extractFromImage(imagePathOrBuffer) {
    try {
      let buffer;
      let filename = 'unknown';

      // Handle both file path and buffer
      if (Buffer.isBuffer(imagePathOrBuffer)) {
        buffer = imagePathOrBuffer;
      } else {
        buffer = await fs.readFile(imagePathOrBuffer);
        filename = imagePathOrBuffer.split('/').pop();
      }

      // Parse EXIF data
      const parser = exifParser.create(buffer);
      const result = parser.parse();

      if (!result || !result.tags) {
        return null;
      }

      const tags = result.tags;

      // Check if GPS data exists
      if (!tags.GPSLatitude || !tags.GPSLongitude) {
        return null;
      }

      // Extract GPS coordinates
      const latitude = tags.GPSLatitude;
      const longitude = tags.GPSLongitude;

      // Extract device information
      const make = tags.Make || '';
      const model = tags.Model || 'Unknown';
      const device = make && !model.includes(make)
        ? `${make} ${model}`.trim()
        : model.trim();

      // Extract timestamp
      let datetime = 'Unknown';
      if (tags.DateTimeOriginal) {
        datetime = new Date(tags.DateTimeOriginal * 1000).toISOString();
      } else if (tags.DateTime) {
        datetime = new Date(tags.DateTime * 1000).toISOString();
      }

      // Extract additional metadata
      const altitude = tags.GPSAltitude || null;
      const imageWidth = tags.ImageWidth || result.imageSize?.width || null;
      const imageHeight = tags.ImageHeight || result.imageSize?.height || null;

      return {
        filename,
        latitude: parseFloat(latitude.toFixed(8)),
        longitude: parseFloat(longitude.toFixed(8)),
        altitude: altitude ? parseFloat(altitude.toFixed(2)) : null,
        device,
        datetime,
        imageWidth,
        imageHeight,
        make: tags.Make || null,
        model: tags.Model || null,
        success: true
      };
    } catch (error) {
      console.error('Error extracting GPS data:', error.message);
      return null;
    }
  }

  /**
   * Extract GPS data from multiple images
   * @param {Array<string>} imagePaths - Array of image file paths
   * @returns {Promise<Object>} Statistics and results
   */
  static async extractFromMultiple(imagePaths) {
    const results = [];
    const stats = {
      total: imagePaths.length,
      success: 0,
      failed: 0
    };

    for (const imagePath of imagePaths) {
      const gpsData = await this.extractFromImage(imagePath);

      if (gpsData) {
        stats.success++;
        results.push(gpsData);
      } else {
        stats.failed++;
        results.push({
          filename: imagePath.split('/').pop(),
          success: false,
          error: 'No GPS data found'
        });
      }
    }

    return {
      stats,
      results
    };
  }

  /**
   * Validate if image has GPS data without full extraction
   * @param {string|Buffer} imagePathOrBuffer - Path to image or buffer
   * @returns {Promise<boolean>}
   */
  static async hasGPSData(imagePathOrBuffer) {
    try {
      let buffer;

      if (Buffer.isBuffer(imagePathOrBuffer)) {
        buffer = imagePathOrBuffer;
      } else {
        buffer = await fs.readFile(imagePathOrBuffer);
      }

      const parser = exifParser.create(buffer);
      const result = parser.parse();

      return !!(result?.tags?.GPSLatitude && result?.tags?.GPSLongitude);
    } catch (error) {
      return false;
    }
  }
}

export default GPSExtractor;
