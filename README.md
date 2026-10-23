# Las Vegas · Reservas 2027

Reservas de GRAS y Recreo Las Vegas, Ayacucho. Aplicación estática con Firebase Authentication y Firestore. La reorganización conserva diseño y comportamiento.

## Estructura

```text
src/
  templates/base.html    # Núcleo de reservas, autenticación y plantilla HTML
  js/mobile.js          # Interfaz móvil y apariencia
  styles/mobile.css     # Diseño responsive claro/oscuro
  data/                 # Feriados, festividades y referencias editoriales
  pwa/                  # Manifiesto, service worker y página sin conexión
  static/404.html
assets/
  images/               # Logos originales y exportación optimizada
  icons/                # Iconos de instalación
scripts/                # Build, vista previa y operaciones administrativas
tests/                  # Regresiones, integración y controles Firebase
docs/                   # Auditoría, diseño, Firebase y fuentes
mobile-preview/
  index.html            # Comparador local
  demo-sdk.js            # SDK simulado; nunca se publica
  v1/                   # Versión histórica conservada
  v2/                   # Generado, excluido de Git
public/                 # Generado para Firebase, excluido de Git
backups/                # Respaldos privados, excluidos de Git
firebase.json
firestore.rules
```

## Desarrollo

Requisitos: Node.js 22.12 o superior, npm y Python 3. Pillow solo se necesita para volver a exportar logos e iconos; los recursos exportados están versionados. El generador de iconos utiliza Arial de Windows.

```sh
npm ci
npm run build
npm test
npm run preview
```

`npm test` y `npm run preview` reconstruyen automáticamente los archivos generados. Editar `src/` o `assets/`, nunca `public/` ni `mobile-preview/v2/`. Comparador: http://localhost:4173/. La suite administra su propio servidor temporal.

El build copia recursos explícitos, transforma la plantilla base en la interfaz móvil, genera demos aislados y recalcula los hashes CSP. Las URLs públicas no cambian. V1 se valida por SHA-256. Se conserva la plantilla base completa para evitar cambiar la lógica durante una limpieza estructural.

## Firebase

```sh
npm run test:rules
npm run test:firebase
npm run test:deployment
node scripts/backup-firestore.cjs
```

Requieren una sesión Firebase CLI válida. Las pruebas de reglas simulan solicitudes y los demás controles son de lectura. Los backups contienen información privada y nunca se incluyen en Git ni en Hosting.

WILMER, CHINO VEGAS y JHOAN administran sus propias reservas; LASVEGAS solo consulta. La configuración web Firebase es pública; contraseñas y credenciales administrativas no pertenecen al repositorio.

`scripts/provision-users.cjs` es una herramienta administrativa manual, no parte del build. Usa `firebase-admin` del entorno local `.test-runtime/`, que se conserva por esa dependencia. No ejecutarlo sin una operación explícita de administración de cuentas. El `jsdom` adicional de ese entorno no lo usa la suite actual; se conserva el entorno completo por precaución.

Para publicar: ejecutar build, pruebas y Firebase CLI `deploy --project recreolasvegas --only hosting,firestore:rules`. Un push no publica Firebase. Hosting continúa sirviendo `public/`.

Documentación: [Firebase](docs/FIREBASE.md), [auditoría](docs/AUDIT.md), [diseño](docs/DESIGN.md), [limpieza](docs/STRUCTURE.md), [festividades](docs/FUENTES-FESTIVIDADES.md).
