(() => {
  const key='vegas-display-theme';
  function apply(theme) {
    document.documentElement.dataset.theme=theme;
    document.documentElement.style.colorScheme=theme;
    document.querySelector('meta[name="theme-color"]').content=theme==='light'?'#f5f6f3':'#000000';
    document.querySelector('meta[name="color-scheme"]').content=theme;
    document.querySelectorAll('[data-theme-choice]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.themeChoice===theme)));
  }
  let initial='dark';
  try { if(localStorage.getItem(key)==='light')initial='light'; } catch {}
  apply(initial);
  document.addEventListener('DOMContentLoaded',()=>{
    apply(initial);
    document.querySelectorAll('[data-theme-choice]').forEach(button=>button.addEventListener('click',()=>{
      const theme=button.dataset.themeChoice;
      apply(theme);
      try { localStorage.setItem(key,theme); } catch {}
    }));
  },{once:true});
})();
window.createMobileUI = api => {
  const $ = id => document.getElementById(id);
  const holidays=window.VEGAS_HOLIDAYS;
  const seasons=window.VEGAS_FESTIVAL_SEASONS||[];
  const matches=item=>{const filter=$('festivity-filter').value;return filter==='all'||item.category==='feriado'||(filter==='ayacucho'&&item.category==='ayacucho');};
  const eventsFor=key=>(holidays[key]||[]).filter(matches);
  let selected=null,view='calendar',installPrompt=null,lastSync=null;
  const fullDate=key=>new Intl.DateTimeFormat('es-PE',{weekday:'long',day:'numeric',month:'long',timeZone:'America/Lima'}).format(new Date(key+'T12:00:00Z'));
  const element=(tag,text,className)=>{const el=document.createElement(tag);if(text)el.textContent=text;if(className)el.className=className;return el;};
  function ready() {const s=api.state();return navigator.onLine&&s.cloudReady[s.venue]&&!!s.sessionRole;}
  function setView(next) {
    view=next;document.body.dataset.view=view;
    $('account-panel').hidden=view!=='account';
    document.querySelectorAll('[data-view-target]').forEach(b=>{
      if(b.dataset.viewTarget===view)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');
    });
    window.scrollTo({top:0,behavior:'instant'});api.render();
  }
  function render() {
    const s=api.state(),online=ready(),prefix=`2027-${String(s.month+1).padStart(2,'0')}-`;
    if(!selected?.startsWith(prefix))selected=prefix+'01';
    const monthlySeasons=seasons.filter(item=>item.months.includes(s.month+1)&&matches(item));
    $('season-notice').hidden=!monthlySeasons.length;
    $('season-notice').textContent=monthlySeasons.map(item=>item.name).join(', ');
    $('mobile-nav').hidden=!s.sessionRole;
    $('account-name').textContent=s.owner||'LASVEGAS';
    $('account-role').textContent=s.sessionRole==='admin'?'Administrador · editas tus propias reservas':'Consulta · puedes ver las reservas de ambas sedes';
    $('account-status').textContent=!navigator.onLine?'Sin conexión':online?'Conectado · reservas sincronizadas':'Esperando confirmación del servidor';
    $('mobile-new').hidden=s.sessionRole!=='admin';$('mobile-new').disabled=!online;
    $('mobile-quick-new').hidden=s.sessionRole!=='admin';$('mobile-quick-new').disabled=!online;
    $('mobile-nav').style.gridTemplateColumns=s.sessionRole==='admin'?'repeat(4,1fr)':'repeat(3,1fr)';
    $('connection-banner').hidden=online||!s.sessionRole;
    $('connection-banner').textContent=!navigator.onLine?'Sin conexión. La disponibilidad no está confirmada. Reconecta para guardar.':'Actualizando reservas. Espera la confirmación de disponibilidad.';
    for(const cell of document.querySelectorAll('#calendar-days [data-date]')) {
      const key=cell.dataset.date,festivities=eventsFor(key);
      cell.classList.toggle('selected',key===selected);cell.setAttribute('aria-pressed',String(key===selected));
      cell.classList.toggle('holiday',festivities.length>0);
      if(festivities.length){
        cell.append(element('span','','holiday-dot'),element('span',window.innerWidth<1024?festivities[0].short:festivities[0].name,'holiday-name'));
        cell.classList.toggle('national-holiday',festivities.some(f=>f.category==='feriado'));
        if(festivities.length>1)cell.append(element('span','+'+(festivities.length-1),'holiday-more'));
        cell.setAttribute('aria-label',cell.getAttribute('aria-label')+', '+festivities.map(f=>f.name).join(', '));
      }
      if(!online){cell.setAttribute('aria-label',cell.getAttribute('aria-label').replace('disponible','disponibilidad sin confirmar'));}
    }
    const r=s.stores[s.venue][selected],detail=$('day-detail');detail.replaceChildren();
    const head=element('div','','detail-head');head.append(element('h2',fullDate(selected)),element('span',!online?'Sin confirmar':r?r.status:'Disponible','detail-status'));detail.append(head);
    const holidayList=element('div','','detail-holidays');
    for(const f of eventsFor(selected)){
      const line=element('div','','holiday-caption');line.append(element('p',f.name));holidayList.append(line);
    }detail.append(holidayList);
    detail.append(element('p',r?r.event:online?'Una fecha para tu próximo evento':'Consultando esta fecha…','detail-event'));
    if(r){const meta=element('div','','detail-meta');meta.append(element('span','Reserva de '+r.registeredBy),element('span',api.money(r.advance)+' de adelanto','num'));detail.append(meta);}
    const actions=element('div','','detail-actions');
    const editable=s.sessionRole==='admin'&&(!r||api.owns(r))&&(selected!=='2027-01-01'||s.owner==='Chino');
    if(r||editable){const b=element('button',r?(editable?'Editar mi reserva':'Ver reserva'):'Reservar esta fecha',editable?'primary':'secondary');b.type='button';b.disabled=!online&&editable;b.addEventListener('click',()=>api.open(selected));actions.append(b);}
    if(r&&!api.owns(r)){
      const contact=api.contact(r.registeredBy,selected,s.venue);
      if(contact){const a=element('a','WhatsApp con '+contact.name+' · '+contact.label);a.href=contact.url;a.target='_blank';a.rel='noopener noreferrer';actions.append(a);detail.append(element('p','Solo '+contact.name+' puede editar o eliminar esta reserva. Coordina directamente con él.','detail-hint'));}
    } else if(!r&&s.sessionRole==='viewer'){detail.append(element('p','Tu cuenta es de consulta. Un administrador puede registrar la reserva.','detail-hint'));}
    detail.append(actions);
    $('festivity-list').replaceChildren();
    let count=0;
    for(const [date,items] of Object.entries(holidays).filter(([k])=>k.startsWith(prefix)).sort(([a],[b])=>a.localeCompare(b)))for(const item of items.filter(matches)){
      count++;const block=element('div','','festival-entry');const row=element('button','','holiday-row');row.type='button';const copy=element('span',item.name);row.append(element('b',String(Number(date.slice(-2)))),copy);row.addEventListener('click',()=>{selected=date;api.render();$('day-detail').scrollIntoView({block:'center',behavior:'instant'});});block.append(row);$('festivity-list').append(block);
    }
    for(const item of seasons.filter(item=>item.months.includes(s.month+1)&&matches(item))){
      count++;const block=element('article','','festival-season');block.append(element('h3',item.name));$('festivity-list').append(block);
    }
    $('festivity-title').textContent=`Feriados y celebraciones${count?' · '+count:''}`;
    if(!count)$('festivity-list').append(element('p','Sin fechas destacadas este mes.','detail-hint'));
    if(!online){for(const id of ['stat-free','stat-reserved','stat-pending','stat-advance'])$(id).textContent='—';}
    if(lastSync)$('last-sync').textContent='Última sincronización: '+new Intl.DateTimeFormat('es-PE',{hour:'2-digit',minute:'2-digit',timeZone:'America/Lima'}).format(lastSync)+' · hora de Perú';
  }
  function update(){
    // Calendar cells may already exist when connection state alone changes.
    document.querySelectorAll('#calendar-days .holiday-dot,#calendar-days .holiday-name,#calendar-days .holiday-more').forEach(e=>e.remove());
    render();
  }
  for(const button of document.querySelectorAll('[data-view-target]'))button.addEventListener('click',()=>setView(button.dataset.viewTarget));
  $('mobile-new').addEventListener('click',()=>api.open());
  $('mobile-quick-new').addEventListener('click',()=>api.open());
  $('festivity-filter').addEventListener('change',()=>api.render());
  $('season-notice').addEventListener('click',()=>{document.querySelector('.month-festivities').open=true;document.querySelector('.month-festivities').scrollIntoView({block:'start',behavior:'instant'});});
  $('account-logout').addEventListener('click',()=>{setView('calendar');$('logout').click();});
  $('install-app').addEventListener('click',async()=>{if(installPrompt){await installPrompt.prompt();installPrompt=null;$('install-app').hidden=true;}else $('install-instructions').hidden=false;});
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;$('install-app').hidden=false;$('install-app').textContent='Instalar app';});
  window.addEventListener('appinstalled',()=>{$('install-app').hidden=true;$('install-instructions').textContent='La app ya está instalada.';});
  window.addEventListener('offline',()=>{api.offline();api.render();});
  window.addEventListener('online',()=>{api.render();$('reconnect').click();});
  if('serviceWorker' in navigator&&!window.__PREVIEW__)navigator.serviceWorker.register('./sw.js').catch(()=>{});
  document.body.dataset.view=view;
  return {render:update,select:key=>{selected=key;api.render();if(window.matchMedia?.('(max-width:767px)').matches)$('day-detail').scrollIntoView({block:'nearest',behavior:'instant'});},synced:()=>{lastSync=new Date();},setView};
};
