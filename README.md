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
| 1 | `index.html` | Esqueleto |
| 2 | `pages/chat.html` | Esqueleto |
| 3 | `pages/noticias.html` | Esqueleto |
| 4 | `pages/horario.html` | Esqueleto |
| 5 | `pages/turnos.html` | Esqueleto |
| 6 | `pages/reservas-csu.html` | Esqueleto |
| 7 | `pages/becas.html` | Esqueleto |
| 8 | `pages/parqueadero.html` | Esqueleto |
| 9 | `pages/semilleros.html` | Esqueleto |
| 10 | `pages/deportes.html` | Esqueleto |
