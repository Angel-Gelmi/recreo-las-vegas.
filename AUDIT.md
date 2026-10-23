# Revisión de Recreo Las Vegas

## Actualización tras correcciones

Corregidos los hallazgos 1–5: creación diferenciada de edición, comparación del contenido original en transacciones, botón de acceso bloqueado hasta inicializar, prevención temprana del envío nativo, observador de autenticación y validación UTC de fechas. Se bloquean escrituras sin sesión cloud.

Resultado actual: **25 pruebas unitarias correctas** y **prueba de integración DOM correcta** (`node tests/ui.cjs`). Esta última verifica contraseña errónea, login, sincronización, altas, ediciones, eliminación confirmada, sedes, logos, escape de HTML, febrero y cierre de sesión con SDK simulado. Para ejecutarla: `npm.cmd install --prefix .test-runtime --no-audit --no-fund jsdom`.

Las secciones siguientes conservan el diagnóstico anterior para trazabilidad. Los controles reales de Firebase son de solo lectura; no equivalen a una prueba con contraseña real ni a pruebas visuales en navegador o emulador de reglas. El acceso auxiliar por navegador sigue siendo código inactivo; no se usa para autorizar usuarios. La cuenta compartida sigue siendo una decisión de producto.

Revisión del código actual y consultas de solo lectura al proyecto Firebase `recreolasvegas`.

## Resultados

`node --test tests/reservations.test.cjs`: 21 pruebas, 20 correctas y 1 regresión fallida.
Las pruebas ejecutan funciones extraídas del HTML real en un entorno aislado de Node; simulan almacenamiento y transacciones. No son pruebas completas de navegador ni del emulador de reglas.

`node tests/firebase-readonly.cjs`: Authentication por correo/contraseña habilitado; cuenta de acceso existente y activa; su UID figura en las reglas publicadas; dominio web.app autorizado. Página y ambos logos responden HTTP 200. El script necesita una sesión vigente de Firebase CLI y no imprime tokens.

## Hallazgos

1. **Alta: sobrescritura de reserva concurrente.** `openModal(key)` asigna `editKey` incluso cuando el día está vacío. La transacción rechaza duplicados solamente cuando `!editKey`. Abrir un día vacío y guardar después de que otra persona lo reservó sobrescribe su registro. Reproducido por la prueba fallida. Debe separarse la fecha seleccionada del estado creación/edición.
2. **Media: inicio de sesión antes de estar listo.** El formulario está habilitado desde el HTML, pero su controlador submit se registra después de descargar los tres SDK y esperar `authStateReady`. En esa ventana el navegador puede enviar el formulario de forma nativa y recargar. Si falla la inicialización, nunca se instala el controlador. Debe interceptarse submit inmediatamente y habilitar el botón cuando Firebase esté preparado.
3. **Media: sesiones entre pestañas.** Solo se comprueba `auth.currentUser` al iniciar y se restaura una vez. No hay observador de cambios de autenticación. Cerrar sesión en otro navegador/pestaña no actualiza necesariamente el formulario y los listeners de esta pestaña; Firebase sigue siendo responsable de denegar accesos sin credenciales válidas.
4. **Media: cambios simultáneos de edición.** Se lee el documento dentro de la transacción pero no se compara una versión original. Dos ediciones sucesivas del mismo registro siguen el comportamiento de último guardado y pueden perder cambios anteriores. Una edición de un documento eliminado puede recrearlo.
5. **Baja: validación de fecha dependiente de zona horaria.** `normalizeStore` crea una fecha al mediodía local y compara el día UTC. En UTC+13/+14 puede descartar fechas válidas. No afecta a Lima; conviene validar componentes de calendario sin convertir zona horaria.
6. **Baja: configuración de acceso obsoleta.** El bloque de autorización por navegador usa `deviceUid`, que nunca se asigna. FIREBASE.md y la prueba antigua apuntan a vegas.html y autenticación anónima; la app actual usa index.html y cuenta compartida.
7. **Limitación de trazabilidad:** “Registrado por” es un campo seleccionable. Las personas usan una cuenta compartida; el campo no acredita quién hizo un cambio.

## Controles comprobados por código y pruebas

- Fechas inválidas almacenadas se descartan; importes negativos/no numéricos se normalizan.
- La fecha protegida del 1 de enero rechaza escrituras en la lógica y en las reglas publicadas.
- Un error de escritura del servidor no actualiza el estado local como si hubiese tenido éxito.
- Separación de sedes y eliminación del registro seleccionado en el entorno simulado.
- Las reglas publicadas restringen usuarios, colecciones, fechas y campos.
- Los textos de reservas se insertan usando textContent, evitando interpretarlos como HTML.
- Copia public/index.html idéntica a index.html; recursos de logos presentes.

## Pendiente para certificar funcionamiento integral

No se ha comprobado la contraseña real ni una sesión de usuario final en navegador, ni se han creado/editado/eliminado reservas en producción. Falta prueba integral en navegador y emulador de Firestore (incluidos permisos y concurrencia), prueba de dos sesiones y dispositivos móviles. HTTP 200 no certifica esas operaciones.

En esta revisión solo se añadieron pruebas y este informe. No se modificó ni desplegó la aplicación, ni se alteraron datos o reglas de Firebase.
