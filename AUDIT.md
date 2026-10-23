# Revisión técnica · 23 de octubre de 2026

## Resultado y alcance

Revisión del código principal y de la versión móvil V2. **V2 elegida por el usuario y publicada en Firebase el 23 de octubre de 2026**, con calendario de Perú y Ayacucho: 75 fechas (incluidos 16 feriados nacionales), siete temporadas y enlaces a fuentes. La V1 histórica conserva su SHA-256 original. El build reproducible incluye el calendario y todos los recursos móviles en `public/`; no incluye el SDK de demostración. La verificación posterior confirmó igualdad exacta de HTML, estilos, scripts, catálogo, fuentes, iconos y recursos PWA publicados, además de cabeceras y reglas activas. Respaldo previo de seis reservas sin modificar documentos reales.

## Problemas corregidos

- Guardar una reserva que otro dispositivo eliminó provocaba una excepción antes del manejo de errores. El responsable original ahora se captura al abrir el formulario y la transacción comunica el conflicto sin recrear el registro.
- Operaciones y listeners pendientes podían actualizar la interfaz después de cambiar de sesión. Se capturan usuario, generación de sesión y contexto de edición; se descartan callbacks de listeners anteriores.
- Las reservas compartidas se persistían en el navegador. Ya no se escriben copias cloud nuevas en localStorage y se elimina la copia cloud anterior al iniciar la sesión. La clave de reservas locales históricas se conserva para no perder datos anteriores.
- Existía un asistente inactivo de autorización por navegador con instrucciones antiguas. Se eliminó del código actual y se reemplazó la documentación obsoleta de autenticación anónima.
- Se reforzó la validación de fechas reales de 2027, importes, estados y tamaños de textos. Las reglas rechazan eventos formados solo por espacios y versiones vacías.
- Se prepararon cabeceras de seguridad y una CSP basada en hashes verificables. No permite scripts inline arbitrarios ni eval.
- El service worker de V2 ya no intercepta otras aplicaciones del mismo origen. El servidor de demos bloquea también variantes de mayúsculas del acceso real.
- El logo GRAS de 1.195.347 bytes tiene una exportación web de 99.432 bytes (aprox. 92% menos). Se conservan el logo original y la V1.
- Se agregaron package.json, lockfile, comandos reproducibles de pruebas, escaneo básico de secretos y un respaldo local excluido de Git. No se agregaron dependencias de producción.

## Evidencia

- **40 pruebas unitarias/regresión/seguridad**, más las dos integraciones DOM de interfaz principal y V2. Incluyen CRUD, permisos por responsable, sesión, concurrencia, XSS como texto, offline/reconexión, WhatsApp, feriados y filtros.
- **130 evaluaciones de reglas correctas** mediante Firebase Rules API: solicitudes simuladas, sin escribir documentos reales. Cubren propietarios, viewer, anónimos, campos, fechas, rutas y transferencias de responsable.
- Consultas reales de solo lectura: correo/contraseña habilitado; las cuatro cuentas están activas, con tres claims admin y uno viewer; las reglas publicadas comprueban roles. Página y logos actuales devuelven HTTP 200.
- `npm audit`: cero vulnerabilidades reportadas en el árbol de dependencias instalado. Esto no audita los SDK Firebase cargados desde CDN.
- Escaneo de patrones de claves privadas/tokens sobre archivos de código preparados, más revisión del diff. No equivale a una auditoría criptográfica o de todo el historial Git.
- Backup local JSON verificado de 6 reservas, sin escrituras en Firebase y excluido del repositorio.
- La revisión visual previa de V2 a 390, 768 y 1440 px no mostró desbordamientos. La prueba de integración se volvió a ejecutar tras propagar las correcciones del código principal.

## Arquitectura y límites

No hay consultas SQL ni un backend con cookies de sesión: SQL Injection y CSRF clásico de formularios no son las superficies de este proyecto. Firestore usa tokens de Firebase y reglas del servidor. Los textos se insertan mediante textContent y no mediante HTML del usuario.

El cliente genera updatedAt como control de versión; no es una firma ni un registro de auditoría del servidor. Las cuentas y claims son administrados fuera de la página. No se modificaron credenciales, identidades ni planes de facturación.

## Pendientes antes de certificar producción

- Completado: Hosting y reglas desplegados, versión Hosting `472d8a390306fd33`. `node tests/deployment-readonly.cjs` verificó igualdad exacta del HTML y WebP publicados, cabeceras de seguridad, respuesta 404 y reglas activas idénticas al archivo local. Se repitieron las 40 pruebas, dos integraciones DOM y 130 evaluaciones de reglas sin fallos. Respaldo previo verificado de seis reservas, sin escrituras de documentos.
- Completado: el usuario eligió promover V2. Las pruebas comprueban igualdad de los recursos de producción con los revisados, ausencia del SDK demo, permisos y funcionamiento del calendario. Inspección visual a 390, 768 y 1440 px sin fallos del inspector; avisos de textos secundarios pequeños y poco color en un mes sin reservas. El demo sigue aislado de los datos reales.
- Probar teclado, instalación PWA y retorno desde WhatsApp en Android/iPhone físicos. La emulación no certifica estos comportamientos.
- Hacer una prueba CRUD completa en un proyecto de staging y un ensayo de restauración. Las integraciones locales usan SDK simulado y las evaluaciones de reglas no son transacciones reales en producción.
- Activar un respaldo programado y verificar permisos de su almacenamiento si se requiere operación continua. No se habilitaron servicios de pago ni se cambió facturación.
- Revisar periódicamente los SDK CDN y actualizar el calendario con programas oficiales de festividades de 2027.

No se afirma que estas comprobaciones sustituyan un pentest, una auditoría OWASP completa o pruebas en todos los dispositivos.
