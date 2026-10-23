const fs=require('node:fs'),vm=require('node:vm');
const ctx=vm.createContext({window:{},Date});
for(const filename of ['holidays.js','festivals.js'])vm.runInContext(fs.readFileSync('src/data/'+filename,'utf8'),ctx);
const {VEGAS_HOLIDAYS:days,VEGAS_CALENDAR_SOURCES:sources,VEGAS_FESTIVAL_SEASONS:seasons,VEGAS_CALENDAR_META:meta}=ctx.window;
const lines=[
  '# Calendario 2027 · Perú y Ayacucho',
  '', 'Revisión: **23 de octubre de 2026**. Catálogo editorial generado desde `src/data/`. La aplicación muestra únicamente los nombres; las referencias se conservan en esta documentación.',
  '', `Incluye **${meta.datedEvents} entradas con fecha** (incluidos los **16 feriados nacionales**) y **${meta.seasonalEvents} festividades por temporada**, respaldadas por **${meta.sources} referencias**. Es una selección amplia para planificar reservas; no pretende enumerar cada fiesta de cada distrito del Perú.`,
  '', '## Cómo interpretar las fechas',
  '', '- **Feriado nacional:** fecha de descanso nacional según normativa consultada. No se extrapolan puentes compensables de años anteriores. Si se aprueban cambios para 2027, habrá que revisarlos.',
  '- **Celebración de Ayacucho / Perú:** tradición religiosa, familiar, cultural o gastronómica. No significa feriado nacional. Se indica localidad para no confundir una festividad regional con una celebración en Huamanga.',
  '- **Temporada / por confirmar:** sin un día oficial 2027 verificado. Se muestra en el mes y en su lista, nunca sobre una fecha inventada.',
  '- **Semana Santa, Ceniza y Corpus:** fechas litúrgicas calculadas para 2027. Horarios, recorridos y celebraciones trasladadas por cada parroquia requieren programa local.',
  '- **6 de noviembre:** Día de la Canción Ayacuchana. Gob.pe lo incluye entre los días no laborables regionales de 2026; el alcance laboral de 2027 debe verificarse. No se clasifica como feriado nacional.',
  '- **24 de diciembre:** Nochebuena. **25 de diciembre:** Navidad.',
  '- Las festividades nunca crean ni bloquean reservas. La zona de referencia es **America/Lima** y los importes son soles.',
  '', '## Entradas con fecha', '', '| Fecha 2027 | Celebración | Tipo | Localidad | Fuente |', '| --- | --- | --- | --- | --- |'
];
for(const [date,items]of Object.entries(days).sort(([a],[b])=>a.localeCompare(b)))for(const item of items){
  const src=sources[item.sourceId];lines.push(`| ${date.slice(8)}/${date.slice(5,7)} | ${item.name} | ${item.kind} | ${item.place} | [${src.title}](${src.url}) |`);
}
lines.push('','## Temporadas sin programa oficial 2027 confirmado','');
for(const item of seasons){const src=sources[item.sourceId];lines.push(`- **${item.name} — ${item.place}:** ${item.note} [${src.title}](${src.url})`);}
lines.push('','## Fuentes consultadas','');
for(const [id,src]of Object.entries(sources))lines.push(`- [${src.title}](${src.url}) · identificador: ${id}`);
lines.push('','## Límites de la investigación','','Los portales turísticos y los inventarios históricos documentan el día tradicional; no sustituyen el programa de eventos de 2027. Las fichas antiguas del INEI se señalan como referencia histórica. Las notas de años anteriores no se presentan como agendas futuras. El calendario puede ampliarse cuando las autoridades y organizadores publiquen nuevos programas.');
fs.writeFileSync('docs/FUENTES-FESTIVIDADES.md',lines.join('\n')+'\n');
fs.mkdirSync('mobile-preview/assets',{recursive:true});
fs.writeFileSync('mobile-preview/assets/calendario-2027.json',JSON.stringify({meta,days,seasons,sources},null,2)+'\n');
console.log(JSON.stringify(meta));
