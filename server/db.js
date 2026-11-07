// Base de datos SQLite (node:sqlite, integrada en Node) y manejo de contraseñas con scrypt.
const { DatabaseSync } = require('node:sqlite');
const crypto = require('node:crypto');
const path = require('node:path');
const fs = require('node:fs');

const dir = path.join(__dirname, '..', 'data');
fs.mkdirSync(dir, { recursive: true });
const db = new DatabaseSync(path.join(dir, 'portal.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario TEXT NOT NULL UNIQUE COLLATE NOCASE,
    clave_hash TEXT NOT NULL,
    nombre TEXT NOT NULL,
    programa TEXT NOT NULL DEFAULT 'Ingeniería de Sistemas',
    facultad TEXT NOT NULL DEFAULT 'Ingenierías',
    rol TEXT NOT NULL DEFAULT 'Estudiante'
  );
  CREATE TABLE IF NOT EXISTS sesiones (
    token TEXT PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
    expira INTEGER NOT NULL
  );
`);

function hashClave(clave) {
  const sal = crypto.randomBytes(16).toString('hex');
  return `${sal}:${crypto.scryptSync(clave, sal, 64).toString('hex')}`;
}

function verificarClave(clave, guardada) {
  const [sal, hash] = guardada.split(':');
  const calc = crypto.scryptSync(clave, sal, 64);
  return crypto.timingSafeEqual(calc, Buffer.from(hash, 'hex'));
}

function crearUsuario({ usuario, clave, nombre, programa, facultad, rol }) {
  db.prepare(`INSERT INTO usuarios (usuario, clave_hash, nombre, programa, facultad, rol)
              VALUES (?, ?, ?, ?, ?, ?)`)
    .run(usuario, hashClave(clave), nombre,
      programa || 'Ingeniería de Sistemas', facultad || 'Ingenierías', rol || 'Estudiante');
}

// Usuarios semilla: solo si la tabla está vacía.
if (db.prepare('SELECT COUNT(*) AS n FROM usuarios').get().n === 0) {
  [
    { usuario: 'jortiz', nombre: 'Juan Diego Ortiz' },
    { usuario: 'jmartinez', nombre: 'Juan David Martinez Cepeda' },
    { usuario: 'drueda', nombre: 'Diego Andrés Rueda Campos' },
    { usuario: 'estudiante', nombre: 'Estudiante de Prueba' },
  ].forEach((u) => crearUsuario({ ...u, clave: 'Unab2026*' }));
}

const buscarPorUsuario = (usuario) => db.prepare('SELECT * FROM usuarios WHERE usuario = ?').get(usuario);

function crearSesion(usuarioId) {
  const token = crypto.randomBytes(32).toString('hex');
  db.prepare('INSERT INTO sesiones (token, usuario_id, expira) VALUES (?, ?, ?)')
    .run(token, usuarioId, Date.now() + 8 * 3600 * 1000);
  return token;
}

function usuarioDeSesion(token) {
  if (!token) return null;
  db.prepare('DELETE FROM sesiones WHERE expira < ?').run(Date.now());
  return db.prepare(`SELECT u.id, u.usuario, u.nombre, u.programa, u.facultad, u.rol
    FROM sesiones s JOIN usuarios u ON u.id = s.usuario_id WHERE s.token = ?`).get(token) || null;
}

const borrarSesion = (token) => db.prepare('DELETE FROM sesiones WHERE token = ?').run(token);

module.exports = { crearUsuario, buscarPorUsuario, verificarClave, crearSesion, usuarioDeSesion, borrarSesion };
