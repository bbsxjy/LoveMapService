# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LovaMapService is a modern Express.js-based REST API service that:
- Integrates with Google Drive and Google Sheets APIs to manage image metadata
- Extracts GPS coordinates from uploaded images automatically
- Supports various smartphone cameras (iPhone, Huawei, Xiaomi, etc.)
- Uses ES modules, async/await patterns, and modern Node.js features

## Commands

### Running the Application
```bash
npm start          # Start the server on port 3000
npm run dev        # Start with auto-reload (Node.js --watch mode)
```

### Installation
```bash
npm install        # Install all dependencies
```

## Architecture

### Technology Stack
- **Node.js**: >=18.0.0 (ES modules enabled)
- **Express.js**: 5.1.0 with modern async/await patterns
- **Google APIs**: googleapis v161 (Drive v3, Sheets v4)
- **Image Processing**: exif-parser for GPS extraction
- **File Upload**: multer for multipart/form-data handling

### Core Components

**Express Application (`app.js`)**
- Modern ES module imports with `type: "module"` in package.json
- CORS enabled for all origins with full HTTP method support
- Environment variables loaded via dotenv
- Comprehensive error handling middleware

**Google API Integration (`googleAPI/`)**
- `googleAPI/drive/index.js`: Google Drive v3 API wrapper with OAuth2
- `googleAPI/sheet/index.js`: Google Sheets v4 API wrapper with OAuth2
- Modern async/await patterns replacing callback-based authentication
- Environment variable support for folder/sheet IDs

**GPS Extraction (`utils/gpsExtractor.js`)**
- Extracts GPS coordinates (latitude/longitude) from image EXIF data
- Supports multiple smartphone formats (JPEG, PNG, HEIC, HEIF, TIFF)
- Returns device model, timestamp, altitude, and image dimensions
- Handles both file paths and Buffer objects

**Routes**

*Legacy Routes (Existing):*
- `GET /`: API information and endpoint listing
- `GET /decorate/getImages`: Lists images from Drive folder (returns [name, id] pairs)
- `GET /decorate/getImageById/:id`: Fetches specific Drive file metadata
- `GET /decorate/getGpsFromAllImages`: Reads GPS data from local `gps.csv` file

*New GPS Extraction Routes:*
- `POST /upload/extractGPS/single`: Upload single image, extract GPS data
  - Form-data field: `image`
  - Query param: `keepFile=true` (optional, keeps uploaded file)
  - Returns: GPS coordinates, device info, timestamp, image dimensions

- `POST /upload/extractGPS/multiple`: Upload multiple images (max 10)
  - Form-data field: `images[]`
  - Returns: Statistics and individual results for each image

- `POST /upload/extractGPS/check`: Quick check if image contains GPS data
  - Form-data field: `image`
  - Returns: Boolean indicating GPS data presence

### Authentication Flow

**Google API OAuth2:**
- Drive API: `credentials_drive.json` → `token_drive.json`
- Sheets API: `credentials_sheet.json` → `token_sheet.json`
- Tokens must exist before API calls (no interactive auth flow in production)
- Uses modern async file I/O with `fs/promises`

### Key Configuration

**Environment Variables (`.env` file):**
```bash
PORT=3000
NODE_ENV=development
DRIVE_IMAGE_FOLDER_ID=1HMlMuLpqdhbs90iUKZo3rp-Zpkz3vG_N
DRIVE_FILE_FOLDER_ID=1f5HjYjvHCsmeyptBKYNAZGCY0JPhrris
GOOGLE_SHEET_ID=1oou20bKK1zWKflYrXcA-AUqpQWPU9bjrR-s4LQ3DVOM
```

**File Upload Limits:**
- Max file size: 10MB per image
- Max files in batch: 10 images
- Allowed formats: JPEG, JPG, PNG, HEIC, HEIF, TIFF
- Uploaded files stored in `uploads/` directory (auto-created)
- Files auto-deleted after processing unless `keepFile=true`

**Google Drive Configuration:**
- Images queried with MIME type filter: `mimeType contains 'image'`
- Sheets data range: `Data!A1:C`

### Dependencies

**Core:**
- `express` ^5.1.0 - Web framework (v5 with async error handling)
- `googleapis` ^161.0.0 - Google APIs client
- `dotenv` ^16.4.7 - Environment variable management

**Image Processing:**
- `exif-parser` ^0.1.12 - EXIF/GPS data extraction
- `multer` ^1.4.5-lts.1 - File upload middleware

**Utilities:**
- `csv-parse` ^6.1.0 - CSV parsing (sync API)
- `morgan` ^1.10.1 - HTTP request logging
- `cookie-parser` ^1.4.7 - Cookie parsing
- `debug` ^4.4.3 - Debug logging

### Project Structure

```
├── app.js                          # Express app configuration
├── bin/www.js                      # Server startup script
├── routes/
│   ├── index.js                    # Root API endpoint
│   ├── decorate/get/               # Legacy Drive/GPS routes
│   ├── test/                       # Test endpoint
│   └── upload/
│       └── extractGPS.js           # Image upload & GPS extraction
├── googleAPI/
│   ├── drive/index.js              # Google Drive integration
│   └── sheet/index.js              # Google Sheets integration
├── utils/
│   └── gpsExtractor.js             # GPS extraction utility
├── uploads/                        # Temporary upload directory
├── public/                         # Static files
├── .env.example                    # Environment variables template
└── package.json                    # Dependencies and scripts

### Development Notes

- All modules use ES6 imports/exports
- Async/await used throughout (no callbacks)
- Error handling includes proper HTTP status codes
- CORS enabled for cross-origin requests
- Server includes startup emoji indicator (🚀)
- Use `npm run dev` for development with auto-reload
