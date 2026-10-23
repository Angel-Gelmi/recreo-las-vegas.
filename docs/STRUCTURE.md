# Limpieza y organización · 23 de octubre de 2026

## Restauración

Punto anterior: commit `4af4404`, etiqueta `backup/pre-cleanup-2026-10-23`. La revisión comenzó con el árbol Git limpio. Los respaldos privados de Firestore permanecen en `backups/`; no se modificaron cuentas ni documentos.

## Inventario y decisiones

| Grupo anterior | Destino / decisión | Motivo |
| --- | --- | --- |
| `index.html` raíz | `src/templates/base.html` | Separar la plantilla editable del HTML publicado |
| `mobile-preview/v2/mobile.js` | `src/js/mobile.js` | Fuente única de interfaz y temas |
| `mobile-preview/v2/mobile.css` | `src/styles/mobile.css` | Fuente única de estilos |
| `holidays.js`, `festivals.js` en V2 | `src/data/` | Separar calendario y metadatos de interfaz |
| Manifiesto, SW, offline de V2 | `src/pwa/` | Agrupar instalación y desconexión |
| `public/404.html` | `src/static/404.html` | Conservar la fuente de la página de error |
| Logos raíz | `assets/images/` | Conservar originales y exportación optimizada |
| `public/logo-gras.png` | `assets/images/logo-gras-original.png` | Preservar el original aunque no se sirve en la app actual |
| Iconos en V2 | `assets/icons/` | Un único origen para preview y publicación |
| AUDIT, FIREBASE, DESIGN y fuentes | `docs/` | Documentación fuera de las fuentes y del despliegue |
| Revisión inicial de V2 | `docs/archive/REVISION.md` | Evidencia histórica conservada |
| `public/`, `mobile-preview/v2/`, demo V1 y JSON catálogo | Generados e ignorados por Git | Evitar mantener manualmente copias; el build las reconstruye |
| Dos PNG antiguos en public y dos en V2 | Copias retiradas tras comparación binaria | No aparecen en referencias actuales; se conservan sus originales y V1 |
| `firebase-debug.log`, `.firebase/mobile-deploy.log` | Eliminados | Salidas de herramientas, sin uso por la aplicación |

La V1 histórica y sus imágenes permanecen juntas y versionadas para conservar sus rutas y su SHA-256. Sus duplicados con `assets/` son intencionales: no se alteró el respaldo solicitado por el usuario.

## Conservados por utilidad o incertidumbre

- `.test-runtime/`: contiene `firebase-admin`, requerido por `scripts/provision-users.cjs`. Su copia de jsdom no es utilizada por las pruebas actuales, pero no se desarmó el entorno administrativo durante esta limpieza.
- `backups/`: exportaciones privadas y manifiesto de hashes anterior a la limpieza.
- `vegas.before-redesign.html`: respaldo local cuyo valor no se descartó.
- `.taste-skill/` y `mobile-preview/assets/review/`: evidencia visual y scripts locales de revisión. Excluidos de Git; no se borraron indiscriminadamente.
- `.firebase/hosting.cHVibGlj.cache`: caché de despliegue, ya excluida.
- Herramientas manuales de acceso, provisión, exportación e iconos: se conservan, aunque no formen parte de `npm test`.

## Dependencias y configuración

La dependencia principal de desarrollo es jsdom y está usada por las integraciones. No se añadieron paquetes. Firebase, Authentication y Firestore conservan las mismas configuraciones, reglas, colecciones y URLs. El build continúa siendo Node + Python y las herramientas opcionales de imágenes requieren Pillow. Las pruebas y el servidor de preview ejecutan el build antes de arrancar mediante scripts npm.

No se dividió ni reescribió la lógica de reservas para evitar cambios de comportamiento ajenos a la limpieza. La plantilla base mantiene su JavaScript inline; los módulos móviles, estilos y calendario ya tienen carpetas propias.

## Validación

- Los 14 archivos activos de publicación coinciden byte por byte con los anteriores. Solo se omiten dos logos heredados sin uso; `backups/structure-before.json` conserva sus hashes.
- 40 pruebas unitarias/regresión/seguridad y dos integraciones DOM aprobadas después de mover las fuentes y actualizar las referencias.
- SHA-256 de V1 conservado; las pruebas confirman que los demos no usan el SDK real.
- `npm audit`: cero vulnerabilidades reportadas en las dependencias principales. No incluye los SDK CDN ni el entorno administrativo conservado.
- Instalación limpia desde un archivo Git de las fuentes reorganizadas: `npm ci` y `npm test` aprobados, incluyendo build, 40 pruebas, ambas integraciones y escaneo de secretos. No dependió de la copia local de `public/`, `mobile-preview/v2/` ni `node_modules/`.
- 130 evaluaciones de reglas Firebase aprobadas; comprobación real de archivos publicados, cabeceras y reglas activas aprobada. No hubo escrituras de reservas ni despliegue.

El build genera `public/` y la vista previa; nunca editar esas salidas directamente. Las instrucciones actuales están en el README raíz.
