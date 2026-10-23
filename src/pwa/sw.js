/* Solo archivos de interfaz. Nunca almacena respuestas de Firebase ni contraseñas. */
const CACHE='vegas-mobile-v2-shell-3';
const ASSETS=['./offline.html','./mobile.css','./mobile.js','./holidays.js','./festivals.js','./app-icon-192.png','./app-icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('vegas-mobile-v2-shell-')&&k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  const scope=new URL(self.registration.scope);
  if(url.origin!==self.location.origin||!url.pathname.startsWith(scope.pathname)||event.request.method!=='GET')return;
  if(event.request.mode==='navigate')event.respondWith(fetch(event.request).catch(()=>caches.match('./offline.html')));
  else if(ASSETS.some(asset=>new URL(asset,self.registration.scope).pathname===url.pathname))event.respondWith(fetch(event.request).catch(()=>caches.match(event.request)));
});
