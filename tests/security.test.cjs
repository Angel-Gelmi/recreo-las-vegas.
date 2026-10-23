const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto');
const html=fs.readFileSync('index.html','utf8');
const from=html.indexOf('    function validDateKey('),to=html.indexOf('    try { const saved=',from);
const ctx=vm.createContext({});vm.runInContext(html.slice(from,to),ctx);
const booking=()=>({registeredBy:'Wilmer',status:'Confirmado',advance:10,event:'Reserva',notes:'',updatedAt:'2026-10-23T00:00:00.000Z'});
test('form validation rejects invalid calendar dates and oversized or malformed fields',()=>{
  for(const date of ['2027-02-29','2027-04-31','2027-13-01','2026-01-01','garbage'])assert.throws(()=>ctx.validateReservation(date,booking()));
  for(const change of [{event:' '},{event:'a'.repeat(121)},{advance:NaN},{advance:Infinity},{advance:-1},{advance:1000000000},{notes:'a'.repeat(2001)},{status:'inventado'},{registeredBy:'Administrador'}])assert.throws(()=>ctx.validateReservation('2027-02-28',{...booking(),...change}));
  assert.doesNotThrow(()=>ctx.validateReservation('2027-02-28',booking()));
});
test('HTML uses safe text rendering and contains no obsolete browser authorization workflow',()=>{
  assert.doesNotMatch(html,/\.innerHTML\s*=|document\.write\(|\beval\(/);
  assert.doesNotMatch(html,/REPLACE_WITH_DEVICE_UID|id="prepare-access"|id="rules-template"/);
  assert.match(html,/title\.textContent=r\.event/);
});
test('hosting CSP permits exactly the current inline scripts and rejects arbitrary inline code',()=>{
  const config=JSON.parse(fs.readFileSync('firebase.json','utf8'));
  const headers=config.hosting.headers.find(h=>h.source==='**').headers;
  const csp=headers.find(h=>h.key==='Content-Security-Policy').value;
  assert.match(csp,/frame-ancestors 'none'/);assert.match(csp,/object-src 'none'/);
  assert.doesNotMatch(csp.split(';').find(s=>s.trim().startsWith('script-src')),/unsafe-inline|unsafe-eval/);
  for(const match of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))if(match[1].trim())assert.ok(csp.includes("'sha256-"+crypto.createHash('sha256').update(match[1]).digest('base64')+"'"));
  assert.equal(headers.find(h=>h.key==='X-Content-Type-Options').value,'nosniff');
});
test('PWA intercepts only requests within its own scope and does not cache Firebase',()=>{
  const sw=fs.readFileSync('mobile-preview/v2/sw.js','utf8');
  assert.match(sw,/self\.registration\.scope/);assert.doesNotMatch(sw,/firebase|password|idToken/);
});

test('transaction rejects an account change while reading the reservation',async()=>{
  const begin=html.indexOf('const existing=await transaction.get(ref);');
  const body=html.slice(begin,html.indexOf('\n              });',begin));
  const sandbox={auth:{currentUser:{uid:'other'}},expectedUid:'original',expectedGeneration:0,sessionGeneration:1,ref:{},transaction:{get:async()=>({exists:()=>false}),set:()=>assert.fail('Unsafe write'),delete:()=>assert.fail('Unsafe delete')}};
  await assert.rejects(vm.runInNewContext('(async()=>{'+body+'})()',sandbox),/sesión cambió/);
});

test('preview service worker does not intercept another same-origin application',()=>{
  const handlers={};let intercepted=false;
  vm.runInNewContext(fs.readFileSync('mobile-preview/v2/sw.js','utf8'),{URL,self:{registration:{scope:'https://example.com/v2/'},location:{origin:'https://example.com'},addEventListener:(name,handler)=>handlers[name]=handler}});
  for(const url of ['https://example.com/v1/index.html','https://firestore.googleapis.com/','https://example.com/v2evil/index.html']){
    handlers.fetch({request:{url,method:'GET',mode:'navigate'},respondWith:()=>{intercepted=true;}});
    assert.equal(intercepted,false);
  }
});
