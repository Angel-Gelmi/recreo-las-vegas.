from pathlib import Path
import re
import hashlib
import shutil

root = Path(__file__).resolve().parents[1]
preview = root / 'mobile-preview'
original = (root/'index.html').read_text(encoding='utf-8')
s = original
s = s.replace('<h1>RECREO LAS VEGAS</h1>', '<h2>RECREO LAS VEGAS</h2>')
s = s.replace('</head>', '<link rel="manifest" href="manifest.webmanifest">\n<link rel="stylesheet" href="mobile.css">\n<script src="holidays.js"></script>\n<script src="festivals.js"></script>\n<script src="mobile.js"></script>\n</head>')
s = s.replace('<body>', '<body>')
s = s.replace('<header class="wrap topbar">', '<p id="connection-banner" class="connection-banner" role="status" hidden></p>\n  <header class="wrap topbar">')
s = s.replace('Reservas 2027<br>GRAS & RECREO','Las Vegas<br>Ayacucho · 2027')
s = s.replace('Dos sedes. Cada fecha, en su lugar.','Ayacucho, Perú · Reservas 2027')
s = s.replace('<dt>Fechas disponibles</dt>','<dt>Disponibles</dt>').replace('<dt>Reservas del mes</dt>','<dt>Reservas</dt>').replace('<dt>Adelantos del mes</dt>','<dt>Adelantos</dt>')
s = s.replace('<section class="calendar"', '<button id="season-notice" type="button" class="season-notice" hidden></button>\n        <section class="calendar"')
s = s.replace('<span><i class="dot pending"></i>Pendiente</span>', '<span><i class="dot pending"></i>Pendiente</span><span><i class="holiday-dot"></i>Festividad</span>')
s = s.replace('Selecciona una fecha para consultar o registrar una reserva.', 'Toca un día. Su reserva y sus festividades aparecen debajo.')
s = s.replace('        </section>\n      </div>\n      <aside>', '''        </section>
        <section id="day-detail" class="day-detail" aria-label="Detalle del día seleccionado" aria-live="polite"></section>
        <button id="mobile-new" class="primary new-mobile" type="button" disabled>+ Nueva reserva</button>
        <details class="month-festivities"><summary id="festivity-title">Feriados y celebraciones</summary><label class="festivity-filter" for="festivity-filter">Mostrar en el calendario<select id="festivity-filter"><option value="all">Perú y Ayacucho</option><option value="ayacucho">Ayacucho + feriados nacionales</option><option value="feriado">Solo feriados nacionales</option></select></label><div id="festivity-list"></div></details>
      </div>
      <aside>''')
s = s.replace('    <footer>', '''    <section id="account-panel" class="account-panel" hidden aria-labelledby="account-title">
      <h2 id="account-title">Mi cuenta</h2><p id="account-name" class="account-name"></p><p id="account-role"></p><p id="account-status"></p><p id="last-sync"></p>
      <div class="install-help"><h3>Las Vegas en tu celular</h3><p>Abre tus reservas desde un icono en la pantalla de inicio.</p><button id="install-app" class="secondary" type="button">Cómo instalar la app</button><p id="install-instructions" hidden>Android: abre el menú del navegador y elige «Instalar app» o «Añadir a pantalla de inicio». iPhone: abre en Safari, toca Compartir y «Añadir a pantalla de inicio». La vista de demostración no se instala.</p></div>
      <button id="account-logout" class="secondary" type="button">Cerrar sesión</button>
    </section>
    <nav id="mobile-nav" class="bottom-nav" aria-label="Navegación principal" hidden>
      <button type="button" data-view-target="calendar" aria-current="page"><svg aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 11h18m-13 4h2m4 0h2"/></svg>Calendario</button>
      <button type="button" data-view-target="reservations"><svg aria-hidden="true" viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6m-6 4h6m-6 4h4"/></svg>Reservas</button>
      <button id="mobile-quick-new" type="button" disabled><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 4v16M4 12h16"/></svg>Reservar</button>
      <button type="button" data-view-target="account"><svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/></svg>Mi cuenta</button>
    </nav>
    <footer>''')
s = s.replace('<a id="owner-whatsapp"', '<a class="whatsapp-link" id="owner-whatsapp"')
s = s.replace('    let editVersion=null, editOwner=null;', '    let editVersion=null, editOwner=null, mobileUI=null;')
s = s.replace("month=0, editVenue", "month=(new URLSearchParams(location.search).has('month')?Math.max(0,Math.min(11,Number(new URLSearchParams(location.search).get('month'))||0)):0), editVenue")
s = s.replace("      renderAgenda();\n    }", "      renderAgenda();\n      mobileUI?.render();\n    }")
s = s.replace("cell.addEventListener('click',()=>openModal(key));", "cell.addEventListener('click',()=>mobileUI?mobileUI.select(key):openModal(key));")
s = s.replace("const today=new Date().toLocaleDateString('en-CA');", "const today=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Lima',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());")
s = s.replace("if(!cloud) throw new Error('Inicia sesión", "if(!navigator.onLine) throw new Error('Sin conexión. Reconecta antes de guardar o eliminar.');\n      if(!cloud) throw new Error('Inicia sesión")
s = s.replace("cloudReady[v]=!snapshot.metadata.fromCache;", "cloudReady[v]=!snapshot.metadata.fromCache&&navigator.onLine;\n              if(cloudReady[v])mobileUI?.synced();")
s = s.replace("errors[v]=error;updateConnection();", "errors[v]=error;updateConnection();render();")
s = s.replace("storageKey=`${localStorageKey}:cloud:${config.projectId}`;", "storageKey=`${localStorageKey}:cloud:${config.projectId}${window.__PREVIEW__?':mobile-preview':''}`;")
s = s.replace("function setBusy(value) { busy=value;", "function setBusy(value) { busy=value; if(value){$('sync-status').textContent='Guardando…';}else if(navigator.onLine&&cloudReady.gras&&cloudReady.recreo){$('sync-status').textContent='Sincronizado';}")
s = s.replace('    initializeCloud();', '''    mobileUI=window.createMobileUI({
      state:()=>({stores,venue,month,sessionRole,cloudReady,owner:accountOwner()}),
      owns:ownsReservation,contact:ownerContactLink,money,open:openModal,render,
      offline:()=>{cloudReady={gras:false,recreo:false};connection('Sin conexión','local','Las fechas no están confirmadas. Reconecta para actualizar.');}
    });
    render();
    initializeCloud();''')
# A changed script must bypass older browser caches on the next page load.
mobile_version = hashlib.sha256((preview/'v2/mobile.js').read_bytes()).hexdigest()[:12]
s = s.replace('src="mobile.js"', f'src="mobile.js?v={mobile_version}"')
(preview/'v2/index.html').write_bytes(s.encode('utf-8'))

# A demo is a separate document, never a runtime switch in the real application.
pattern=r"const \[app,authSDK,fs\]=await Promise\.all\(\[[\s\S]*?\]\);"
for version in ['v1','v2']:
    page=(preview/version/'index.html').read_text(encoding='utf-8')
    page,count=re.subn(pattern,'const [app,authSDK,fs]=window.__previewSDK;',page)
    assert count==1, 'Firebase SDK replacement must match exactly once'
    page=page.replace('<head>', '<head><script src="../demo-sdk.js"></script>')
    page=page.replace('<body>', '''<body><div class="preview-mode" style="background:#242424;color:#fff;padding:8px 16px;display:flex;justify-content:space-between;align-items:center;font:12px system-ui"><span>Demostración · datos de ejemplo</span><label style="display:flex;align-items:center;gap:8px">Cuenta <select id="demo-user" aria-label="Cuenta de demostración" style="font-size:12px;min-height:36px;padding:4px 8px"><option value="wilmer">Wilmer</option><option value="chino">Chino</option><option value="jhoan">Jhoan</option><option value="trabajador">LASVEGAS</option></select></label></div>''')
    page=page.replace('    initializeCloud();', "    initializeCloud();\n    document.getElementById('demo-user').addEventListener('change',e=>window.previewAccount(e.target.value));\n    document.getElementById('month-select').value=Math.max(0,Math.min(11,Number(new URLSearchParams(location.search).get('month')??10)||0));document.getElementById('month-select').dispatchEvent(new Event('change'));" )
    # Never install a demo document or share its cached reservation storage with the real app.
    page=page.replace('<link rel="manifest" href="manifest.webmanifest">','')
    page=page.replace('let storageKey = localStorageKey;', "let storageKey = localStorageKey+':preview-demo';")
    page=page.replace('storageKey=`${localStorageKey}:cloud:${config.projectId}`;', "storageKey=`${localStorageKey}:preview-demo`;" )
    (preview/version/'demo.html').write_bytes(page.encode('utf-8'))

(preview/'V1-SHA256.txt').write_text(hashlib.sha256((preview/'v1/index.html').read_bytes()).hexdigest()+'  v1/index.html\n',encoding='utf-8')
print('Prepared V2 and isolated V1/V2 demos. Original index.html and public/ untouched.')
