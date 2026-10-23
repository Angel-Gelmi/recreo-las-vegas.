const fs=require('node:fs'),crypto=require('node:crypto');
const html=fs.readFileSync('public/index.html','utf8');
const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]).filter(s=>s.trim());
const hashes=scripts.map(s=>"'sha256-"+crypto.createHash('sha256').update(s).digest('base64')+"'");
const policy=["default-src 'self'","script-src 'self' "+hashes.join(' ')+' https://www.gstatic.com',"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com","font-src 'self' https://fonts.gstatic.com","img-src 'self' data:","connect-src 'self' https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firestore.googleapis.com https://firebaseinstallations.googleapis.com","frame-src https://recreolasvegas.firebaseapp.com","base-uri 'none'","object-src 'none'","form-action 'self'","frame-ancestors 'none'"].join('; ');
const config=JSON.parse(fs.readFileSync('firebase.json','utf8'));
config.hosting.headers=[
 {source:'**',headers:[{key:'X-Content-Type-Options',value:'nosniff'},{key:'X-Frame-Options',value:'DENY'},{key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},{key:'Permissions-Policy',value:'camera=(), microphone=(), geolocation=()'},{key:'Content-Security-Policy',value:policy}]},
 {source:'**/*.html',headers:[{key:'Cache-Control',value:'no-cache, max-age=0, must-revalidate'}]},
 {source:'/',headers:[{key:'Cache-Control',value:'no-cache, max-age=0, must-revalidate'}]}
];
fs.writeFileSync('firebase.json',JSON.stringify(config,null,2)+'\n');
console.log('Hosting security headers prepared; inline script hashes match public/index.html. No deployment.');
