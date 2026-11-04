# Modern MiPortalU

Rediseño frontend de MiPortalU (UNAB) para el curso de Diseño de Interfaces. Sin backend: los datos son de ejemplo y el estado se guarda en `localStorage`.

**Integrantes:** Juan David Martinez Cepeda · Juan Diego Ortiz · Diego Andrés Rueda Campos

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

## Accesibilidad y guía de estilo
- Navegación: Servicios (Matrícula y turnos, Becas) y Bienestar (Reservas CSU, Parqueadero, Semilleros, ASCUN e Interoscas) son menús desplegables; se abren con clic o teclado y se cierran con Escape.
- El naranja `#FFA400` se usa en fondos y bordes. Para texto naranja se usa `unab-text` (`#A35F00`), que cumple contraste 4,5:1 sobre blanco y crema. El verde de estado se oscureció a `#23794A` por la misma razón.
- Todas las fechas siguen el formato «21 oct 2026».
