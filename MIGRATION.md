# LovaMapService v2.0 - Restructure Complete! 🎉

## What Changed

Successfully restructured from a messy 2019 project to a clean, modern v2.0 architecture!

## New Structure

```
LovaMapService/
├── src/                     # ✨ All source code (NEW)
│   ├── routes/              # API routes (flat structure)
│   │   ├── index.js         # API root
│   │   ├── gps.js           # GPS extraction endpoints
│   │   ├── drive.js         # Google Drive endpoints
│   │   └── sheets.js        # Google Sheets endpoints
│   ├── services/            # Business logic layer
│   │   ├── google/
│   │   │   ├── auth.js      # Unified authentication
│   │   │   ├── drive.js     # Drive service
│   │   │   └── sheets.js    # Sheets service
│   │   └── gps/
│   │       └── extractor.js # GPS extraction logic
│   └── app.js               # Express app
├── bin/
│   └── www.js               # Server entry point
├── config/                  # ✨ Configuration (NEW)
│   ├── google/              # Google credentials (1 file!)
│   └── .env.example
├── scripts/                 # ✨ Utility scripts (NEW)
│   └── refresh-google-tokens.js
├── docs/                    # ✨ All documentation (NEW)
│   ├── CLAUDE.md
│   ├── GOOGLE_API_SETUP.md
│   ├── QUICKSTART.md
│   └── RESTRUCTURE_PLAN.md
├── public/                  # Static files
├── uploads/                 # Temporary uploads
└── README.md                # Main readme

```

## Key Improvements

### 1. **Credentials Simplified** (5 → 1 file)
- **Before**: `credentials_drive.json`, `credentials_sheet.json`, `token_drive.json`, `token_sheet.json`, `google_client_oauth2.json`
- **After**: `config/google/credentials.json`, `config/google/tokens.json`

### 2. **Routes Flattened**
- **Before**: `routes/decorate/get/getImages.js` (deeply nested)
- **After**: `src/routes/drive.js` (all Drive routes in one file)

### 3. **Service Layer Added**
- Business logic separated from routes
- Clean architecture: Routes → Services → APIs

### 4. **Documentation Organized**
- All docs in `docs/` folder
- Single, comprehensive README.md

### 5. **Modern Patterns**
- Service classes with singleton pattern
- Unified authentication module
- Async/await throughout
- Proper error handling

## New API Endpoints

All endpoints now have `/api` prefix for clarity:

```bash
# GPS Extraction
POST /api/gps/extract           # Single image
POST /api/gps/extract/batch     # Multiple images
POST /api/gps/check             # Check GPS presence
GET  /api/gps/local             # Local CSV data

# Google Drive
GET /api/drive/images           # List images
GET /api/drive/files/:id        # Get file by ID

# Google Sheets
GET /api/sheets/data            # Read sheet data
```

## Migration Steps Completed

✅ Created new folder structure
✅ Moved services to `src/services/`
✅ Refactored routes to `src/routes/`
✅ Consolidated credentials to `config/google/`
✅ Moved scripts to `scripts/`
✅ Organized docs to `docs/`
✅ Updated all import paths
✅ Removed 20+ obsolete files
✅ Updated package.json to v2.0.0
✅ Added new npm scripts
✅ Tested application ✨

## Next Steps

### 1. Generate Google Tokens

```bash
npm run refresh-tokens
```

This will:
- Read from `config/google/credentials.json`
- Generate OAuth tokens
- Save to `config/google/tokens.json`

### 2. Test the APIs

```bash
# Server is already running!
# Test GPS extraction
curl -F "image=@photo.jpg" http://localhost:3000/api/gps/extract

# Test Drive API (after generating tokens)
curl http://localhost:3000/api/drive/images
```

### 3. Update Environment

Copy `config/.env.example` to `.env` and configure:

```bash
PORT=3000
NODE_ENV=development
USE_SERVICE_ACCOUNT=false
DRIVE_IMAGE_FOLDER_ID=your_folder_id
GOOGLE_SHEET_ID=your_sheet_id
```

## Breaking Changes

⚠️ API endpoints have changed:

| Old Endpoint | New Endpoint |
|--------------|--------------|
| `/decorate/getImages` | `/api/drive/images` |
| `/decorate/getImageById/:id` | `/api/drive/files/:id` |
| `/decorate/getGpsFromAllImages` | `/api/gps/local` |
| `/upload/extractGPS/single` | `/api/gps/extract` |
| `/upload/extractGPS/multiple` | `/api/gps/extract/batch` |
| `/upload/extractGPS/check` | `/api/gps/check` |

## Files Removed

- `app.js` (moved to `src/app.js`)
- `googleAPI/` folder
- `routes/` folder (old structure)
- `utils/` folder
- `test-google-api.js`
- All duplicate credential files
- `.env.example` (moved to `config/`)

## What's Working Now

✅ GPS extraction from images
✅ Batch image processing
✅ Modern ES modules
✅ Service layer architecture
✅ Unified Google authentication
✅ Clean project structure
✅ Comprehensive documentation
⏳ Google Drive/Sheets (waiting for token generation)

## Version Info

- **Version**: 2.0.0
- **Node.js**: >= 18.0.0
- **Express**: 5.1.0
- **Type**: ES Module

---

🎉 **Restructure Complete!** The project is now clean, modern, and ready for continued development!
