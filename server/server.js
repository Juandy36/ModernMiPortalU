// Servidor sin dependencias: sirve el sitio estático y la API de usuarios.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const db = require('./db');

const RAIZ = path.join(__dirname, '..');
const PUERTO = process.env.PORT || 3000;
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.pdf': 'application/pdf', '.woff2': 'font/woff2',
};
// Carpetas/archivos que nunca se sirven.
const PRIVADO = /^\/(server|data|docs|\.git|node_modules)(\/|$)|^\/(package\.json|\.gitignore)$/;

const json = (res, estado, datos, cabeceras = {}) => {
  res.writeHead(estado, { 'Content-Type': 'application/json; charset=utf-8', ...cabeceras });
  res.end(JSON.stringify(datos));
};

const tokenDe = (req) => /(?:^|;\s*)sid=([a-f0-9]+)/.exec(req.headers.cookie || '')?.[1];
const cookie = (token, maxAge) => `sid=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAge}`;

function leerJson(req) {
  return new Promise((ok, fallo) => {
    let cuerpo = '';
    req.on('data', (c) => { cuerpo += c; if (cuerpo.length > 10000) req.destroy(); });
    req.on('end', () => { try { ok(JSON.parse(cuerpo || '{}')); } catch { fallo(new Error('JSON inválido')); } });
  });
}

async function api(req, res, ruta) {
  if (ruta === '/api/me' && req.method === 'GET') {
    const u = db.usuarioDeSesion(tokenDe(req));
    return u ? json(res, 200, u) : json(res, 401, { error: 'Sin sesión' });
  }
  if (ruta === '/api/logout' && req.method === 'POST') {
    db.borrarSesion(tokenDe(req));
    return json(res, 200, { ok: true }, { 'Set-Cookie': cookie('', 0) });
  }
  if (ruta === '/api/login' && req.method === 'POST') {
    const { usuario = '', clave = '' } = await leerJson(req);
    const u = db.buscarPorUsuario(String(usuario).trim());
    if (!u || !db.verificarClave(String(clave), u.clave_hash)) {
      return json(res, 401, { error: 'Usuario o contraseña incorrectos.' });
    }
    return json(res, 200, { ok: true }, { 'Set-Cookie': cookie(db.crearSesion(u.id), 8 * 3600) });
  }
  if (ruta === '/api/register' && req.method === 'POST') {
    const d = await leerJson(req);
    const usuario = String(d.usuario || '').trim();
    const nombre = String(d.nombre || '').trim();
    const clave = String(d.clave || '');
    if (!/^[a-zA-Z0-9._-]{3,30}$/.test(usuario)) {
      return json(res, 400, { error: 'El usuario debe tener 3 a 30 caracteres (letras, números, . _ -).' });
    }
    if (nombre.length < 3 || nombre.length > 80) return json(res, 400, { error: 'Escribe tu nombre completo.' });
    if (clave.length < 8 || !/\d/.test(clave) || !/[a-zA-Z]/.test(clave)) {
      return json(res, 400, { error: 'La contraseña debe tener mínimo 8 caracteres, con letras y números.' });
    }
    if (db.buscarPorUsuario(usuario)) return json(res, 409, { error: 'Ese usuario ya existe.' });
    db.crearUsuario({ usuario, clave, nombre, programa: String(d.programa || '').trim().slice(0, 80) || undefined });
    const u = db.buscarPorUsuario(usuario);
    return json(res, 201, { ok: true }, { 'Set-Cookie': cookie(db.crearSesion(u.id), 8 * 3600) });
  }
  json(res, 404, { error: 'No encontrado' });
}

function estatico(res, ruta) {
  if (ruta === '/') ruta = '/index.html';
  const archivo = path.join(RAIZ, ruta);
  if (!archivo.startsWith(RAIZ + path.sep) || PRIVADO.test(ruta)) { res.writeHead(404); return res.end('No encontrado'); }
  fs.readFile(archivo, (err, datos) => {
    if (err) { res.writeHead(404); return res.end('No encontrado'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(archivo)] || 'application/octet-stream' });
    res.end(datos);
  });
}

http.createServer(async (req, res) => {
  try {
    const ruta = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (ruta.startsWith('/api/')) await api(req, res, ruta);
    else estatico(res, ruta);
  } catch (e) {
    json(res, 400, { error: e.message });
  }
}).listen(PUERTO, () => console.log(`MiPortalU en http://localhost:${PUERTO}`));
