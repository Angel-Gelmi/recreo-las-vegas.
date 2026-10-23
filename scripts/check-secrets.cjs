// Reports only filenames and secret classes, never matching values.
const fs=require('node:fs'),cp=require('node:child_process');
const files=cp.execFileSync('git',['ls-files','--cached','--others','--exclude-standard','-z'],{encoding:'utf8'}).split('\0').filter(Boolean);
const patterns=[['private key',/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],['GitHub token',/\bgh[pousr]_[A-Za-z0-9]{30,}\b/],['AWS access key',/\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/],['Google private credential',/"type"\s*:\s*"service_account"/]];
let checked=0,failures=[];
for(const file of [...new Set(files)]){
  if(!fs.existsSync(file)||!fs.statSync(file).isFile()||!(/\.(?:html|js|cjs|mjs|json|md|yml|yaml|py|txt|webmanifest)$/.test(file)||/(?:^|\/)\.env/.test(file)))continue;
  const data=fs.readFileSync(file,'utf8');checked++;
  for(const [type,pattern]of patterns)if(pattern.test(data))failures.push({file,type});
}
if(failures.length){console.error(JSON.stringify({failures}));process.exitCode=1;}else console.log('PASS secret-pattern scan: '+checked+' source files; no private keys or access tokens detected. Firebase browser config is public by design.');
