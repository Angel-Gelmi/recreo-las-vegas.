// Receives account specifications through stdin; never store passwords in source.
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const runtimeRequire=require('node:module').createRequire(path.resolve('.test-runtime/package.json'));
const {initializeApp}=runtimeRequire('firebase-admin/app');
const {getAuth}=runtimeRequire('firebase-admin/auth');
(async()=>{
 const specs=JSON.parse(fs.readFileSync(0,'utf8'));
 const config=JSON.parse(fs.readFileSync(path.join(os.homedir(),'.config/configstore/firebase-tools.json'),'utf8'));
 initializeApp({projectId:'recreolasvegas',credential:{getAccessToken:async()=>({access_token:config.tokens.access_token,expires_in:3600})}});
 const auth=getAuth();
 for(const spec of specs){
   let user;
   try {user=await auth.getUserByEmail(spec.email);}catch(e){if(e.code!=='auth/user-not-found')throw e;}
   if(user)throw Error('Account already exists; inspect before changing: '+spec.email);
   user=await auth.createUser({email:spec.email,password:spec.password,displayName:spec.name,disabled:false});
   await auth.setCustomUserClaims(user.uid,{reservasRole:spec.role});
   const r=await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBuQ6firSO0K6iiXvJJM3KN-6rKY6V3piw',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:spec.email,password:spec.password,returnSecureToken:true})});
   const result=await r.json();if(!r.ok)throw Error('Sign in failed for '+spec.name+': '+result.error?.message);
   const claims=JSON.parse(Buffer.from(result.idToken.split('.')[1],'base64url').toString());
   if(claims.reservasRole!==spec.role)throw Error('Role verification failed');
   console.log(JSON.stringify({name:spec.name,role:spec.role,loginVerified:true}));
 }
})().catch(e=>{console.error(e.message);process.exitCode=1;});
