# Google API Setup Guide

Your current Google API credentials are from 2019 and are no longer valid. This guide will help you set up new credentials.

## Problem

The current error `Error 400: invalid_request` from "Quickstart" means:
- The OAuth client credentials are outdated (from 2019)
- The Google Cloud project may have been deleted or deactivated
- The redirect URIs may not be authorized anymore

## Solutions

You have **two options** to fix the Google Drive/Sheets integration:

---

## Option 1: Service Account (Recommended for Server Apps)

Service accounts are better for server-side applications as they don't require user interaction.

### Steps:

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Create a new project or select an existing one

2. **Enable APIs**
   - Go to "APIs & Services" > "Library"
   - Search and enable:
     - Google Drive API
     - Google Sheets API

3. **Create Service Account**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Fill in the details:
     - Name: `lovamapservice`
     - Description: `Service account for LovaMapService`
   - Click "Create and Continue"
   - Skip optional steps, click "Done"

4. **Generate Key**
   - Click on the created service account
   - Go to "Keys" tab
   - Click "Add Key" > "Create new key"
   - Choose "JSON" format
   - Download the file
   - Rename it to `service-account.json` and place in project root

5. **Share Drive/Sheets with Service Account**
   - Open the JSON file and copy the `client_email` value
   - Go to your Google Drive folder
   - Right-click > Share
   - Paste the service account email
   - Give "Viewer" permission
   - Do the same for Google Sheets

6. **Update Code**
   - Use the service account authentication (I'll create this for you)

---

## Option 2: New OAuth 2.0 Credentials

If you prefer OAuth (for accessing user-specific data):

### Steps:

1. **Create OAuth Consent Screen**
   - Go to: https://console.cloud.google.com/apis/credentials/consent
   - User Type: External (or Internal if you have Google Workspace)
   - Fill in:
     - App name: `LovaMapService`
     - User support email: your email
     - Developer contact: your email
   - Save and Continue

2. **Add Scopes**
   - Add these scopes:
     - `https://www.googleapis.com/auth/drive.metadata.readonly`
     - `https://www.googleapis.com/auth/spreadsheets.readonly`
   - Save and Continue

3. **Add Test Users** (if External)
   - Add your Google account email
   - Save and Continue

4. **Create OAuth Client**
   - Go to "Credentials" > "Create Credentials" > "OAuth client ID"
   - Application type: "Desktop app"
   - Name: `LovaMapService Desktop Client`
   - Click "Create"
   - Download the JSON file
   - Rename to `credentials_drive.json`

5. **Generate Tokens**
   ```bash
   node refresh-tokens.js
   ```

---

## Quick Fix: Use Service Account (Recommended)

I'll create a new authentication module that supports service accounts. This is simpler and doesn't require user interaction.

### What you need to do:

1. **Create service account** (follow Option 1 above)
2. **Download the JSON key** and save as `service-account.json`
3. **Share your Drive folder/Sheets** with the service account email
4. **Set environment variable:**
   ```bash
   echo "USE_SERVICE_ACCOUNT=true" >> .env
   ```
5. **Restart the server:**
   ```bash
   npm start
   ```

---

## Testing Without Google APIs

If you just want to test the GPS extraction features (which don't need Google APIs):

```bash
# Test GPS extraction
curl -X POST http://localhost:3000/upload/extractGPS/single \
  -F "image=@photo-with-gps.jpg"

# Test local GPS CSV reading
curl http://localhost:3000/decorate/getGpsFromAllImages
```

The Google Drive/Sheets endpoints will return authentication errors until you set up new credentials, but the GPS extraction features work independently.

---

## Error Reference

| Error | Cause | Solution |
|-------|-------|----------|
| `Error 400: invalid_request` | Old/invalid OAuth credentials | Create new OAuth client (Option 2) |
| `Error 401/403: Authentication failed` | Expired tokens | Refresh tokens or use service account |
| `Token file not found` | Missing token files | Run `refresh-tokens.js` or use service account |
| `No files found` | Service account not granted access | Share Drive/Sheets with service account email |

---

## Need Help?

1. **For Service Account**: Follow Option 1, it's simpler
2. **For OAuth**: Follow Option 2, but requires more setup
3. **To skip Google APIs**: Just use the GPS extraction features

Let me know which option you prefer, and I can provide more specific help!
