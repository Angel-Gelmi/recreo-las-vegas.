const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
(async()=>{
 const config=JSON.parse(fs.readFileSync(path.join(os.homedir(),'.config/configstore/firebase-tools.json'),'utf8'));
 const headers={Authorization:'Bearer '+config.tokens.access_token,'Content-Type':'application/json'};
 async function get(url,body){const r=await fetch(url,{headers,method:body?'POST':'GET',...(body?{body:JSON.stringify(body)}:{})});if(!r.ok)throw Error(`${r.status} ${url}`);return r.json();}
 const project='recreolasvegas';
 const auth=await get(`https://identitytoolkit.googleapis.com/admin/v2/projects/${project}/config`);
 console.log(JSON.stringify({passwordEnabled:auth.signIn?.email?.enabled,authorizedDomains:auth.authorizedDomains}));
 const users=await get(`https://identitytoolkit.googleapis.com/v1/projects/${project}/accounts:lookup`,{email:['lasvegas@gmail.com']});
 console.log(JSON.stringify({loginAccountExists:!!users.users?.length,disabled:users.users?.[0]?.disabled||false}));
 const release=await get(`https://firebaserules.googleapis.com/v1/projects/${project}/releases/cloud.firestore`);
 const rules=await get(`https://firebaserules.googleapis.com/v1/${release.rulesetName}`);
 const ruleText=rules.source.files.map(f=>f.content).join('\n');
 console.log(JSON.stringify({loginUidListedInRules:!!users.users?.[0] && ruleText.includes('"'+users.users[0].localId+'"')}));
 for(const file of rules.source.files) console.log('RULES '+file.content);
 for(const file of ['','logo-las-vegas.png','logo-gras-blanco.png']) {const r=await fetch('https://recreolasvegas.web.app/'+file);console.log('HTTP '+file+' '+r.status);}
})().catch(e=>{console.error(e.message);process.exitCode=1;});
