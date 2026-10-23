// Verify deployed bytes, security headers and active rules without document writes.
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const assert = require('node:assert/strict');
(async () => {
  const origin = 'https://recreolasvegas.web.app';
  const config = JSON.parse(fs.readFileSync('firebase.json', 'utf8'));
  for (const file of ['index.html', 'logo-gras-app.webp', 'mobile.css', 'mobile.js', 'holidays.js', 'festivals.js', 'manifest.webmanifest', 'sw.js', 'offline.html', 'app-icon-192.png', 'app-icon-512.png', 'app-icon-maskable.png', 'FUENTES-FESTIVIDADES.md']) {
    const response = await fetch(origin + '/' + file, { signal: AbortSignal.timeout(30000) });
    assert.equal(response.status, 200, file);
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), fs.readFileSync('public/' + file), file + ' deployed bytes');
    for (const header of config.hosting.headers[0].headers) {
      assert.equal(response.headers.get(header.key), header.value, header.key);
    }
  }
  const missing = await fetch(origin + '/deployment-check-missing-page', { signal: AbortSignal.timeout(30000) });
  assert.equal(missing.status, 404);
  const credentials = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.config/configstore/firebase-tools.json'), 'utf8'));
  async function read(url) {
    const response = await fetch(url, {
      headers: { Authorization: 'Bearer ' + credentials.tokens.access_token },
      signal: AbortSignal.timeout(30000)
    });
    assert.equal(response.status, 200, 'Rules API response');
    return response.json();
  }
  const release = await read('https://firebaserules.googleapis.com/v1/projects/recreolasvegas/releases/cloud.firestore');
  const rules = await read('https://firebaserules.googleapis.com/v1/' + release.rulesetName);
  assert.equal(rules.source.files.find(file => file.name === 'firestore.rules').content, fs.readFileSync('firestore.rules', 'utf8'));
  console.log('PASS deployed mobile HTML, calendar, styles, scripts, PWA assets and sources match local bytes; security headers; HTTP 404; active Firestore rules match local source. No document writes.');
})().catch(error => { console.error(error.message); process.exitCode = 1; });
