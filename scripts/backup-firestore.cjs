// Read-only export of the two reservation collections. Output stays in ignored backups/.
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
(async()=>{
  const config=JSON.parse(fs.readFileSync(path.join(os.homedir(),'.config/configstore/firebase-tools.json'),'utf8'));
  const headers={Authorization:'Bearer '+config.tokens.access_token};
  const collections={};
  for(const venue of ['gras','recreo']){
    const documents=[];let next='';
    do {
      const url=new URL('https://firestore.googleapis.com/v1/projects/recreolasvegas/databases/(default)/documents/artifacts/calendario-2027-reservas-app-v2/public/data/reservations_'+venue+'_2027_v2');
      url.searchParams.set('pageSize','300');if(next)url.searchParams.set('pageToken',next);
      const response=await fetch(url,{headers,signal:AbortSignal.timeout(20000)});
      if(!response.ok)throw Error('Backup failed: HTTP '+response.status+' ('+venue+'). Refresh Firebase CLI authentication if needed.');
      const result=await response.json();documents.push(...result.documents||[]);next=result.nextPageToken||'';
    }while(next);
    collections[venue]=documents;
  }
  const directory=path.resolve('backups');fs.mkdirSync(directory,{recursive:true});
  const filename=path.join(directory,'reservations-'+new Date().toISOString().replace(/[:.]/g,'-')+'.json');
  fs.writeFileSync(filename,JSON.stringify({project:'recreolasvegas',exportedAt:new Date().toISOString(),collections},null,2)+'\n',{mode:0o600,flag:'wx'});
  const verified=JSON.parse(fs.readFileSync(filename,'utf8'));
  console.log(JSON.stringify({backup:filename,verified:true,documents:Object.fromEntries(Object.entries(verified.collections).map(([v,docs])=>[v,docs.length])),cloudWrites:0}));
})().catch(error=>{console.error(error.message);process.exitCode=1;});
