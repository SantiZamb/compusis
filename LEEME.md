# Sitio web Compusis de Colombia

El sitio se genera con `node build.js` a partir de estos archivos de datos:

| Archivo | Contenido |
|---|---|
| `productos.js` | Categorías y productos del portafolio de tecnología |
| `cursos.js` | Cursos cortos |
| `tecnicos.js` | Programas técnicos laborales |
| `sitio.js` | Contacto, sedes, grupos del menú Tecnología, industrias, guías y marcas |
| `privacidad.contenido.html` | Texto de la política de tratamiento de datos |

Cada archivo explica sus campos al inicio. Al subir un cambio a la rama `main`, GitHub Actions
genera el sitio y lo publica automáticamente (`.github/workflows/publicar.yml`).

Para verlo en tu computador:

```sh
node build.js
cd _site && python3 -m http.server 8000
```

Al pasar al dominio propio, cambia `BASE_URL` en `sitio.js`.
