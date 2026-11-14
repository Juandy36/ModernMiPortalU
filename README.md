# Modern MiPortalU

Rediseño frontend de MiPortalU (UNAB) para el curso de Diseño de Interfaces. Los datos de las pantallas son de ejemplo (estado en `localStorage`); los **usuarios y el login** van contra un backend sencillo con base de datos Postgres (Neon).

## Despliegue y ejecución
La versión de referencia es la de Vercel: https://modernmiportalu.vercel.app/ (se redespliega con cada push a `main`).

- **Backend:** funciones serverless en `api/` (`login`, `logout`, `me`, `perfil`, `password`, `usuarios`) con base **Neon Postgres**. Necesita la variable de entorno `DATABASE_URL` (se crea al conectar Neon en Vercel → Storage).
- **Primer uso:** las tablas y 4 usuarios de prueba (contraseña `Unab2026*`: `jortiz`, `jmartinez`, `drueda`, `estudiante`) se crean solos en la primera petición.
- **Código institucional:** cada estudiante tiene un código `U00` + 6 dígitos aleatorios (único), que sale en el carné. Los usuarios que no tenían código reciben uno al arrancar.
- **Administrador:** el usuario `admin` (rol «Administrador») no tiene contraseña en el código. Se crea al primer intento de ingreso (o al arrancar) con `ADMIN_CLAVE` si está definida en Vercel; si no, copia la contraseña de `jortiz`, pero solo cuando `jortiz` ya la cambió de la de ejemplo. Desde el menú de perfil entra a «Administrar usuarios» (`pages/admin.html`), donde crea estudiantes y ve la lista; la API `/api/usuarios` valida el rol en el servidor.
- **Local:** `vercel link`, `vercel env pull .env.local` y `npm run dev` (usa `vercel dev`, abre http://localhost:3000). Abrir `index.html` directo ya no sirve: las páginas piden sesión a la API.
- En `login.html` solo se puede ingresar: no hay registro, porque en una universidad las cuentas las crea la institución (los usuarios se cargan en la base). Las contraseñas se guardan con scrypt + sal; la sesión es una cookie `HttpOnly` de 8 horas.

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
| — | `pages/horas-libres.html` | Listo (requisito de grado de 42 h, QR, historial y encuesta de satisfacción) |
| — | `pages/cursos.html` | Listo (avance curricular, cursos inscritos y proyección) |
| — | `pages/calificaciones.html` | Listo (PGA, cortes, notas por semestre y certificado) |
| — | `pages/solicitudes.html` | Listo (CESAF simplificado: catálogo, buscador y seguimiento) |
| — | `pages/pagos.html` | Listo (cupones, pago simulado, comprobantes, cronograma y financiación) |
| — | `pages/cronogramas.html` | Listo (filtros por modalidad, nivel y estado) |
| — | `pages/grado.html` | Listo (requisitos de grado; widget también en el inicio) |
| — | `pages/espacios.html` | Listo (disponibilidad de aulas y reserva de equipos) |
| — | `pages/ayuda.html` | Listo (preguntas frecuentes, canales y citas de Punto U) |
| — | `pages/bienestar.html` | Listo (Potencia U, Crea U, Activa U y Elecciones UNAB) |
| — | `pages/apoyo.html` | Listo (Éxito Estudiantil, Lenguas, Competencias digitales, Internacionalización) |
| — | `pages/syllabus.html` | Listo (programas con filtros y plan de estudios) |
| — | `pages/investigacion.html` | Listo (semilleros, grupos, convocatorias y Apolo) |

## Cuenta
- Notificaciones (campana del header): pagos por vencer, proyección sin guardar, cursos en riesgo, actividades de horas libres próximas, solicitudes en trámite y citas.
- Foto de perfil (se guarda en el navegador) que se ve en el header y en el carné.
- «¿Olvidaste tu contraseña?» orienta a Punto U (no hay servidor de correo configurado).

## Seguridad (auditoría)
- Contraseñas con scrypt + sal; la sesión es una cookie `HttpOnly; Secure; SameSite=Lax` de 8 horas.
- Política de contraseña (cambio en Mi perfil): mínimo 8 caracteres, mayúscula, minúscula y número, sin nombre, apellido ni usuario.
- Límite de 5 intentos fallidos de login cada 15 minutos por usuario e IP (respuesta 429).
- Cabeceras en `vercel.json`: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`; las respuestas de `/api` no se guardan en caché.
- Pendiente a futuro: Content-Security-Policy (hoy Tailwind por CDN exige permitir scripts en línea).

## Buscador
Botón «Buscar» en el header (o tecla `/`) y buscador del inicio: encuentran páginas, trámites y temas (sin importar tildes). El índice vive en `js/components.js` (`SITE_EXTRA`).

## Accesibilidad y guía de estilo
- Navegación: Académico (horario, cursos, calificaciones, cronogramas, grado), Servicios (turnos, becas, solicitudes, pagos) y Bienestar (horas libres, reservas CSU, parqueadero, semilleros, ASCUN e Interoscas) son menús desplegables; se abren con clic o teclado y se cierran con Escape.
- El naranja `#FFA400` se usa en fondos y bordes. Para texto naranja se usa `unab-text` (`#A35F00`), que cumple contraste 4,5:1 sobre blanco y crema. El verde de estado se oscureció a `#23794A` por la misma razón.
- Todas las fechas siguen el formato «21 oct 2026».
- Colores de estado verificados con contraste ≥ 4,5:1: rojo `#C62828`, verde `#23794A`, texto naranja `#A35F00`.

## Responsivo
La guía de estilo es para escritorio (1280 px), pero el sitio se adapta desde 320 px:
- **Menos de 1280 px:** el navbar se reemplaza por un botón «Menú» que abre la lista completa (Escape lo cierra).
- **Menos de 768 px:** las grillas pasan a una columna, los títulos se reducen (40 → 30 px, 28 → 24 px) y las tablas se desplazan de lado dentro de su tarjeta.
- Los accesos rápidos del inicio van en 2, 3 o 6 columnas según el ancho.
