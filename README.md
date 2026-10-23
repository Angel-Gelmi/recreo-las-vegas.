# Las Vegas · Reservas 2027

Calendario de GRAS y Recreo Las Vegas, Ayacucho, Perú. Aplicación estática con Firebase Authentication y Firestore; sin servidor SQL ni backend propio.

## Versiones

- `index.html`: núcleo de reservas y autenticación, usado como entrada del generador móvil. `public/index.html`: versión móvil completa generada para producción. `public/` es la única carpeta de despliegue Firebase; ejecutar `npm run build` para actualizarla.
- `mobile-preview/v1/index.html`: copia histórica conservada, identificada por SHA-256.
- `mobile-preview/v2/`: versión móvil elegida para producción, con navegación inferior, WhatsApp, PWA y calendario peruano (75 fechas, 16 feriados nacionales y siete temporadas).
- `mobile-preview/index.html`: comparación con datos de ejemplo. Los demos no usan Firebase real.

## Desarrollo y pruebas

Requisitos: Node.js 22.12 o superior y npm. Python 3 se necesita solo para regenerar la V2 a partir del documento principal; Pillow solo para exportar los iconos/logos, que ya están incluidos.

```sh
npm ci
npm run build
npm test
npm run preview
```

Comparador local: http://localhost:4173/. `npm test` crea y termina su propio servidor temporal, sin depender de otro servidor abierto.

```sh
npm run prepare:preview
npm run prepare:hosting
npm run test:rules
npm run test:firebase
node scripts/backup-firestore.cjs
```

Los dos controles de Firebase requieren una sesión local válida de Firebase CLI. El primero evalúa reglas con solicitudes simuladas en la API de Firebase; el segundo consulta configuración real y cuentas sin escribir reservas. El backup exporta solo las dos colecciones de reservas a `backups/`, excluido de Git. Ninguna prueba local escribe en producción.

## Acceso y datos

WILMER, CHINO VEGAS y JHOAN administran únicamente sus propias reservas. LASVEGAS solo consulta. Las reservas antiguas con responsable `Juan` pertenecen a JHOAN. El 1 de enero queda disponible exclusivamente para administración por Chino.

Las reglas del servidor son la autoridad, aunque alguien modifique el navegador. Los roles proceden de custom claims de Firebase. La configuración web de Firebase es pública; contraseñas, tokens de administración y claves privadas no pertenecen al repositorio.

Los datos cloud se consultan al iniciar sesión y no se guardan en `localStorage`. Se conserva la clave histórica de reservas locales para evitar borrar registros anteriores. Las transacciones comprueban existencia, responsable, versión original y continuidad de sesión.

## Producción

Ver [FIREBASE.md](FIREBASE.md) para despliegue, cabeceras CSP y respaldos; [AUDIT.md](AUDIT.md) para resultados y límites de verificación; [festividades y fuentes](mobile-preview/FUENTES-FESTIVIDADES.md) para el catálogo 2027.

Un push a GitHub **no ejecuta un despliegue de Firebase**. No se incluyen credenciales de despliegue ni un flujo de publicación automática. El build copia únicamente los archivos de la V2 real: `demo.html` y `demo-sdk.js` nunca deben copiarse a producción.
