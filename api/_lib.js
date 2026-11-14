// Utilidades compartidas de la API (el guion bajo evita que Vercel lo exponga como ruta).
const { neon } = require('@neondatabase/serverless');
const crypto = require('node:crypto');

const sql = neon(process.env.DATABASE_URL || '');

// Crea las tablas y los usuarios semilla una vez por arranque de la función (idempotente).
let listo;
function iniciar() {
  if (!listo) {
    listo = (async () => {
      await sql`CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        usuario TEXT NOT NULL UNIQUE,
        clave_hash TEXT NOT NULL,
        nombre TEXT NOT NULL,
        programa TEXT NOT NULL DEFAULT 'Ingeniería de Sistemas',
        facultad TEXT NOT NULL DEFAULT 'Ingenierías',
        rol TEXT NOT NULL DEFAULT 'Estudiante'
      )`;
      // Código institucional (carné): «U00» + 6 dígitos aleatorios para estudiantes.
      await sql`ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS codigo TEXT`;
      await sql`CREATE UNIQUE INDEX IF NOT EXISTS usuarios_codigo_idx ON usuarios (codigo)`;
      await sql`CREATE TABLE IF NOT EXISTS sesiones (
        token TEXT PRIMARY KEY,
        usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
        expira BIGINT NOT NULL
      )`;
      await sql`CREATE TABLE IF NOT EXISTS intentos (
        clave TEXT PRIMARY KEY,
        n INTEGER NOT NULL,
        desde BIGINT NOT NULL
      )`;
      const [{ n }] = await sql`SELECT COUNT(*)::int AS n FROM usuarios`;
      if (n === 0) {
        const semilla = [
          ['jortiz', 'Juan Diego Ortiz'],
          ['jmartinez', 'Juan David Martinez Cepeda'],
          ['drueda', 'Diego Andrés Rueda Campos'],
          ['estudiante', 'Estudiante de Prueba'],
        ];
        for (const [usuario, nombre] of semilla) {
          await crearUsuario({ usuario, nombre, clave: 'Unab2026*' });
        }
      }
      // Usuarios creados antes de existir el código: se les asigna uno aleatorio.
      for (const f of await sql`SELECT id FROM usuarios WHERE codigo IS NULL`) {
        for (let i = 0; i < 20; i++) {
          const codigo = generarCodigo('U00');
          const hecho = await sql`UPDATE usuarios SET codigo = ${codigo}
            WHERE id = ${f.id} AND codigo IS NULL AND NOT EXISTS (SELECT 1 FROM usuarios WHERE codigo = ${codigo}) RETURNING id`;
          if (hecho.length) break;
        }
      }
      await asegurarAdmin();
    })().catch((e) => { listo = null; throw e; });
  }
  return listo;
}

const generarCodigo = (prefijo) => prefijo + String(crypto.randomInt(0, 1000000)).padStart(6, '0');

// Inserta un usuario con código único. Devuelve {id, codigo}, o null si el usuario ya existe.
async function crearUsuario({ usuario, nombre, clave, hash, programa = 'Ingeniería de Sistemas', facultad = 'Ingenierías', rol = 'Estudiante', prefijo = 'U00' }) {
  for (let i = 0; i < 20; i++) {
    try {
      const f = await sql`INSERT INTO usuarios (usuario, clave_hash, nombre, programa, facultad, rol, codigo)
        VALUES (${usuario}, ${hash || hashClave(clave)}, ${nombre}, ${programa}, ${facultad}, ${rol}, ${generarCodigo(prefijo)})
        ON CONFLICT (codigo) DO NOTHING RETURNING id, codigo`;
      if (f.length) return f[0];
    } catch (e) {
      if (e.code === '23505') return null; // el usuario ya existe
      throw e;
    }
  }
  throw new Error('No se pudo generar un código libre.');
}

// La cuenta «admin» se crea sin contraseñas en el código:
//  1) con ADMIN_CLAVE, si está definida en el entorno; o
//  2) copiando la contraseña de «jortiz», pero solo si ya la cambió de la de ejemplo (así nunca queda una clave pública).
async function asegurarAdmin() {
  if (await buscarPorUsuario('admin')) return;
  const base = { usuario: 'admin', nombre: 'Administrador del portal', programa: 'Administración', facultad: 'Administración', rol: 'Administrador', prefijo: 'A00' };
  const claveAdmin = process.env.ADMIN_CLAVE;
  if (claveAdmin) {
    const motivo = validarClave(claveAdmin, 'Administrador', 'admin');
    if (motivo) console.error('ADMIN_CLAVE no cumple la política de contraseñas: ' + motivo);
    else await crearUsuario({ ...base, clave: claveAdmin });
    return;
  }
  const dueno = await buscarPorUsuario('jortiz');
  if (dueno && !verificarClave('Unab2026*', dueno.clave_hash)) await crearUsuario({ ...base, hash: dueno.clave_hash });
}

function hashClave(clave) {
  const sal = crypto.randomBytes(16).toString('hex');
  return `${sal}:${crypto.scryptSync(clave, sal, 64).toString('hex')}`;
}

function verificarClave(clave, guardada) {
  const [sal, hash] = guardada.split(':');
  return crypto.timingSafeEqual(crypto.scryptSync(clave, sal, 64), Buffer.from(hash, 'hex'));
}

// Reglas de contraseña del portal: mínimo 8, mayúscula, minúscula y número; sin nombre, apellido ni usuario.
function validarClave(clave, nombre, usuario) {
  const n = String(clave);
  if (n.length < 8 || n.length > 100 || !/[A-Z]/.test(n) || !/[a-z]/.test(n) || !/\d/.test(n)) {
    return 'La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número.';
  }
  const prohibidas = [...String(nombre).split(/\s+/), usuario].map((p) => String(p).toLowerCase()).filter((p) => p.length >= 3);
  if (prohibidas.some((p) => n.toLowerCase().includes(p))) return 'La contraseña no puede contener tu nombre, apellido ni usuario.';
  return null;
}

// Límite de intentos fallidos de login: 5 por usuario y dirección IP cada 15 minutos.
const VENTANA = 15 * 60 * 1000;
const MAX_INTENTOS = 5;
const claveIntentos = (req, usuario) => `${String(usuario).toLowerCase().slice(0, 40)}|${String(req.headers['x-forwarded-for'] || '').split(',')[0].trim()}`;
async function bloqueado(req, usuario) {
  const [f] = await sql`SELECT n, desde FROM intentos WHERE clave = ${claveIntentos(req, usuario)}`;
  return !!f && Date.now() - Number(f.desde) < VENTANA && f.n >= MAX_INTENTOS;
}
async function registrarFallo(req, usuario) {
  const k = claveIntentos(req, usuario);
  const ahora = Date.now();
  await sql`INSERT INTO intentos (clave, n, desde) VALUES (${k}, 1, ${ahora}::bigint)
    ON CONFLICT (clave) DO UPDATE SET
      n = CASE WHEN ${ahora}::bigint - intentos.desde >= ${VENTANA}::bigint THEN 1 ELSE intentos.n + 1 END,
      desde = CASE WHEN ${ahora}::bigint - intentos.desde >= ${VENTANA}::bigint THEN ${ahora}::bigint ELSE intentos.desde END`;
}
const limpiarFallos = (req, usuario) => sql`DELETE FROM intentos WHERE clave = ${claveIntentos(req, usuario)}`;

const buscarPorUsuario = async (usuario) =>
  (await sql`SELECT * FROM usuarios WHERE usuario = ${String(usuario).toLowerCase()}`)[0];

async function crearSesion(usuarioId, res) {
  const token = crypto.randomBytes(32).toString('hex');
  await sql`INSERT INTO sesiones (token, usuario_id, expira) VALUES (${token}, ${usuarioId}, ${Date.now() + 8 * 3600 * 1000})`;
  res.setHeader('Set-Cookie', cookie(token, 8 * 3600));
}

const cookie = (token, maxAge) => `sid=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAge}`;
const tokenDe = (req) => /(?:^|;\s*)sid=([a-f0-9]+)/.exec(req.headers.cookie || '')?.[1];

async function usuarioDeSesion(req) {
  const token = tokenDe(req);
  if (!token) return null;
  await sql`DELETE FROM sesiones WHERE expira < ${Date.now()}`;
  const filas = await sql`SELECT u.id, u.usuario, u.nombre, u.programa, u.facultad, u.rol, u.codigo
    FROM sesiones s JOIN usuarios u ON u.id = s.usuario_id WHERE s.token = ${token}`;
  return filas[0] || null;
}

// Envoltura común: solo el método indicado, base lista y errores como JSON.
const ruta = (metodo, fn) => async (req, res) => {
  try {
    const permitidos = [].concat(metodo);
    if (!permitidos.includes(req.method)) { res.setHeader('Allow', permitidos.join(', ')); return res.status(405).json({ error: 'Método no permitido' }); }
    if (!process.env.DATABASE_URL) return res.status(500).json({ error: 'Falta configurar DATABASE_URL.' });
    try { void req.body; } catch { return res.status(400).json({ error: 'El cuerpo de la solicitud no es un JSON válido.' }); }
    await iniciar();
    await fn(req, res);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error del servidor.' });
  }
};

// Devuelve el usuario si es administrador; si no, responde 401/403 y devuelve null.
async function requerirAdmin(req, res) {
  const u = await usuarioDeSesion(req);
  if (!u) { res.status(401).json({ error: 'Sin sesión' }); return null; }
  if (u.rol !== 'Administrador') { res.status(403).json({ error: 'Solo el administrador puede hacer esto.' }); return null; }
  return u;
}

module.exports = { sql, crearUsuario, asegurarAdmin, requerirAdmin, validarClave, bloqueado, registrarFallo, limpiarFallos, hashClave, verificarClave, buscarPorUsuario, crearSesion, cookie, tokenDe, usuarioDeSesion, ruta };
