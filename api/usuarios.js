const { sql, crearUsuario, requerirAdmin, validarClave, ruta } = require('./_lib');

// Panel de administración: GET lista los usuarios; POST crea un estudiante (código U00 + 6 dígitos aleatorios).
module.exports = ruta(['GET', 'POST'], async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (!(await requerirAdmin(req, res))) return;

  if (req.method === 'GET') {
    const filas = await sql`SELECT codigo, usuario, nombre, programa, rol FROM usuarios ORDER BY id`;
    return res.status(200).json({ usuarios: filas });
  }

  const d = req.body || {};
  const usuario = String(d.usuario || '').trim().toLowerCase();
  const nombre = String(d.nombre || '').trim();
  const clave = String(d.clave || '');
  const programa = String(d.programa || '').trim().slice(0, 80) || 'Ingeniería de Sistemas';

  if (!/^[a-z0-9._-]{3,30}$/.test(usuario)) {
    return res.status(400).json({ error: 'El usuario debe tener 3 a 30 caracteres (letras, números, . _ -).' });
  }
  if (nombre.length < 3 || nombre.length > 80) return res.status(400).json({ error: 'Escribe el nombre completo del estudiante.' });
  const errorClave = validarClave(clave, nombre, usuario);
  if (errorClave) return res.status(400).json({ error: errorClave });

  const nuevo = await crearUsuario({ usuario, nombre, clave, programa });
  if (!nuevo) return res.status(409).json({ error: 'Ese usuario ya existe.' });
  res.status(201).json({ ok: true, codigo: nuevo.codigo, usuario, nombre, programa });
});
