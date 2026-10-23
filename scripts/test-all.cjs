const {spawn,spawnSync}=require('node:child_process');
(async()=>{
  const server=spawn(process.execPath,['scripts/serve-mobile-preview.cjs'],{env:{...process.env,VEGAS_PREVIEW_PORT:'0'},stdio:['ignore','pipe','pipe']});
  const cleanup=()=>server.kill();process.once('exit',cleanup);
  try {
    const url=await new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>reject(Error('Preview did not start')),10000);
      server.stdout.on('data',data=>{const match=data.toString().match(/http:\/\/localhost:\d+\//);if(match){clearTimeout(timer);resolve(match[0]);}});
      server.once('error',reject);server.once('exit',code=>{clearTimeout(timer);reject(Error('Preview exited: '+code));});
    });
    for(const args of [
      ['--test','tests/reservations.test.cjs','tests/festivities.test.cjs','tests/security.test.cjs'],
      ['tests/ui.cjs'],['tests/mobile-preview.cjs'],['scripts/check-secrets.cjs']
    ]){
      const result=spawnSync(process.execPath,args,{stdio:'inherit',env:{...process.env,VEGAS_PREVIEW_URL:url}});
      if(result.status!==0)throw Error('Failed: node '+args.join(' '));
    }
  } finally {cleanup();}
})().catch(error=>{console.error(error.message);process.exitCode=1;});
