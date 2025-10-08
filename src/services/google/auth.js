import fs from 'fs/promises';
import { google } from 'googleapis';

/**
 * Authentication helper for Google APIs
 * Supports both OAuth2 and Service Account authentication
 */

const USE_SERVICE_ACCOUNT = process.env.USE_SERVICE_ACCOUNT === 'true';
const SERVICE_ACCOUNT_PATH = process.env.SERVICE_ACCOUNT_PATH || 'service-account.json';

/**
 * Create authenticated client for Drive API
 * @returns {Promise<OAuth2Client|JWT>}
 */
export async function getDriveAuth() {
  if (USE_SERVICE_ACCOUNT) {
    return await getServiceAccountAuth([
      'https://www.googleapis.com/auth/drive.metadata.readonly'
    ]);
  } else {
    return await getOAuth2Auth(
      'config/google/credentials.json',
      'config/google/tokens.json'
    );
  }
}

/**
 * Create authenticated client for Sheets API
 * @returns {Promise<OAuth2Client|JWT>}
 */
export async function getSheetsAuth() {
  if (USE_SERVICE_ACCOUNT) {
    return await getServiceAccountAuth([
      'https://www.googleapis.com/auth/spreadsheets.readonly'
    ]);
  } else {
    return await getOAuth2Auth(
      'config/google/credentials.json',
      'config/google/tokens.json'
    );
  }
}

/**
 * Service Account Authentication
 */
async function getServiceAccountAuth(scopes) {
  try {
    const content = await fs.readFile(SERVICE_ACCOUNT_PATH, 'utf-8');
    const credentials = JSON.parse(content);

    const auth = new google.auth.JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: scopes,
    });

    return auth;
  } catch (err) {
    throw new Error(
      `Service account authentication failed. ` +
      `Make sure ${SERVICE_ACCOUNT_PATH} exists. ` +
      `Error: ${err.message}`
    );
  }
}

/**
 * Parse OAuth credentials (supports both 'installed' and 'web' formats)
 */
function parseOAuthCredentials(credentials) {
  // Try 'installed' format first (desktop app)
  if (credentials.installed) {
    return credentials.installed;
  }
  // Try 'web' format (web app)
  else if (credentials.web) {
    return credentials.web;
  }
  // Direct format (already extracted)
  else if (credentials.client_id && credentials.client_secret) {
    return credentials;
  }

  throw new Error('Invalid OAuth credentials format');
}

/**
 * OAuth2 Authentication
 */
async function getOAuth2Auth(credentialsPath, tokenPath) {
  try {
    const content = await fs.readFile(credentialsPath, 'utf-8');
    const credentials = JSON.parse(content);
    const oauthCreds = parseOAuthCredentials(credentials);

    const { client_secret, client_id, redirect_uris } = oauthCreds;

    // For web apps, use the first redirect URI or localhost
    const redirectUri = redirect_uris
      ? redirect_uris[0]
      : 'http://localhost:3000';

    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirectUri
    );

    try {
      const token = await fs.readFile(tokenPath, 'utf-8');
      const tokenData = JSON.parse(token);
      oAuth2Client.setCredentials(tokenData);

      // Set up token refresh handler
      oAuth2Client.on('tokens', async (tokens) => {
        try {
          if (tokens.refresh_token) {
            tokenData.refresh_token = tokens.refresh_token;
          }
          if (tokens.access_token) {
            tokenData.access_token = tokens.access_token;
          }
          if (tokens.expiry_date) {
            tokenData.expiry_date = tokens.expiry_date;
          }
          await fs.writeFile(tokenPath, JSON.stringify(tokenData, null, 2));
          console.log(`✓ Token refreshed: ${tokenPath}`);
        } catch (err) {
          console.error('Error saving refreshed token:', err);
        }
      });

      return oAuth2Client;
    } catch (err) {
      throw new Error(
        `Token file not found: ${tokenPath}. ` +
        `Run 'node refresh-tokens.js' to generate new tokens.`
      );
    }
  } catch (err) {
    throw new Error(`OAuth2 authentication failed: ${err.message}`);
  }
}

/**
 * Get authentication method info
 */
export function getAuthInfo() {
  return {
    method: USE_SERVICE_ACCOUNT ? 'Service Account' : 'OAuth2',
    serviceAccountPath: SERVICE_ACCOUNT_PATH,
    useServiceAccount: USE_SERVICE_ACCOUNT
  };
}
