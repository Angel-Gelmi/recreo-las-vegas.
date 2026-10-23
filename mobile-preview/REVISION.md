# Revisión de la propuesta

23 de octubre de 2026. Revisión de vista previa, sin despliegue ni escrituras en Firebase. El código puede compartirse por GitHub conservando la V1.

## Comprobaciones

- V1 conserva el mismo SHA-256 que `public/index.html` y `index.html` al iniciar la propuesta.
- 26 pruebas existentes de reservas e integración DOM anterior correctas.
- Integración DOM nueva: selección de fecha, alta móvil, responsable fijo, bloqueo entre administradores, WhatsApp, eliminación por Chino del 1 de enero, consulta LASVEGAS, navegación, cierre de sesión, falta de conexión y reconexión.
- 16 feriados nacionales, Semana Santa calculada para 2027, distinción Nochebuena/Navidad y aniversario de Huamanga comprobados.
- Sintaxis del documento de producción candidato y del demo comprobada; manifiesto e iconos presentes.
- Revisión en navegador real a 1440, 768 y 390 px: sin desbordamiento horizontal ni errores JavaScript. Revisión adicional a 320 px sin desbordamientos; no equivale a probar un equipo físico.
- Captura final de 390 px: inspector sin errores ni advertencias. En escritorio conserva una advertencia de texto secundario a 11–12 px; corresponde a metadatos, leyenda y etiquetas de calendario. Los controles y campos usan tamaños táctiles.

## Comparación

| V1 conservada | V2 propuesta |
| --- | --- |
| Reserva móvil representada solo por un punto | Nombre del responsable en la celda y detalle completo al seleccionar |
| Agenda después del calendario | Pantalla propia de Reservas, con búsqueda |
| Formulario centrado | Panel inferior móvil y acciones fijas |
| Cerrar sesión en encabezado | Mi cuenta, con nombre, rol y estado de conexión |
| Sin calendario festivo | Feriados y celebraciones con nombres, tipo y detalle |
| Sin manifiesto PWA | Manifiesto, iconos, instrucciones de instalación y página sin conexión preparados |

## Pendiente de aprobación y equipo real

Las reservas de la comparación son ejemplos identificados en pantalla y aislados de Firebase. No prueban operaciones reales en producción. Tras elegir la V2, falta validar en Android/iPhone reales el teclado, el retorno de WhatsApp y el modo instalado. El servidor de comparación bloquea las páginas con acceso real y el demo no instala el service worker.

No se propusieron fechas exactas del Carnaval Ayacuchano 2027 sin programa oficial confirmado. No se marcaron decretos de días no laborables de años anteriores como si aplicaran a 2027.
