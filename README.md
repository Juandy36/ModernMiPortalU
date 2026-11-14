# Modern MiPortalU

Rediseño de MiPortalU (UNAB) para el curso de Diseño de Interfaces. El frontend es HTML, CSS y JavaScript puro; los **usuarios, el inicio de sesión y la administración de cuentas** van contra un backend sencillo con base de datos Postgres (Neon). Los datos de las pantallas (horario, notas, pagos, etc.) son de ejemplo y su estado se guarda en `localStorage`.

Versión de referencia: https://modernmiportalu.vercel.app/ (se redespliega con cada push a `main`).

## Stack
- **Frontend:** HTML + CSS + JavaScript sin build, con Tailwind por CDN (`js/tailwind-config.js` tiene la guía de estilo) y la fuente Montserrat.
- **Backend:** funciones serverless de Vercel en `api/` (Node), con `@neondatabase/serverless`.
- **Base de datos:** Neon Postgres. Solo los usuarios viven en la base; el resto del estado está en el navegador (prefijo `mpu:`).

## Despliegue y ejecución
- **Variable de entorno obligatoria:** `DATABASE_URL` (se crea al conectar Neon en Vercel → Storage).
- **Variable opcional:** `ADMIN_CLAVE`, contraseña de la cuenta `admin` (ver «Administración»).
- **Primer arranque:** las tablas (`usuarios`, `sesiones`, `intentos`) y los usuarios de prueba se crean solos en la primera petición a la API.
- **Local:** `vercel link`, `vercel env pull .env.local` y `npm run dev` (usa `vercel dev`, abre http://localhost:3000). Abrir `index.html` directo no sirve: las páginas piden sesión a la API.

## Usuarios y acceso
- `login.html` solo permite **ingresar**. No hay registro público: en una universidad las cuentas las crea la institución (administración o carga en la base).
- **Usuarios de prueba** (contraseña inicial `Unab2026*`, que conviene cambiar en Mi perfil): `jortiz`, `jmartinez`, `drueda` y `estudiante`.
- **Código institucional:** cada estudiante tiene un código `U00` + 6 dígitos aleatorios y únicos, guardado en la base y mostrado en el carné. Los usuarios que no tenían código reciben uno al arrancar. La cuenta de administración usa el prefijo `A00`.
- **Sesión:** cookie `sid` `HttpOnly; Secure; SameSite=Lax` de 8 horas. `js/auth.js` consulta `/api/me` en el `<head>` de cada página; sin sesión redirige a `login.html?volver=…`.
- **¿Olvidaste tu contraseña?** Orienta a Punto U (no hay servidor de correo configurado).

## Administración
La cuenta `admin` (rol «Administrador») **no tiene contraseña en el código**. Se crea sola, al arrancar la API o en el primer intento de ingreso como `admin`, de una de estas formas:
1. Con la variable `ADMIN_CLAVE`, si está definida (debe cumplir la política de contraseñas).
2. Si no, copiando la contraseña de `jortiz`, pero **solo cuando `jortiz` ya la cambió** de la de ejemplo. Así nunca queda una contraseña de administrador pública.

Con esa cuenta, el menú de las iniciales muestra **Administrar usuarios** (`pages/admin.html`):
- **Crear estudiante:** nombre, usuario, programa y contraseña inicial (botón «Generar» para una clave aleatoria válida). Muestra una sola vez el código, el usuario y la contraseña inicial, con botón para copiarlos. El estudiante puede cambiarla en Mi perfil.
- **Lista de usuarios** con código, usuario, nombre, programa y rol, y buscador.
- Los usuarios creados desde el panel siempre quedan como estudiantes; el código lo genera el servidor.

## API (`api/`)
| Ruta | Método | Descripción |
|---|---|---|
| `/api/login` | POST | Inicia sesión (usuario y contraseña). Bloquea tras 5 fallos (429). |
| `/api/logout` | POST | Cierra la sesión. |
| `/api/me` | GET | Datos del usuario con sesión (incluye `codigo` y `rol`). |
| `/api/perfil` | POST | Actualiza nombre y programa. |
| `/api/password` | POST | Cambia la contraseña (exige la actual correcta y que la nueva sea distinta). |
| `/api/usuarios` | GET, POST | Solo administrador: lista usuarios y crea estudiantes (401 sin sesión, 403 sin rol). |

`api/_lib.js` reúne lo compartido (conexión, creación de tablas, hash, sesiones, límite de intentos y validaciones).

## Seguridad
- Contraseñas con scrypt + sal; comparación en tiempo constante.
- Política de contraseña única (cambio de contraseña y alta de usuarios): mínimo 8 caracteres, mayúscula, minúscula y número, sin nombre, apellido ni usuario.
- Límite de 5 intentos fallidos de login cada 15 minutos por usuario e IP (respuesta 429).
- Autorización por rol validada en el servidor, no solo en la interfaz.
- Cuerpos JSON inválidos devuelven 400; los métodos no permitidos, 405.
- `vercel.json` define `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy` y una **Content-Security-Policy** (scripts propios más Tailwind y cdnjs, `frame-ancestors 'none'`). Las respuestas de `/api` no se guardan en caché.

## Estructura
- `index.html`, `login.html` y `pages/`: una página por pantalla.
- `api/`: funciones serverless (ver arriba).
- `js/auth.js`: protección de páginas y `MPU.usuario`.
- `js/components.js`: navbar, menú de perfil, campana de notificaciones, buscador global, footer y botón de chat.
- `js/storage.js`: `MPU.storage`, formato de fechas, escape de HTML, impresión de documentos y chips de estado.
- `js/data/` (datos de ejemplo) y `js/pages/` (lógica de cada pantalla).
- `css/base.css` y `css/components.css`: estilos que Tailwind no cubre.
- `assets/`: ícono del sitio (el mismo de MiPortalU) y foto del equipo.
- `docs/`: documento del proyecto y wireframes.

## Estado de las pantallas
| Página | Estado |
|---|---|
| `index.html` | Inicio con accesos rápidos, buscador y avance de grado |
| `pages/chat.html`, `noticias.html`, `horario.html`, `turnos.html`, `reservas-csu.html`, `becas.html`, `parqueadero.html`, `semilleros.html`, `deportes.html` | Listas (los 10 wireframes originales) |
| `pages/horas-libres.html` | Requisito de grado de 42 h, actividades reales, QR, historial y encuesta |
| `pages/cursos.html` | Avance curricular, cursos inscritos y proyección (tope de 18 créditos) |
| `pages/calificaciones.html` | PGA, cortes (30/30/40), notas por semestre y certificado |
| `pages/solicitudes.html` | CESAF simplificado: catálogo, buscador y seguimiento |
| `pages/pagos.html` | Cupones, pago simulado, comprobantes, cronograma y financiación |
| `pages/cronogramas.html` | Filtros por modalidad, nivel y estado |
| `pages/grado.html` | Requisitos de grado (también como widget en el inicio) |
| `pages/espacios.html` | Disponibilidad de aulas por campus y reserva de equipos |
| `pages/ayuda.html` | Preguntas frecuentes, canales, CLIC y citas de Punto U |
| `pages/bienestar.html` | Potencia U, Crea U (grupos y clubes), Activa U y Elecciones UNAB |
| `pages/apoyo.html` | Éxito Estudiantil, Lenguas, Competencias digitales, Internacionalización y Centros |
| `pages/syllabus.html` | Programas con filtros y plan de estudios |
| `pages/investigacion.html` | Semilleros, grupos, convocatorias y Apolo |
| `pages/perfil.html` | Datos, foto, carné UNAB (PDF), cambio de contraseña y resumen de trámites |
| `pages/quienes-somos.html` | Foto grupal, presentación del proyecto y equipo |
| `pages/admin.html` | Panel de administración (solo administrador) |

## Cuenta y perfil
- **Menú de perfil** (clic en las iniciales): Mi perfil, carné, cambio de contraseña, trámites, accesos UNAB y, para el administrador, «Administrar usuarios».
- **Foto de perfil:** se guarda solo en el navegador y se ve en el header y en el carné.
- **Carné UNAB:** réplica del carné real (horizontal, con foto y QR). Las descargas (carné, horario, comprobante) muestran solo el documento.
- **Notificaciones** (campana): pagos por vencer, proyección sin guardar, cursos en riesgo, actividades de horas libres próximas, solicitudes en trámite y citas.

## Buscador
Botón «Buscar» en el header (o tecla `/`) y buscador del inicio: encuentran páginas, trámites y temas sin importar las tildes. El índice vive en `js/components.js` (`SITE_EXTRA`).

## Accesibilidad y guía de estilo
- Navegación: Académico (horario, cursos, calificaciones, cronogramas, grado), Servicios (turnos, becas, solicitudes, pagos) y Bienestar son menús desplegables; se abren con clic o teclado y se cierran con Escape.
- El naranja `#FFA400` se usa en fondos y bordes. Para texto naranja se usa `unab-text` (`#A35F00`), con contraste 4,5:1 sobre blanco y crema. Colores de estado con contraste ≥ 4,5:1: rojo `#C62828` y verde `#23794A`.
- Todas las fechas siguen el formato «21 oct 2026».
- Los mensajes de error van dentro de la página con `role="alert"`, no en diálogos del navegador.

## Responsivo
La guía de estilo es para escritorio (1280 px), pero el sitio se adapta desde 320 px:
- **Menos de 1280 px:** el navbar se reemplaza por un botón «Menú» que abre la lista completa (Escape lo cierra).
- **Menos de 768 px:** las grillas pasan a una columna, los títulos se reducen (40 → 30 px, 28 → 24 px) y las tablas se desplazan de lado dentro de su tarjeta.
- Los accesos rápidos del inicio van en 2, 3 o 6 columnas según el ancho.
