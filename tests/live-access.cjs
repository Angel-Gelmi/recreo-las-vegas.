const fs=require('node:fs');
(async()=>{
const specs=JSON.parse(fs.readFileSync(0,'utf8'));
for(const spec of specs){
 const r=await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBuQ6firSO0K6iiXvJJM3KN-6rKY6V3piw',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...spec,returnSecureToken:true})});
 const auth=await r.json();if(!r.ok)throw Error(auth.error?.message);
 const claims=JSON.parse(Buffer.from(auth.idToken.split('.')[1],'base64url').toString());
 for(const venue of ['gras','recreo']) {
 const url='https://firestore.googleapis.com/v1/projects/recreolasvegas/databases/(default)/documents/artifacts/calendario-2027-reservas-app-v2/public/data:runQuery';
 const response=await fetch(url,{method:'POST',headers:{Authorization:'Bearer '+auth.idToken,'Content-Type':'application/json'},body:JSON.stringify({structuredQuery:{from:[{collectionId:`reservations_${venue}_2027_v2`}],limit:1}})});
 const result=await response.json();console.log(JSON.stringify({user:spec.email,role:claims.reservasRole,venue,status:response.status,error:result.error?.message}));
 if(!response.ok)process.exitCode=1;
 }
}
})().catch(e=>{console.error(e.message);process.exitCode=1;});
