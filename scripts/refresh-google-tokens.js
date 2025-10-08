#!/usr/bin/env node
/**
 * Token Refresh Utility
 * Use this script to regenerate Google API tokens
 * Supports both 'installed' and 'web' OAuth credential formats
 */

import fs from 'fs/promises';
import readline from 'readline';
import { google } from 'googleapis';

const DRIVE_SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];
const SHEET_SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans);
  }));
}

/**
 * Parse OAuth credentials (supports both 'installed' and 'web' formats)
 */
function parseOAuthCredentials(credentials) {
  if (credentials.installed) {
    return credentials.installed;
  } else if (credentials.web) {
    return credentials.web;
  } else if (credentials.client_id && credentials.client_secret) {
    return credentials;
  }
  throw new Error('Invalid OAuth credentials format');
}

async function refreshToken(credentialsFile, tokenFile, scopes, apiName) {
  console.log(`\n========== Google ${apiName} Token Refresh ==========\n`);

  try {
    const content = await fs.readFile(credentialsFile, 'utf-8');

    const credentials = JSON.parse(content);
    const oauthCreds = parseOAuthCredentials(credentials);
    const { client_secret, client_id, redirect_uris } = oauthCreds;

    // Use first redirect URI or default
    const redirectUri = redirect_uris ? redirect_uris[0] : 'urn:ietf:wg:oauth:2.0:oob';

    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirectUri
    );

    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
    });

    console.log('1. Visit this URL to authorize the application:');
    console.log('\n' + authUrl + '\n');
    const code = await askQuestion('2. Enter the authorization code: ');

    const { tokens } = await oAuth2Client.getToken(code);
    await fs.writeFile(tokenFile, JSON.stringify(tokens, null, 2));

    console.log(`✓ ${apiName} token saved to ${tokenFile}`);
    return true;
  } catch (error) {
    console.error(`✗ Error refreshing ${apiName} token:`, error.message);
    return false;
  }
}

async function main() {
  console.log('=================================================');
  console.log('   Google API Token Refresh Utility');
  console.log('=================================================');

  const CREDS_FILE = 'config/google/credentials.json';
  const TOKEN_FILE = 'config/google/tokens.json';

  console.log('\nThis script will generate OAuth tokens for Google APIs');
  console.log(`Credentials: ${CREDS_FILE}`);
  console.log(`Tokens will be saved to: ${TOKEN_FILE}\n`);

  const proceed = await askQuestion('Continue? (y/n): ');
  if (proceed.toLowerCase() !== 'y') {
    console.log('Aborted.');
    return;
  }

  // Use same credentials for both Drive and Sheets
  const scopes = [...DRIVE_SCOPES, ...SHEET_SCOPES];
  await refreshToken(CREDS_FILE, TOKEN_FILE, scopes, 'Drive & Sheets');

  console.log('\n=================================================');
  console.log('✅ Done! You can now restart your server.');
  console.log('=================================================\n');
}

main();
