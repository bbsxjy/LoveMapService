# LovaMapService - Quick Start Guide

## ✅ What's Working NOW

The GPS extraction features work **immediately** without any Google setup:

```bash
# Start the server
npm start

# Test GPS extraction from an image
curl -X POST http://localhost:3000/upload/extractGPS/single \
  -F "image=@your-photo.jpg"

# Upload multiple images
curl -X POST http://localhost:3000/upload/extractGPS/multiple \
  -F "images=@photo1.jpg" \
  -F "images=@photo2.jpg"

# Check local GPS CSV data
curl http://localhost:3000/decorate/getGpsFromAllImages
```

## 🔧 Google Drive/Sheets Integration (Optional)

Your OAuth credentials from 2019 are expired. To fix Google API access:

### Option A: Service Account (Easiest - Recommended)

1. **Create service account** at https://console.cloud.google.com/
   - Enable Google Drive API and Google Sheets API
   - Create service account credentials
   - Download JSON key as `service-account.json`

2. **Share your Drive folder/Sheets** with the service account email
   (found in the JSON file as `client_email`)

3. **Configure environment:**
   ```bash
   # Add to .env file
   USE_SERVICE_ACCOUNT=true
   ```

4. **Restart server:**
   ```bash
   npm start
   ```

### Option B: OAuth 2.0 (More Setup)

1. Create new OAuth client in Google Cloud Console
2. Download credentials as `credentials_drive.json`
3. Run: `node refresh-tokens.js`
4. Follow the prompts to authorize

**See `GOOGLE_API_SETUP.md` for detailed step-by-step instructions.**

## 📁 Project Structure

```
├── routes/upload/extractGPS.js  ← GPS extraction endpoints (WORKING)
├── routes/decorate/get/         ← Google Drive endpoints (needs setup)
├── utils/gpsExtractor.js         ← GPS extraction logic
├── googleAPI/auth.js             ← Flexible authentication
├── GOOGLE_API_SETUP.md           ← Detailed setup guide
└── refresh-tokens.js             ← OAuth token generator
```

## 🚀 Main Features

### GPS Extraction (No Setup Needed)
- ✅ Upload images and get GPS coordinates instantly
- ✅ Supports iPhone, Android, all major camera brands
- ✅ Batch processing up to 10 images
- ✅ Returns device info, timestamps, altitude

### Google Drive Integration (Requires Setup)
- 📍 List images from Drive folder
- 📍 Get file metadata by ID
- 📍 Read GPS data from Google Sheets

## 💡 Quick Test

```bash
# 1. Start server
npm start

# 2. Test GPS extraction (works immediately)
curl -X POST http://localhost:3000/upload/extractGPS/single \
  -F "image=@/path/to/photo-with-gps.jpg"

# 3. Test Google Drive (will show error until configured)
curl http://localhost:3000/decorate/getImages
```

## ❓ Troubleshooting

| Issue | Solution |
|-------|----------|
| "Error 400: invalid_request" | Old OAuth credentials - see `GOOGLE_API_SETUP.md` |
| "Authentication failed" | Setup service account or refresh OAuth tokens |
| "No GPS data found" | Image doesn't have GPS EXIF data |

## 📚 Documentation

- **GOOGLE_API_SETUP.md** - Complete Google API setup guide
- **README.md** - Full API documentation
- **CLAUDE.md** - Technical architecture guide

## Next Steps

1. ✅ GPS extraction is ready to use now
2. 📝 Optional: Set up Google API following `GOOGLE_API_SETUP.md`
3. 🎯 Test the endpoints with your own images
