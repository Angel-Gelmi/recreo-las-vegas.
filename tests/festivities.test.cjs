const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const context=vm.createContext({window:{},Date});
for(const file of ['holidays.js','festivals.js'])vm.runInContext(fs.readFileSync('mobile-preview/v2/'+file,'utf8'),context);
const {VEGAS_HOLIDAYS:days,VEGAS_CALENDAR_SOURCES:sources,VEGAS_FESTIVAL_SEASONS:seasons,VEGAS_CALENDAR_META:meta}=context.window;
const has=(date,text)=>(days[date]||[]).some(item=>item.name.includes(text));
test('all 16 national holidays remain intact and distinct from celebrations',()=>{
  const national=Object.entries(days).flatMap(([date,items])=>items.filter(i=>i.category==='feriado').map(i=>date));
  assert.equal(national.length,16);assert.equal(new Set(national).size,16);
  for(const date of ['2027-06-07','2027-07-23','2027-08-06','2027-12-09'])assert.ok(national.includes(date));
  for(const date of ['2027-02-02','2027-06-24','2027-11-06','2027-12-24'])assert.ok(!national.includes(date));
});
test('every entry has a valid 2027 date, place, category and consulted source',()=>{
  for(const [date,items]of Object.entries(days)){
    assert.match(date,/^2027-\d{2}-\d{2}$/);assert.equal(new Date(date+'T12:00:00Z').toISOString().slice(0,10),date);
    const names=new Set();for(const item of items){assert.ok(!names.has(item.name),date+' duplicate '+item.name);names.add(item.name);
      assert.ok(item.place);assert.ok(['feriado','peru','ayacucho'].includes(item.category));assert.ok(sources[item.sourceId]);assert.equal(new URL(sources[item.sourceId].url).protocol,'https:');assert.ok(item.short);}
  }
  assert.equal(Object.values(days).flat().length,meta.datedEvents);assert.equal(meta.sources,Object.keys(sources).length);
});
test('important Ayacucho festivities are placed in their proper locality and date',()=>{
  for(const [date,name]of [['2027-04-25','Huamanga'],['2027-05-03','Cruces'],['2027-06-24','Chaccu'],['2027-07-28','Vilcas Raymi'],['2027-08-05','Nieves'],['2027-08-26','Yapuy'],['2027-09-14','Maynay'],['2027-09-14','Quinuapata'],['2027-11-06','Canción Ayacuchana']])assert.ok(has(date,name),date+' '+name);
  assert.ok(!has('2027-11-07','Canción Ayacuchana'));
  assert.match(days['2027-09-08'][0].place,/Apurímac/);
});
test('movable dates use rules for 2027 instead of copying last year',()=>{
  for(const [date,name]of [['2027-02-06','Pisco Sour'],['2027-02-10','Ceniza'],['2027-03-19','Dolores'],['2027-03-25','Jueves Santo'],['2027-03-26','Viernes Santo'],['2027-03-28','Resurrección'],['2027-04-11','Niño Peruano'],['2027-05-09','Madre'],['2027-05-27','Corpus'],['2027-06-20','Padre'],['2027-07-18','Pollo'],['2027-07-25','Pisco'],['2027-08-15','Niño']])assert.ok(has(date,name),date+' '+name);
});
test('simultaneous celebrations retain all entries and national holiday priority',()=>{
  assert.equal(days['2027-07-28'][0].category,'feriado');assert.ok(has('2027-07-28','Vilcas'));
  assert.equal(days['2027-06-24'].length,4);assert.equal(days['2027-06-24'][0].category,'ayacucho');
  assert.ok(has('2027-10-31','Criolla'));assert.ok(has('2027-10-31','Halloween'));
});
test('unconfirmed programmes stay seasonal and never receive invented daily dates',()=>{
  assert.equal(seasons.length,7);
  for(const season of seasons){assert.ok(sources[season.sourceId]);assert.ok(!season.date);assert.match(season.note,/confirmar|confirmado/);assert.ok(season.months.every(m=>m>=1&&m<=12));}
  assert.ok(seasons.some(s=>s.name==='Carnaval Ayacuchano'));assert.ok(seasons.some(s=>s.name.includes('Yaku')));
  assert.ok(!Object.values(days).flat().some(i=>i.name==='Carnaval Ayacuchano'));
});
test('Christmas Eve, Christmas and New Year remain separate',()=>{
  assert.ok(has('2027-12-24','Nochebuena'));assert.ok(!has('2027-12-24','Navidad'));assert.ok(has('2027-12-25','Navidad'));assert.ok(has('2027-12-31','Fin de año'));assert.ok(has('2027-01-01','Año Nuevo'));
});
