/* Ampliación editorial 2027. Fuentes consultadas el 23 de octubre de 2026.
 * Conserva los 16 feriados nacionales de holidays.js. No modifica reservas. */
(() => {
  const days=Object.fromEntries(Object.entries(window.VEGAS_HOLIDAYS).map(([date,items])=>[date,items.map(item=>({...item}))]));
  const sources={};
  const source=(id,title,url)=>{sources[id]={title,url};};
  source('feriados','Gobierno del Perú · feriados nacionales','https://www.gob.pe/feriados');
  source('regional','Gobierno del Perú · calendario regional','https://www.gob.pe/feriados?tab=regional');
  source('semana','Agencia Andina · Semana Santa de Ayacucho','https://andina.pe/agencia/noticia-ayacucho-oficializa-programa-actividades-semana-santa-2026-1065320.aspx');
  source('huamanga','Municipalidad de Huamanga · aniversario','https://www.gob.pe/institucion/munihuamanga/normas-legales/8205129-008-2025-mph-a');
  source('navidad','Biblioteca Nacional del Perú · danzas navideñas de Ayacucho','https://isbn.bnp.gob.pe/catalogo.php?mode=detalle&nt=139183');
  source('cruces','MINCETUR · Fiesta de las Cruces de Luricocha','https://consultasenlinea.mincetur.gob.pe/fichaInventario/index.aspx?cod_Ficha=11652');
  source('chaccu','SERFOR · Vicuña y Chaccu Nacional','https://www.gob.pe/institucion/serfor/noticias/789019-ayacucho-realizan-i-simposio-internacional-de-vicuna-y-xxviii-chaccu-nacional');
  source('vilcas','PROMPERÚ · Vilcas Raymi','https://www.ytuqueplanes.com/festividades/ayacucho/25deg-vilcas-raymi-vilcas-huaman');
  source('agosto','Municipalidad de Miraflores · calendario de agosto','https://www.miraflores.gob.pe/Gestorw3b/files/pdf/6445-9016-calendario-agosto-_1_.pdf');
  source('inei','INEI · festividades tradicionales de Ayacucho','https://proyectos.inei.gob.pe/web/biblioineipub/bancopub/Est/Lib0277/tur2.HTM');
  source('isidro','Ministerio de Cultura · San Isidro de Cancha Cancha','https://www.gob.pe/institucion/cultura/noticias/1366046-ministerio-de-cultura-declara-patrimonio-cultural-de-la-nacion-a-la-festividad-en-honor-a-san-isidro-labrador-de-cancha-cancha-en-ayacucho');
  source('cocharcas','MINCETUR · Santuario de Cocharcas','https://consultasenlinea.mincetur.gob.pe/fichaInventario/index.aspx?cod_Ficha=34');
  source('maynay','Universidad Nacional Autónoma de Huanta · Señor de Maynay','https://aldia.unah.edu.pe/?p=6477');
  source('quinuapata','SUNARP · Señor de Quinuapata','https://www.gob.pe/institucion/sunarp/noticias/1323288-solo-11-de-las-33-iglesias-historicas-de-huamanga-estan-inscritas-en-el-registro-de-predios-de-ayacucho');
  source('cancion','Agencia Andina · Día de la Canción Ayacuchana','https://andina.pe/agencia/noticia-dia-de-cancion-ayacuchana-conoce-por-se-conmemora-y-a-sus-exponentes-historicos-868320.aspx');
  source('carnaval','PROMPERÚ · carnavales del Perú','https://www.gob.pe/institucion/promperu/noticias/1112609-promperu-invita-a-disfrutar-la-temporada-de-carnavales-que-este-ano-se-extiende-hasta-el-mes-de-abril');
  source('yaku','MINCETUR · Yaku Raymi de Andamarca','https://consultasenlinea.mincetur.gob.pe/fichaInventario/index.aspx?cod_Ficha=11547');
  source('candelaria','PROMPERÚ · Virgen de la Candelaria','https://www.peru.travel/es/inspirate/candelaria-5-consejos-para-disfrutar-al-maximo-esta-festividad-peruana');
  source('sour','CENFOTUR · Día del Pisco Sour','https://www.gob.pe/institucion/cenfotur/noticias/637428-el-pisco-sour-patrimonio-cultural-de-la-nacion');
  source('amor','SERPAR · Amor y Amistad','https://www.serpar.gob.pe/eventos/festival-del-amor-y-la-amistad-en-los-clubes-zonales/');
  source('ambiente','MINAM · calendario ambiental peruano','https://sinia.minam.gob.pe/sites/default/files/archivos/public/docs/Calendario%20Ambiental%20Peruano%202026.pdf');
  source('nino','SUSALUD · Día del Niño Peruano','https://www.gob.pe/institucion/susalud/campa%C3%B1as/8390-en-el-dia-del-nino-peruano-conozcamos-sus-derechos-en-salud');
  source('madre','Policía Nacional del Perú · Día de la Madre','https://www.gob.pe/institucion/pnp/informes-publicaciones/6755663-mensaje-por-el-dia-de-la-madre-2025');
  source('padre','Presidencia del Perú · Día del Padre','https://www.gob.pe/institucion/presidencia/noticias/8564-jefe-de-estado-saluda-a-los-padres-peruanos-en-su-dia');
  source('chapi','Diario Oficial El Peruano · Virgen de Chapi','https://www.mef.gob.pe/contenidos/servicios_web/conectamef_quechua/pdf/normas_legales_2012/NL20120905.PDF');
  source('corpus','Gobierno Regional Cajamarca · Corpus Christi','https://www.regioncajamarca.gob.pe/portal/noticias/pdf/99');
  source('sanjuan','Gobierno Regional San Martín · Fiesta de San Juan','https://www.gob.pe/institucion/regionsanmartin/noticias/781040-gobierno-regional-brinda-recomendaciones-en-tradicional-fiesta-de-san-juan');
  source('inti','PROMPERÚ · Inti Raymi','https://www.peru.travel/es/eventos/inti-raymi');
  source('ceviche','Ministerio de la Mujer · Día del Ceviche','https://www.gob.pe/institucion/mimp/noticias/1197888-ministra-destaca-labor-de-cocineras-en-el-dia-del-ceviche-este-plato-representa-la-pujanza-y-el-empoderamiento-de-las-mujeres');
  source('maestro','Ministerio de Educación · Día del Maestro','https://www.gob.pe/institucion/minedu/noticias/1198432-comunicado-n-08-2025-minedu');
  source('carmen','IRTP · Virgen del Carmen de Paucartambo','https://www.gob.pe/institucion/irtp/campa%C3%B1as/113065-festividad-de-la-virgen-del-carmen-de-paucartambo');
  source('pollo','MIDAGRI · Día del Pollo a la Brasa','https://www.gob.pe/institucion/midagri/campa%C3%B1as/71683-dia-del-pollo-a-la-brasa-hinchas-del-pollo-a-la-brasa-es-mas-rico');
  source('pisco','Indecopi · Día Nacional del Pisco','https://www.gob.pe/institucion/indecopi/noticias/634632-dia-nacional-del-pisco-conoce-como-comprar-y-reconocer-un-pisco-autentico-con-estas-recomendaciones-del-indecopi');
  source('motupe','PROMPERÚ · Santísima Cruz de Motupe','https://www.peru.travel/es/eventos/santisima-cruz-de-motupe-una-de-las-mayores-fiestas-religiosas-de-lambayeque');
  source('infancia','EsSalud · Día del Niño','https://www.gob.pe/institucion/essalud/noticias/1227966-essalud-como-explicar-el-significado-del-dia-del-nino-a-los-pequenos-del-hogar');
  source('mercedes','PROMPERÚ · Virgen de las Mercedes de Paita','https://www.peru.travel/es/eventos/fiesta-de-la-virgen-de-las-mercedes-de-paita');
  source('cautivo','Municipalidad de Sullana · Señor Cautivo de Ayabaca','https://www.gob.pe/institucion/munisullana/campa%C3%B1as/40443-peregrinacion-y-festividad-del-senor-cautivo-de-ayabaca');
  source('fortunata','Ministerio de Cultura · Santa Fortunata','https://www.gob.pe/institucion/cultura/noticias/46373-moquegua-celebro-festividad-de-santa-fortunata-patrimonio-cultural-de-la-nacion');
  source('milagros','Arzobispado de Lima · Señor de los Milagros','https://www.arzobispadodelima.org/actividades/todas-las-actividades-por-el-mes-del-senor-de-los-milagros/');
  source('criolla','PROMPERÚ · Canción Criolla, Halloween y Todos los Santos','https://www.peru.travel/es/eventos/dia-de-todos-los-santos');
  source('martin','Conferencia Episcopal Peruana · San Martín de Porres','https://noticias.iglesia.org.pe/san-martin-de-porres-patrono-de-la-justicia-social-y-la-paz/');
  source('musico','Ministerio de Cultura · Día del Músico','https://www.gob.pe/institucion/cultura/noticias/69377-jovenes-solistas-celebrando-el-dia-del-musico');
  source('puerta','Diario Oficial El Peruano · Virgen de la Puerta','https://busquedas.elperuano.pe/dispositivo/NL/2153337-1');
  source('marinera','MINCETUR · Festival de la Marinera','https://consultasenlinea.mincetur.gob.pe/fichaInventario/index.aspx?cod_Ficha=2102');
  source('vendimia','PROMPERÚ · Vendimia en Ica','https://www.gob.pe/institucion/promperu/noticias/1358915-promperu-lanza-el-festival-internacional-de-la-vendimia-region-ica-2026');
  source('qoyllur','PROMPERÚ · guía del viajero, fechas móviles','https://repositorio.promperu.gob.pe/server/api/core/bitstreams/2058d963-db24-466d-b756-3e863fe9476b/content');
  source('difuntos','Santa Sede · conmemoración de los fieles difuntos','https://www.vaticannews.va/es/fiestas-liturgicas/conmemoracion-de-todos-los-fieles-difuntos.html');
  source('nochebuena','Arzobispado de Lima · Nochebuena','https://www.arzobispadodelima.org/actividades/catedral-de-lima-invitacion-a-la-misa-de-nochebuena/');
  source('fin','Diario Oficial El Peruano · celebraciones de fin de año','https://elperuano.pe/noticia/111888-gobierno-dispone-restringir-el-transporte-privado-los-dias-24-25-y-31-de-diciembre-y-el-1-de-enero');
  const baseSources={'Aniversario de Huamanga':'huamanga','Día del Amor y la Amistad':'amor','Día de la Madre':'madre','Día del Padre':'padre','San Juan':'sanjuan','Día de la Canción Criolla':'criolla','Día de los Difuntos':'difuntos','Nochebuena':'nochebuena','Fin de año':'fin'};
  for(const items of Object.values(days))for(const item of items){
    item.category=item.kind==='Feriado nacional'?'feriado':item.kind.includes('Ayacucho')?'ayacucho':'peru';
    item.sourceId=item.category==='feriado'?'feriados':baseSources[item.name]||'semana';
    item.place=item.category==='feriado'?'Todo el Perú':item.category==='ayacucho'?'Ayacucho':'Perú';
    item.note=item.category==='feriado'?'Según normativa vigente consultada; revisar futuros decretos de 2027.':'Celebración; no implica feriado nacional.';
    if(item.name==='Aniversario de Huamanga'){item.place='Huamanga';item.note='El aniversario es anual. El decreto enlazado corresponde a 2025 y no confirma descanso laboral para 2027.';}
    if(item.name==='San Juan')item.place='Amazonía peruana';
    if(item.sourceId==='semana')item.note='Fecha litúrgica calculada para 2027. El programa local de procesiones y horarios está por confirmar.';
  }
  const add=(date,name,category,place,sourceId,short=name,note='Día tradicional; programa local de 2027 por confirmar.')=>{
    if(!sources[sourceId])throw Error('Fuente desconocida: '+sourceId);
    const key=date.startsWith('2027-')?date:'2027-'+date;
    (days[key]||=[]).push({name,category,place,sourceId,short,note,kind:category==='ayacucho'?'Celebración · Ayacucho':'Celebración · Perú'});
  };
  const nth=(month,weekday,n)=>{const first=new Date(Date.UTC(2027,month-1,1,12));return `2027-${String(month).padStart(2,'0')}-${String(1+(weekday-first.getUTCDay()+7)%7+(n-1)*7).padStart(2,'0')}`;};
  // Fechas propias de Ayacucho, con el distrito/provincia para evitar confusiones.
  for(const date of ['01-01','01-06','12-25'])add(date,'Huaylías y danzas navideñas','ayacucho','Huamanga y Huanca Sancos','navidad','Huaylías','Tradiciones de Navidad, Año Nuevo y Reyes. El programa de cada comunidad puede variar.');
  add('01-26','Niño Jesús de Praga','ayacucho','Ayacucho','navidad','Niño Praga');
  add('05-03','Fiesta de las Cruces de Luricocha','ayacucho','Luricocha · Huanta','cruces','Cruces','Día central tradicional. Los actos se extienden desde fines de abril; programa 2027 por confirmar.');
  add('06-24','Festival de la Vicuña y Chaccu Nacional','ayacucho','Lucanas · entorno de Pampa Galeras','chaccu','Chaccu');
  add('07-28','Vilcas Raymi','ayacucho','Vilcashuamán','vilcas','Vilcas','Referencia al cierre tradicional de julio. El rango y programa oficial de 2027 están por confirmar.');
  add('08-05','Virgen de las Nieves','ayacucho','Coracora · Parinacochas','agosto','V. Nieves');
  add('08-15','Virgen de la Asunción','ayacucho','Cangallo y otras localidades','inei','Asunción','Referencia tradicional del inventario del INEI; confirmar el programa local vigente.');
  add('08-24','San Bartolomé de Cancha Cancha','ayacucho','Cancha Cancha · Chuschi · Cangallo','inei','S. Bart.','Día tradicional registrado por el INEI; programa local 2027 por confirmar.');
  add('08-26','San Isidro Labrador · Yapuy','ayacucho','Cancha Cancha · Chuschi · Cangallo','isidro','Yapuy');
  add('09-08','Virgen de Cocharcas','ayacucho','Devoción en Ayacucho; santuario principal en Apurímac','cocharcas','Cocharcas','Fecha de peregrinación. No implica feriado nacional ni descanso automático en Ayacucho.');
  add('09-14','Señor de Maynay','ayacucho','Maynay · Huanta','maynay','Maynay','Día central religioso. La feria agropecuaria tiene otras fechas, variables cada año.');
  add('09-14','Señor de Quinuapata','ayacucho','Quinuapata · Huamanga','quinuapata','Quinuapata');
  add('11-06','Día de la Canción Ayacuchana','ayacucho','Ayacucho','regional','Canción Ayac.','El calendario regional oficial de 2026 lo incluye como día no laborable. Alcance laboral en 2027 por verificar; no es feriado nacional.');
  // Resto de la Semana Santa: se calculan fechas litúrgicas, no agendas de procesión.
  const easter=new Date(Date.UTC(2027,2,28,12));
  const offset=amount=>{const date=new Date(easter);date.setUTCDate(date.getUTCDate()+amount);return date.toISOString().slice(0,10);};
  for(const [day,name,short]of [[-9,'Viernes de Dolores','Dolores'],[-8,'Sábado de Pasión','S. Pasión'],[-6,'Lunes Santo','L. Santo'],[-5,'Martes Santo','M. Santo'],[-4,'Miércoles Santo · El Encuentro','Encuentro']])add(offset(day),name,'ayacucho','Huamanga y otras localidades de Ayacucho','semana',short,'Fecha litúrgica 2027. Programa local de procesiones y horarios por confirmar.');
  add(offset(-46),'Miércoles de Ceniza','peru','Perú · calendario religioso','semana','Ceniza','Fecha litúrgica; no fija los días de actividades del Carnaval Ayacuchano.');
  add(offset(60),'Corpus Christi','peru','Cusco, Cajamarca, Ayacucho y otras ciudades','corpus','Corpus','Jueves litúrgico, 60 días después de Pascua. El programa de cada localidad puede variar.');
  for(const [date,name,place,id,short]of [
    ['02-02','Virgen de la Candelaria','Puno','candelaria','Candelaria'],
    ['03-08','Día Internacional de la Mujer','Perú','ambiente','Mujer'],
    ['05-01','Virgen de Chapi','Arequipa','chapi','V. Chapi'],
    ['06-24','Inti Raymi','Cusco','inti','Inti Raymi'],
    ['06-24','Día del Campesino','Perú','ambiente','Campesino'],
    ['06-28','Día Nacional del Ceviche','Perú','ceviche','Ceviche'],
    ['07-06','Día del Maestro','Perú','maestro','Maestro'],
    ['07-16','Virgen del Carmen de Paucartambo','Paucartambo · Cusco','carmen','V. Carmen'],
    ['08-01','Pachamama Raymi · Madre Tierra','Cusco y comunidades andinas','agosto','Pachamama'],
    ['08-05','Cruz de Chalpón de Motupe','Motupe · Lambayeque','motupe','Motupe'],
    ['09-24','Virgen de las Mercedes de Paita','Paita · Piura','mercedes','Mercedes'],
    ['10-13','Señor Cautivo de Ayabaca','Ayabaca · Piura','cautivo','Cautivo'],
    ['10-14','Santa Fortunata','Moquegua','fortunata','Fortunata'],
    ['10-18','Señor de los Milagros','Lima y otras ciudades del Perú','milagros','Milagros'],
    ['10-19','Señor de los Milagros','Lima y otras ciudades del Perú','milagros','Milagros'],
    ['10-28','Señor de los Milagros','Lima y otras ciudades del Perú','milagros','Milagros'],
    ['10-31','Halloween','Celebración popular en Perú','criolla','Halloween'],
    ['11-03','San Martín de Porres','Lima y otras ciudades del Perú','martin','S. Martín'],
    ['11-22','Día del Músico · Santa Cecilia','Perú','musico','Músico'],
    ['12-15','Virgen de la Puerta de Otuzco','Otuzco · La Libertad','puerta','V. Puerta']
  ])add(date,name,'peru',place,id,short,['candelaria','chapi','carmen','motupe','mercedes','cautivo','fortunata','milagros','puerta'].includes(id)?'Día tradicional. Programa local de 2027 por confirmar; no es feriado nacional.':'Celebración; no es feriado nacional.');
  for(const [month,weekday,n,name,id,short]of [
    [2,6,1,'Día del Pisco Sour','sour','Pisco Sour'],[4,0,2,'Día del Niño Peruano','nino','Niño Perú'],
    [7,0,3,'Día del Pollo a la Brasa','pollo','Pollo'],[7,0,4,'Día Nacional del Pisco','pisco','Pisco'],[8,0,3,'Día del Niño','infancia','Niño']
  ])add(nth(month,weekday,n),name,'peru','Perú',id,short,'Fecha 2027 calculada según la regla anual de la fuente. No es feriado nacional.');
  // Orden: feriado nacional primero, luego celebraciones de Ayacucho y del país.
  const priority={feriado:0,ayacucho:1,peru:2};
  for(const items of Object.values(days))items.sort((a,b)=>priority[a.category]-priority[b.category]);
  window.VEGAS_FESTIVAL_SEASONS=Object.freeze([
    {name:'Carnaval Ayacuchano',months:[2,3],category:'ayacucho',place:'Huamanga y otras provincias de Ayacucho',sourceId:'carnaval',note:'Temporada febrero–marzo. No se encontró un programa oficial confirmado de 2027: comparsas, recorridos y días no laborables por confirmar.'},
    {name:'Carnavales de Cajamarca y otras regiones',months:[2,3],category:'peru',place:'Cajamarca, Junín, Apurímac y otras regiones',sourceId:'carnaval',note:'Temporada de carnavales. Programa 2027 por confirmar para cada localidad.'},
    {name:'Concurso Nacional de Marinera',months:[1,2],category:'peru',place:'Tradición de Trujillo · sede del certamen por confirmar',sourceId:'marinera',note:'Habitualmente a fines de enero; algunas ediciones culminan en febrero. Fecha y sede oficiales de 2027 por confirmar.'},
    {name:'Festival de la Vendimia',months:[3],category:'peru',place:'Ica y sus provincias',sourceId:'vendimia',note:'Temporada de marzo. Programa y fechas de 2027 por confirmar.'},
    {name:'Peregrinación del Señor de Qoyllur Rit’i',months:[5,6],category:'peru',place:'Sinakara · Quispicanchi · Cusco',sourceId:'qoyllur',note:'Festividad móvil entre mayo y junio. Programa de peregrinación 2027 por confirmar.'},
    {name:'Hatun Yaku Raymi · Fiesta del Agua',months:[8],category:'ayacucho',place:'Andamarca · Carmen Salcedo · Lucanas',sourceId:'yaku',note:'Temporada tradicional del 14 al 26 de agosto, con actos principales en los últimos días. Programa exacto de 2027 por confirmar.'},
    {name:'Feria del Señor de Maynay',months:[9],category:'ayacucho',place:'Huanta',sourceId:'maynay',note:'Feria de septiembre con fechas variables. No confundir con el día religioso del 14 de septiembre. Programa 2027 por confirmar.'}
  ].map(Object.freeze));
  window.VEGAS_CALENDAR_SOURCES=Object.freeze(sources);
  window.VEGAS_CALENDAR_META=Object.freeze({year:2027,reviewed:'2026-10-23',nationalHolidays:16,datedEvents:Object.values(days).flat().length,seasonalEvents:window.VEGAS_FESTIVAL_SEASONS.length,sources:Object.keys(sources).length});
  window.VEGAS_HOLIDAYS=Object.freeze(Object.fromEntries(Object.entries(days).map(([key,items])=>[key,Object.freeze(items.map(Object.freeze))])));
})();
