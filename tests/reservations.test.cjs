const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const html = fs.readFileSync('index.html', 'utf8');
function section(start,end) { return html.slice(html.indexOf(start),html.indexOf(end,html.indexOf(start))); }
function context(extra='') {
 const ctx=vm.createContext({localStorage:{setItem(){}}, console});
 vm.runInContext(`const special='2027-01-01'; const defaultReservation=()=>({event:'Protegida',advance:0});
 ${section('function validStore(', '    try { const saved=')}
 let editVenue='gras', stores={gras:{},recreo:{}},cloud=null,cloudReady={gras:false,recreo:false};
 function persist(x){localStorage.setItem('test',JSON.stringify(x));} function render(){} function toast(){}
 ${section('async function commit(', "    $('reservation-form').addEventListener")}
 ${extra}`,ctx);
 return ctx;
}
for(const input of ['null','[]','42','"invalid"','{}']) test('normalization tolerates '+input,()=>{
 const ctx=context(); assert.equal(vm.runInContext(`Object.keys(normalizeStore(${input})).length`,ctx),1);
});
for(const date of ['2026-01-02','2027-02-29','2027-04-31','2027-13-01','garbage']) test('reject invalid stored date '+date,()=>{
 assert.equal(vm.runInContext(`Object.keys(normalizeStore({'${date}':{event:'test'}})).length`,context()),1);
});
test('normalization preserves valid booking and protected day',()=>{
 assert.equal(vm.runInContext(`Object.keys(normalizeStore({'2027-02-28':{event:'test'}})).length`,context()),2);
});
test('negative advance normalized to zero',()=>assert.equal(vm.runInContext(`normalizeStore({'2027-02-28':{advance:-5}})['2027-02-28'].advance`,context()),0));
test('invalid advance normalized to zero',()=>assert.equal(vm.runInContext(`normalizeStore({'2027-02-28':{advance:'bad'}})['2027-02-28'].advance`,context()),0));
test('protected date rejects writes',async()=>await assert.rejects(vm.runInContext(`commit('2027-01-01',{})`,context()),/protegido/));
test('cloud not ready rejects writes',async()=>await assert.rejects(vm.runInContext(`commit('2027-01-02',{})`,context('cloud={write:async()=>{}};')),/Espera/));
test('failed server write does not update local store',async()=>{
 const ctx=context("cloud={write:async()=>{throw Error('permission-denied')}};cloudReady.gras=true;");
 await assert.rejects(vm.runInContext(`commit('2027-01-02',{})`,ctx),/permission-denied/);
 assert.equal(vm.runInContext('Object.keys(stores.gras).length',ctx),0);
});
test('cloud write preserves venue separation',async()=>{
 const ctx=context('cloud={write:async()=>{}};cloudReady.gras=true;');
 await vm.runInContext(`commit('2027-01-02',{event:'Test'})`,ctx);
 assert.equal(vm.runInContext('Object.keys(stores.gras).length',ctx),1);
 assert.equal(vm.runInContext('Object.keys(stores.recreo).length',ctx),0);
});
test('cloud delete removes only selected reservation',async()=>{
 const ctx=context("cloud={write:async()=>{}};cloudReady.gras=true;stores.gras={'2027-01-02':{},'2027-01-03':{}};");
 await vm.runInContext(`commit('2027-01-02',null)`,ctx);
 assert.equal(vm.runInContext('Object.keys(stores.gras).join()',ctx),'2027-01-03');
});
test('published copy matches source',()=>assert.equal(fs.readFileSync('public/index.html','utf8'),html));
test('referenced current logos exist',()=>{
 for(const file of ['logo-gras-blanco.png','logo-las-vegas.png']) assert.ok(fs.existsSync('public/'+file));
});
test('REGRESSION: calendar creation must reject concurrent reservation',()=>{
 // Execute the exact production transaction callback with a competing document.
 const start=html.indexOf('const existing=await transaction.get(ref);');
 const body=html.slice(start,html.indexOf('\n              });',start));
 const ctx=vm.createContext({});
 const openSetup=section('      editVenue=venue;', "      $('reservation-form').reset()");
 return vm.runInContext(`(async()=>{let overwritten=false; const ref={},data={event:'New'},key='2027-01-08',venue='gras',stores={gras:{}},special='2027-01-01'; let editVenue,editKey,editVersion;
 ${openSetup}
 const transaction={get:async()=>({exists:()=>true}),set:()=>{overwritten=true},delete:()=>{}};
 try { ${body} } catch {} return overwritten;})()`,ctx).then(overwritten=>assert.equal(overwritten,false,'Existing booking overwritten when empty calendar date was opened'));
});
test('login submit starts disabled and is intercepted before SDK download',()=>{
 assert.match(html, /id="login-submit" disabled/);
 assert.ok(html.indexOf("$('login-form').addEventListener('submit',e=>e.preventDefault())")<html.indexOf('async function initializeCloud'));
});
test('unauthenticated writes fail',async()=>await assert.rejects(vm.runInContext(`commit('2027-01-02',{})`,context()),/Inicia sesión/));
for(const scenario of ['changed','deleted']) test('reject stale '+scenario+' booking',async()=>{
 const start=html.indexOf('const existing=await transaction.get(ref);');
 const body=html.slice(start,html.indexOf('\n              });',start));
 const code=`(async()=>{const ref={},data={event:'New'},editKey='2027-01-08',editVersion='old';
 const reservationVersion=()=> 'new'; const transaction={get:async()=>({exists:()=>${scenario!=='deleted'},data:()=>({})}),set:()=>{throw Error('UNSAFE WRITE')},delete:()=>{throw Error('UNSAFE DELETE')}};
 ${body} })()`;
 await assert.rejects(vm.runInNewContext(code),/cambió en otro dispositivo/);
});
