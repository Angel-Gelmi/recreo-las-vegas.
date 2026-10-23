/* Fechas de 2027. Las celebraciones no implican un día no laborable.
   Fuentes y alcance: ../FUENTES-FESTIVIDADES.md. No se importan reservas. */
window.VEGAS_HOLIDAYS = (() => {
  const days = {};
  const shortNames={'Día de Todos los Santos':'Todos Santos','Batalla de Ayacucho':'B. Ayac.','Aniversario de Huamanga':'Aniv. Hga.','Día de la Fuerza Aérea del Perú':'Día FAP','Batalla de Arica y Día de la Bandera':'Día Bandera','Inmaculada Concepción':'Inmac.','Día de los Difuntos':'Difuntos','Día del Amor y la Amistad':'Amistad','Día de la Canción Criolla':'Canción Criolla','Domingo de Resurrección':'Pascua','San Pedro y San Pablo':'S. Pedro y Pablo','Nochebuena':'Noche buena','Día del Trabajo':'Día del Trabajo','Santa Rosa de Lima':'Santa Rosa'};
  const add = (date, name, kind = 'Feriado nacional') => {
    (days[date] ||= []).push({name, kind, short:shortNames[name]||name});
  };
  for (const [date, name] of [
    ['01-01', 'Año Nuevo'], ['05-01', 'Día del Trabajo'],
    ['06-07', 'Batalla de Arica y Día de la Bandera'], ['06-29', 'San Pedro y San Pablo'],
    ['07-23', 'Día de la Fuerza Aérea del Perú'], ['07-28', 'Fiestas Patrias'],
    ['07-29', 'Fiestas Patrias'], ['08-06', 'Batalla de Junín'],
    ['08-30', 'Santa Rosa de Lima'], ['10-08', 'Combate de Angamos'],
    ['11-01', 'Día de Todos los Santos'], ['12-08', 'Inmaculada Concepción'],
    ['12-09', 'Batalla de Ayacucho'], ['12-25', 'Navidad']
  ]) add('2027-' + date, name);
  // Pascua gregoriana: algoritmo de Meeus/Jones/Butcher, independiente de la zona horaria.
  function easter(year) {
    const a=year%19,b=Math.floor(year/100),c=year%100,d=Math.floor(b/4),e=b%4;
    const f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30;
    const i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451);
    const n=h+l-7*m+114;
    return new Date(Date.UTC(year,Math.floor(n/31)-1,n%31+1,12));
  }
  const pascua=easter(2027);
  for(const [offset,name,kind] of [
    [-7,'Domingo de Ramos','Celebración · Ayacucho'],
    [-3,'Jueves Santo','Feriado nacional'], [-2,'Viernes Santo','Feriado nacional'],
    [-1,'Sábado Santo','Celebración · Ayacucho'], [0,'Domingo de Resurrección','Celebración · Ayacucho']
  ]) {
    const date=new Date(pascua);date.setUTCDate(date.getUTCDate()+offset);
    add(date.toISOString().slice(0,10),name,kind);
  }
  for(const [date,name,kind] of [
    ['02-14','Día del Amor y la Amistad','Celebración'],
    ['04-25','Aniversario de Huamanga','Aniversario · Ayacucho'],
    ['05-09','Día de la Madre','Celebración'], ['06-20','Día del Padre','Celebración'],
    ['06-24','San Juan','Celebración'], ['10-31','Día de la Canción Criolla','Celebración'],
    ['11-02','Día de los Difuntos','Celebración'],
    ['12-24','Nochebuena','Celebración'], ['12-31','Fin de año','Celebración']
  ]) add('2027-'+date,name,kind);
  return Object.freeze(days);
})();
