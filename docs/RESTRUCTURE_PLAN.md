# Project Restructure Plan

## Current Issues
- Too many duplicate credential files
- Too many documentation files
- Nested route structure is confusing
- Test files in root directory
- Unclear separation of concerns

## Proposed Clean Structure

```
LovaMapService/
├── src/                          # All source code
│   ├── routes/
│   │   ├── gps.js               # GPS extraction endpoints
│   │   ├── drive.js             # Google Drive endpoints
│   │   ├── sheets.js            # Google Sheets endpoints
│   │   └── index.js             # API root
│   ├── services/
│   │   ├── google/
│   │   │   ├── auth.js          # Google authentication
│   │   │   ├── drive.js         # Drive service
│   │   │   └── sheets.js        # Sheets service
│   │   └── gps/
│   │       └── extractor.js     # GPS extraction logic
│   └── app.js                   # Express app setup
├── bin/
│   └── www.js                   # Server entry point
├── config/                      # Configuration files
│   ├── .env                     # Environment variables
│   ├── .env.example             # Environment template
│   └── google/                  # Google credentials (gitignored)
│       ├── credentials.json     # OAuth credentials
│       └── tokens.json          # Access tokens
├── scripts/                     # Utility scripts
│   ├── refresh-google-tokens.js
│   └── setup-google-auth.js
├── docs/                        # All documentation
│   ├── GOOGLE_SETUP.md
│   └── API.md
├── public/                      # Static files
├── uploads/                     # Temporary uploads
├── tests/                       # Test files
├── .gitignore
├── package.json
└── README.md                    # Main readme only
```

## Benefits
1. **Cleaner root** - Only essential files
2. **Clear separation** - src/, config/, docs/, scripts/
3. **Single credentials file** - One `credentials.json` instead of 3-4
4. **Flat route structure** - No deep nesting
5. **Service layer** - Business logic separated from routes
6. **Better for scaling** - Easy to add new features

## Migration Steps
1. Create new folder structure
2. Move files to appropriate locations
3. Update all imports/paths
4. Consolidate credentials
5. Clean up old files
6. Update documentation

Would you like me to implement this restructure?
