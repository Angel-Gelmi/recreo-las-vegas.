# Comparador V1 / V2

Desde la raíz: `npm run preview`. Reconstruye los demos y sirve http://localhost:4173/. Para un celular en la misma Wi-Fi: `npm run preview -- --lan`.

- `v1/index.html` y sus logos: snapshot histórico; hash en `V1-SHA256.txt`.
- `v1/demo.html`, `v2/` y `assets/calendario-2027.json`: generados, excluidos de Git.
- `demo-sdk.js`: simulación aislada, sin Firebase real ni instalación PWA.
- `index.html`: comparador; el servidor bloquea las páginas con acceso Firebase real.

Editar `../src/` y `../assets/`. V2 es la versión actual y V1 permite compararla con la anterior. Las festividades solo muestran nombres. Las referencias editoriales quedan en [la documentación](../docs/FUENTES-FESTIVIDADES.md).

El build copia la aplicación real a `../public/`, nunca `demo.html` ni `demo-sdk.js`.
