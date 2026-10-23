// Publish the reviewed mobile application, never the isolated demo.
const fs = require('node:fs');
const {execFileSync} = require('node:child_process');
fs.mkdirSync('public', {recursive:true});
execFileSync('python', ['scripts/prepare-mobile-preview.py'], {stdio:'inherit'});
execFileSync(process.execPath, ['scripts/document-festivities.cjs'], {stdio:'inherit'});
const files = ['index.html','mobile.css','mobile.js','holidays.js','festivals.js',
  'manifest.webmanifest','sw.js','offline.html','app-icon-192.png','app-icon-512.png',
  'app-icon-maskable.png','logo-gras-app.webp','logo-las-vegas.png'];
for (const file of files) fs.copyFileSync('mobile-preview/v2/'+file, 'public/'+file);
fs.copyFileSync('src/static/404.html','public/404.html');
// Research stays in the repository; the published calendar shows names only.
fs.rmSync('public/FUENTES-FESTIVIDADES.md', {force:true});
execFileSync(process.execPath, ['scripts/prepare-hosting.cjs'], {stdio:'inherit'});
console.log('Production prepared: mobile V2 with Peru and Ayacucho calendar. Historical V1 preserved.');
