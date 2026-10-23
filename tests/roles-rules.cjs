// Firebase Rules evaluation API: simulated requests, no document writes.
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
(async()=>{
 const config=JSON.parse(fs.readFileSync(path.join(os.homedir(),'.config/configstore/firebase-tools.json'),'utf8'));
 // Rules REST converts ISO-shaped strings to timestamps; use a plain string for this string-field test.
 const data={registeredBy:'Wilmer',status:'Confirmado',advance:10,event:'Rule test',notes:'',updatedAt:'test-version'};
 const base='/databases/(default)/documents/artifacts/calendario-2027-reservas-app-v2/public/data/';
 const cases=[];
 for(const role of ['admin','viewer','none',null])for(const venue of ['gras','recreo'])for(const method of ['get','list','create','update','delete']){
   const allowed=role==='admin'||(role==='viewer'&&['get','list'].includes(method));
   cases.push({expectation:allowed?'ALLOW':'DENY',request:{path:base+`reservations_${venue}_2027_v2/2027-01-08`,method,auth:role?{uid:'test',token:role==='none'?{}:{reservasRole:role,email:'wilmer@recreolasvegas.web.app'}}:null,resource:{data}},resource:{data}});
 }
 for(const method of ['create','update','delete'])cases.push({expectation:'DENY',request:{path:base+'reservations_gras_2027_v2/2027-01-01',method,auth:{uid:'test',token:{reservasRole:'admin',email:'wilmer@recreolasvegas.web.app'}},resource:{data}},resource:{data}});
 for(const name of ['chino','jhoan'])for(const method of ['create','update','delete'])cases.push({expectation:'DENY',request:{path:base+'reservations_gras_2027_v2/2027-01-08',method,auth:{uid:'other',token:{reservasRole:'admin',email:name+'@recreolasvegas.web.app'}},resource:{data}},resource:{data}});
 for(const [email,owner] of [['wilmer','Wilmer'],['chino','Chino'],['jhoan','Jhoan'],['jhoan','Juan']])for(const venue of ['gras','recreo'])for(const method of ['create','update','delete']) {
   const owned={...data,registeredBy:owner};
   cases.push({expectation:'ALLOW',request:{path:base+`reservations_${venue}_2027_v2/2027-01-08`,method,auth:{uid:email,token:{reservasRole:'admin',email:email+'@recreolasvegas.web.app'}},resource:{data:owned}},resource:{data:owned}});
 }
 cases.push({expectation:'DENY',request:{path:base+'reservations_gras_2027_v2/2027-01-08',method:'update',auth:{uid:'wilmer',token:{reservasRole:'admin',email:'wilmer@recreolasvegas.web.app'}},resource:{data:{...data,registeredBy:'Chino'}}},resource:{data}});
 for(const venue of ['gras','recreo'])for(const email of ['chino','wilmer','jhoan','trabajador'])for(const method of ['create','update','delete']){
 const owned={...data,registeredBy:'Chino'};cases.push({expectation:email==='chino'?'ALLOW':'DENY',request:{path:base+`reservations_${venue}_2027_v2/2027-01-01`,method,auth:{uid:email,token:{reservasRole:email==='trabajador'?'viewer':'admin',email:email+'@recreolasvegas.web.app'}},resource:{data:owned}},resource:{data:owned}});
 }
 const admin={uid:'wilmer',token:{reservasRole:'admin',email:'wilmer@recreolasvegas.web.app'}};
 for(const method of ['create','update'])for(const change of [{event:''},{event:'   '},{event:'a'.repeat(121)},{notes:'a'.repeat(2001)},{advance:-1},{advance:1000000000},{advance:'10'},{status:'Otro'},{unexpected:true},{updatedAt:''},{registeredBy:'Chino'}]){
 cases.push({expectation:'DENY',request:{path:base+'reservations_gras_2027_v2/2027-01-08',method,auth:admin,resource:{data:{...data,...change}}},resource:{data}});
 }
 for(const date of ['2027-02-29','2027-04-31','2027-13-01','2026-01-08'])cases.push({expectation:'DENY',request:{path:base+'reservations_gras_2027_v2/'+date,method:'create',auth:admin,resource:{data}},resource:{data}});
 for(const path of ['other/2027-01-08','reservations_unknown_2027_v2/2027-01-08'])for(const method of ['get','create','delete'])cases.push({expectation:'DENY',request:{path:base+path,method,auth:admin,resource:{data}},resource:{data}});
 const r=await fetch('https://firebaserules.googleapis.com/v1/projects/recreolasvegas:test',{method:'POST',headers:{Authorization:'Bearer '+config.tokens.access_token,'Content-Type':'application/json'},body:JSON.stringify({source:{files:[{name:'firestore.rules',content:fs.readFileSync('firestore.rules','utf8')}]},testSuite:{testCases:cases}})});
 const result=await r.json();if(!r.ok)throw Error(JSON.stringify(result));
 const failures=(result.testResults||[]).map((t,i)=>({...t,request:cases[i].request})).filter(t=>t.state!=='SUCCESS');
 console.log(JSON.stringify({count:result.testResults?.length,failures,issues:result.issues}));
 if(failures.length||result.testResults?.length!==cases.length)process.exitCode=1;
})().catch(e=>{console.error(e.message);process.exitCode=1;});
