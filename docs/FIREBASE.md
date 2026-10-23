# Firebase · Recreo Las Vegas

Proyecto: `recreolasvegas`. Sitio: https://recreolasvegas.web.app/.

## Arquitectura y permisos

Firebase Authentication usa correo/contraseña y custom claims `reservasRole=admin` o `viewer`. Los nombres visibles se traducen a las cuatro cuentas autorizadas; las contraseñas solo están en Authentication y se introducen en el formulario. No hay contraseñas ni claves administrativas en el código.

Colecciones:

- `artifacts/calendario-2027-reservas-app-v2/public/data/reservations_gras_2027_v2`
- `artifacts/calendario-2027-reservas-app-v2/public/data/reservations_recreo_2027_v2`

Cada documento usa la fecha `2027-MM-DD` como identificador, por lo que una sede solo puede tener una reserva por día. Firestore verifica el rol, la sede, la fecha, el esquema y el responsable. Solo el responsable puede actualizar/eliminar, y `registeredBy` no se puede cambiar. El 1 de enero es administrado únicamente por Chino. LASVEGAS solo lee. Las demás rutas están denegadas.

`Juan` se conserva como alias histórico de JHOAN. No se hizo una migración destructiva de reservas.

## Despliegue manual

1. Ejecutar `npm ci`, `npm run build` y `npm test`. El build genera la V2 móvil con festividades en `public/` y actualiza la CSP.
2. Si cambió HTML, ejecutar `npm run prepare:hosting`: recalcula los hashes de los scripts para la CSP de `public/index.html`.
3. Usar una sesión válida de Firebase CLI y ejecutar `npm run test:rules` y `npm run test:firebase`.
4. Crear un respaldo con `node scripts/backup-firestore.cjs` antes de publicar cambios de datos o permisos.
5. Revisar el diff. La V2 móvil fue elegida por el usuario para producción; un push a GitHub no ejecuta el despliegue.
6. Cuando se autorice publicar, usar Firebase CLI con `deploy --project recreolasvegas --only hosting,firestore:rules`.

Las cabeceras y reglas de seguridad ya se desplegaron. Después de cada publicación, ejecutar `npm run test:deployment` para comprobar los archivos y las reglas realmente servidos.

La CSP usa hashes de scripts inline y permite los SDK de Firebase desde gstatic, las conexiones a Authentication/Firestore y las fuentes usadas por la interfaz. Bloquea scripts inline arbitrarios, objetos incrustados y la inclusión del sitio en iframes. También se preparan `nosniff`, política de referencia, permisos de dispositivo desactivados y revalidación del HTML. Los controles deben volver a verificarse en el dominio después de desplegar.

## Respaldo y recuperación

`node scripts/backup-firestore.cjs` realiza lecturas paginadas de las dos colecciones y guarda los documentos REST completos, con sus tipos y metadatos, en `backups/`. Comprueba que el JSON se puede leer; no imprime nombres de clientes, notas, contraseñas ni tokens. `backups/` está excluido de Git. No copiar estos archivos a `public/` ni a la carpeta de demos.

Se creó un respaldo local verificado de las 6 reservas presentes (4 GRAS, 2 RECREO), sin escrituras cloud. La copia se encuentra en `backups/`; no se adjunta al repositorio público.

La restauración no está automatizada: debe revisarse cada documento, validarse el proyecto y probarse primero en un entorno de pruebas. Un JSON legible no equivale a una recuperación ensayada. Copiar el respaldo a un almacenamiento privado controlado por el propietario; no hay una programación de respaldos activada por este proyecto. Las exportaciones administradas de Firestore requieren revisar facturación y permisos antes de habilitarlas.

Documentación: https://firebase.google.com/docs/firestore/manage-data/export-import y https://firebase.google.com/docs/hosting/full-config.

## Operación

- La configuración de Firebase para navegador es pública; la autorización reside en las reglas y claims, no en ocultar la API key.
- El SDK de Firebase sigue fijado en 11.6.1. El análisis npm cubre las dependencias del repositorio, no los SDK descargados desde CDN.
- Si un control REST devuelve 401, renovar la sesión de Firebase CLI. No copiar tokens a `.env` ni al código.
- No se cambió la persistencia de sesión elegida por Firebase: conserva el comportamiento actual del dispositivo. Los registros de reservas nuevos no se persisten en `localStorage`.
- Ante pérdida de conexión, confirmar sincronización antes de guardar. Las transacciones rechazan fechas ocupadas, cambios ajenos y ediciones obsoletas.
