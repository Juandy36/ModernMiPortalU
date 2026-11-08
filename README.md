# Modern MiPortalU

Rediseño frontend de MiPortalU (UNAB) para el curso de Diseño de Interfaces. Los datos de las pantallas son de ejemplo (estado en `localStorage`); los **usuarios, el login y el registro** van contra un backend sencillo con base de datos Postgres (Neon).

## Despliegue y ejecución
La versión de referencia es la de Vercel: https://modernmiportalu.vercel.app/ (se redespliega con cada push a `main`).

- **Backend:** funciones serverless en `api/` (`login`, `register`, `logout`, `me`) con base **Neon Postgres**. Necesita la variable de entorno `DATABASE_URL` (se crea al conectar Neon en Vercel → Storage).
- **Primer uso:** las tablas y 4 usuarios de prueba (contraseña `Unab2026*`: `jortiz`, `jmartinez`, `drueda`, `estudiante`) se crean solos en la primera petición.
- **Local:** `vercel link`, `vercel env pull .env.local` y `npm run dev` (usa `vercel dev`, abre http://localhost:3000). Abrir `index.html` directo ya no sirve: las páginas piden sesión a la API.
- En `login.html` se puede ingresar o crear cuenta (mínimo 8 caracteres, con letras y números). Las contraseñas se guardan con scrypt + sal; la sesión es una cookie `HttpOnly` de 8 horas.

## Stack
HTML + CSS + JavaScript puro, con Tailwind por CDN (sin build). Se abre `index.html` directamente en el navegador.

## Estructura
- `index.html` y `pages/`: una página por wireframe (10 en total).
- `js/tailwind-config.js`: guía de estilo (colores, Montserrat, tamaños de texto).
- `js/components.js`: navbar, footer y botón de chat compartidos.
- `js/data/`: datos de ejemplo. `js/pages/`: lógica de cada pantalla.
- `css/base.css`: estilos que Tailwind no cubre (insignias de estado, foco).
- `docs/`: documento del proyecto y wireframes.

## Estado de las pantallas
| Wireframe | Página | Estado |
|---|---|---|
| 1 | `index.html` | Listo |
| 2 | `pages/chat.html` | Listo |
| 3 | `pages/noticias.html` | Listo |
| 4 | `pages/horario.html` | Listo |
| 5 | `pages/turnos.html` | Listo |
| 6 | `pages/reservas-csu.html` | Listo |
| 7 | `pages/becas.html` | Listo |
| 8 | `pages/parqueadero.html` | Listo |
| 9 | `pages/semilleros.html` | Listo |
| 10 | `pages/deportes.html` | Listo |
| — | `pages/horas-libres.html` | Listo (requisito de grado de 42 h) |

## Accesibilidad y guía de estilo
- Navegación: Servicios (Matrícula y turnos, Becas) y Bienestar (Reservas CSU, Parqueadero, Semilleros, ASCUN e Interoscas) son menús desplegables; se abren con clic o teclado y se cierran con Escape.
- El naranja `#FFA400` se usa en fondos y bordes. Para texto naranja se usa `unab-text` (`#A35F00`), que cumple contraste 4,5:1 sobre blanco y crema. El verde de estado se oscureció a `#23794A` por la misma razón.
- Todas las fechas siguen el formato «21 oct 2026».

## Responsivo
La guía de estilo es para escritorio (1280 px), pero el sitio se adapta desde 320 px:
- **Menos de 1024 px:** el navbar se reemplaza por un botón «Menú» que abre la lista completa (Escape lo cierra).
- **Menos de 768 px:** las grillas pasan a una columna, los títulos se reducen (40 → 30 px, 28 → 24 px) y las tablas se desplazan de lado dentro de su tarjeta.
- Los accesos rápidos del inicio van en 2, 3 o 6 columnas según el ancho.
