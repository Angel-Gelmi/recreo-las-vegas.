# Las Vegas · V1 conservada / V2 móvil

Esta carpeta contiene la propuesta V2 para revisión. **Su inclusión en GitHub no la publica en Firebase ni cambia las reservas reales.**

- `v1/index.html`: copia exacta de la versión actual al iniciar este trabajo. Hash en `V1-SHA256.txt`. Conserva el acceso real original si se abre expresamente.
- `v2/index.html`: aplicación candidata para producción; conserva la integración real de Firebase y los permisos existentes. No se usa para las pruebas visuales.
- `v1/demo.html` y `v2/demo.html`: comparación aislada con Firebase simulado, sin contraseñas reales. Las modificaciones se mantienen solo en memoria hasta recargar.
- `index.html`: selector visual V1/V2 con modo celular y escritorio.

Iniciar desde la raíz del proyecto: `node scripts/serve-mobile-preview.cjs` y abrir http://localhost:4173/.

Para probar en un celular en la misma Wi-Fi, iniciar con `node scripts/serve-mobile-preview.cjs --lan` y abrir la URL de red que imprime. El servidor expone solo la carpeta de vista previa; permite únicamente acceso a los archivos demo y sus recursos, no a las páginas de acceso real. La instalación PWA necesita HTTPS o localhost; la vista de ejemplo no se instala. El servidor de vista previa termina con Ctrl+C.

## Cambios

Calendario móvil con nombres de responsables, detalle de fecha, enlace a WhatsApp, barra de navegación inferior, cuenta y rol, resumen compacto, formulario amplio con acciones fijas, estados de conexión, feriados/celebraciones peruanas y de Huamanga, y preparación de instalación PWA (manifiesto, iconos y página sin conexión).

No se cambian las reglas de Firestore, los responsables ni las credenciales. Solo el propietario puede modificar su reserva; Chino conserva el 1 de enero.

Actualización del calendario: 75 entradas con fecha (incluidos los 16 feriados nacionales), 7 festividades por temporada y 49 referencias. Hay filtros para Perú y Ayacucho, Ayacucho con feriados nacionales, y solo feriados. Cada celebración muestra localidad, fuente y aviso cuando su programa de 2027 no está confirmado. El catálogo completo se puede leer en `FUENTES-FESTIVIDADES.md` o consultar en `assets/calendario-2027.json`.

## Revisión y aprobación

Probar ambas versiones y elegir antes de sustituir `public/`. Los datos de ejemplo no deben copiarse a producción. Para promover la V2 se copiarían únicamente su `index.html`, CSS, JS, calendario de festividades, manifiesto, iconos, página offline y service worker; nunca `demo.html` ni `demo-sdk.js`. Deben actualizarse las pruebas de la aplicación a la nueva navegación antes de desplegar.

La emulación y las capturas no sustituyen una prueba de teclado, WhatsApp y modo instalado en Android/iPhone reales.

## Dirección visual

True-black flat, seed 1713651193, conservando colores, Inter y logos actuales. Identidad: dos sedes de Las Vegas y responsables reconocibles en un calendario de Ayacucho. La tarea principal es saber quién tiene una fecha y reservar o coordinar desde el teléfono. Sin animaciones de entrada ni cambios de framework.
