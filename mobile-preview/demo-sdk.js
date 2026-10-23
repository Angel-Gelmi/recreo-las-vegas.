/* This file is loaded ONLY by demo.html. No Firebase requests and no real credentials. */
window.__PREVIEW__=true;
(() => {
  const accounts={wilmer:'Wilmer',chino:'Chino',jhoan:'Jhoan',trabajador:'LASVEGAS'};
  const user=key=>({uid:'preview-'+key,email:key+'@recreolasvegas.web.app',displayName:accounts[key],isAnonymous:false});
  const auth={currentUser:user('wilmer'),authStateReady:async()=>{}},listeners=new Map();let authChange;
  const booking=(owner,event,advance,status='Confirmado')=>({registeredBy:owner,event,advance,status,notes:'Reserva de ejemplo para comparar las versiones.',updatedAt:'preview-1'});
  const db={
    gras:{'2027-01-01':booking('Chino','Reserva de Chino',0),'2027-11-01':booking('Chino','Almuerzo de Todos los Santos',250),'2027-11-06':booking('Wilmer','Campeonato de fulbito',150),'2027-11-13':booking('Jhoan','Encuentro familiar',100,'Pendiente'),'2027-12-24':booking('Wilmer','Reunión de Nochebuena',200)},
    recreo:{'2027-01-01':booking('Chino','Reserva de Chino',0),'2027-11-01':booking('Jhoan','Reunión de familia',300),'2027-11-20':booking('Wilmer','Cumpleaños',200),'2027-12-25':booking('Chino','Almuerzo de Navidad',400)}
  };
  const venue=path=>path.includes('reservations_recreo')?'recreo':'gras';
  const notify=v=>{for(const [path,cb]of listeners)if(venue(path)===v)cb({metadata:{fromCache:false},forEach:f=>Object.entries(db[v]).forEach(([id,data])=>f({id,data:()=>({...data})}))});};
  window.previewAccount=key=>{auth.currentUser=user(key);authChange?.(auth.currentUser);};
  const sdk={getAuth:()=>auth,getIdTokenResult:async u=>({claims:{reservasRole:u.email.startsWith('trabajador@')?'viewer':'admin'}}),onAuthStateChanged:(a,cb)=>{authChange=cb;cb(a.currentUser);},signOut:async()=>{auth.currentUser=null;authChange?.(null);},signInWithEmailAndPassword:async(a,email)=>{auth.currentUser=user(email.split('@')[0]);authChange?.(auth.currentUser);}};
  const firestore={getFirestore:()=>({}),collection:(_, ...p)=>p.join('/'),doc:(_, ...p)=>({path:p.slice(0,-1).join('/'),id:p.at(-1)}),onSnapshot:(path,options,cb)=>{listeners.set(path,cb);notify(venue(path));return()=>listeners.delete(path);},runTransaction:async(_,fn)=>{
    if(!navigator.onLine)throw Error('Sin conexión');
    const ops=[];await fn({get:async ref=>({exists:()=>!!db[venue(ref.path)][ref.id],data:()=>({...db[venue(ref.path)][ref.id]})}),set:(ref,data)=>ops.push(()=>{db[venue(ref.path)][ref.id]={...data};notify(venue(ref.path));}),delete:ref=>ops.push(()=>{delete db[venue(ref.path)][ref.id];notify(venue(ref.path));})});ops.forEach(op=>op());
  }};
  window.__previewSDK=[{initializeApp:()=>({})},sdk,firestore];
})();
