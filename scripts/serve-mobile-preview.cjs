const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const root=path.resolve(__dirname,'../mobile-preview'),lan=process.argv.includes('--lan');
const port=Number(process.env.VEGAS_PREVIEW_PORT||4173);
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.webmanifest':'application/manifest+json','.md':'text/plain; charset=utf-8','.txt':'text/plain; charset=utf-8'};
const server=http.createServer((req,res)=>{
  let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400).end();return;}
  const resolved=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
  if(!resolved.startsWith(root+path.sep)||!fs.existsSync(resolved)||!fs.statSync(resolved).isFile()){res.writeHead(404).end('No encontrado');return;}
  // This server is for the isolated preview, never a gateway to real Firebase credentials/data.
  if(/[/\\]v[12][/\\]index\.html[. ]*$/i.test(resolved)){res.writeHead(403).end('Usa demo.html para la vista previa sin datos reales.');return;}
  res.writeHead(200,{'Content-Type':mime[path.extname(resolved)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});fs.createReadStream(resolved).pipe(res);
});
server.listen(port,lan?'0.0.0.0':'127.0.0.1',()=>{
  const actualPort=server.address().port;
  console.log('Vista previa V1 / V2: http://localhost:'+actualPort+'/');
  if(lan)for(const adapters of Object.values(os.networkInterfaces()))for(const address of adapters||[])if(address.family==='IPv4'&&!address.internal)console.log('Celular, misma Wi-Fi: http://'+address.address+':'+actualPort+'/');
});
