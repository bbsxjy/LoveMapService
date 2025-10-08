# LovaMapService v2.0

Modern REST API for extracting GPS coordinates from images and integrating with Google Drive/Sheets.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start the server
npm start

# Server will run on http://localhost:3000
```

## ✨ Features

- 📍 **GPS Extraction** - Upload images, get coordinates instantly
- 📁 **Google Drive Integration** - List and manage images from Drive
- 📊 **Google Sheets Integration** - Read GPS data from spreadsheets
- 🔄 **Batch Processing** - Process up to 10 images at once
- 🌍 **Multi-device Support** - iPhone, Android, all major cameras

## 📋 API Endpoints

### GPS Extraction
```bash
# Extract GPS from single image
POST /api/gps/extract
curl -F "image=@photo.jpg" http://localhost:3000/api/gps/extract

# Batch upload
POST /api/gps/extract/batch
curl -F "images=@photo1.jpg" -F "images=@photo2.jpg" http://localhost:3000/api/gps/extract/batch

# Check if image has GPS
POST /api/gps/check

# Get local GPS data
GET /api/gps/local
```

### Google Drive
```bash
# List images from Drive folder
GET /api/drive/images

# Get file by ID
GET /api/drive/files/:id
```

### Google Sheets
```bash
# Read sheet data
GET /api/sheets/data?range=Data!A1:C
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root:

```bash
PORT=3000
NODE_ENV=development

# Google API (optional)
USE_SERVICE_ACCOUNT=false
DRIVE_IMAGE_FOLDER_ID=your_folder_id
DRIVE_FILE_FOLDER_ID=your_folder_id
GOOGLE_SHEET_ID=your_sheet_id
```

### Google API Setup (Optional)

1. **Get OAuth credentials** from Google Cloud Console
2. **Save as** `config/google/credentials.json`
3. **Generate tokens:**
   ```bash
   node scripts/refresh-google-tokens.js
   ```
4. **Restart server**

See `docs/GOOGLE_API_SETUP.md` for detailed instructions.

## 📁 Project Structure

```
LovaMapService/
├── src/
│   ├── routes/          # API route handlers
│   │   ├── index.js     # API root
│   │   ├── gps.js       # GPS extraction endpoints
│   │   ├── drive.js     # Google Drive endpoints
│   │   └── sheets.js    # Google Sheets endpoints
│   ├── services/        # Business logic
│   │   ├── google/      # Google API services
│   │   └── gps/         # GPS extraction service
│   └── app.js           # Express app setup
├── bin/
│   └── www.js           # Server entry point
├── config/
│   ├── google/          # Google credentials (gitignored)
│   └── .env.example     # Environment template
├── scripts/             # Utility scripts
│   └── refresh-google-tokens.js
├── docs/                # Documentation
├── public/              # Static files
└── uploads/             # Temporary uploads
```

## 🛠️ Development

```bash
# Start with auto-reload
npm run dev

# Run token refresh script
npm run refresh-tokens
```

## 📚 Documentation

- [Google API Setup](docs/GOOGLE_API_SETUP.md) - Configure Google Drive/Sheets
- [Quick Start Guide](docs/QUICKSTART.md) - Get up and running
- [Technical Docs](docs/CLAUDE.md) - Architecture details

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| "No GPS data found" | Image doesn't have GPS EXIF data |
| "Authentication failed" | Run `npm run refresh-tokens` |
| Port already in use | Change PORT in `.env` |

## 📝 License

ISC

## 🤝 Contributing

Pull requests are welcome!
