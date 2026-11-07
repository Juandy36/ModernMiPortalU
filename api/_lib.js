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
      await sql`CREATE TABLE IF NOT EXISTS sesiones (
        token TEXT PRIMARY KEY,
        usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
        expira BIGINT NOT NULL
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
          await sql`INSERT INTO usuarios (usuario, clave_hash, nombre)
                    VALUES (${usuario}, ${hashClave('Unab2026*')}, ${nombre})
                    ON CONFLICT (usuario) DO NOTHING`;
        }
      }
    })().catch((e) => { listo = null; throw e; });
  }
  return listo;
}

function hashClave(clave) {
  const sal = crypto.randomBytes(16).toString('hex');
  return `${sal}:${crypto.scryptSync(clave, sal, 64).toString('hex')}`;
}

function verificarClave(clave, guardada) {
  const [sal, hash] = guardada.split(':');
  return crypto.timingSafeEqual(crypto.scryptSync(clave, sal, 64), Buffer.from(hash, 'hex'));
}

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
  const filas = await sql`SELECT u.id, u.usuario, u.nombre, u.programa, u.facultad, u.rol
    FROM sesiones s JOIN usuarios u ON u.id = s.usuario_id WHERE s.token = ${token}`;
  return filas[0] || null;
}

// Envoltura común: solo el método indicado, base lista y errores como JSON.
const ruta = (metodo, fn) => async (req, res) => {
  try {
    if (req.method !== metodo) { res.setHeader('Allow', metodo); return res.status(405).json({ error: 'Método no permitido' }); }
    if (!process.env.DATABASE_URL) return res.status(500).json({ error: 'Falta configurar DATABASE_URL.' });
    await iniciar();
    await fn(req, res);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error del servidor.' });
  }
};

module.exports = { sql, hashClave, verificarClave, buscarPorUsuario, crearSesion, cookie, tokenDe, usuarioDeSesion, ruta };
