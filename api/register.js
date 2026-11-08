const { sql, hashClave, validarClave, crearSesion, ruta } = require('./_lib');

module.exports = ruta('POST', async (req, res) => {
  const d = req.body || {};
  const usuario = String(d.usuario || '').trim().toLowerCase();
  const nombre = String(d.nombre || '').trim();
  const clave = String(d.clave || '');
  const programa = String(d.programa || '').trim().slice(0, 80) || 'Ingeniería de Sistemas';

  if (!/^[a-z0-9._-]{3,30}$/.test(usuario)) {
    return res.status(400).json({ error: 'El usuario debe tener 3 a 30 caracteres (letras, números, . _ -).' });
  }
  if (nombre.length < 3 || nombre.length > 80) return res.status(400).json({ error: 'Escribe tu nombre completo.' });
  const errorClave = validarClave(clave, nombre, usuario);
  if (errorClave) return res.status(400).json({ error: errorClave });

  const filas = await sql`INSERT INTO usuarios (usuario, clave_hash, nombre, programa)
    VALUES (${usuario}, ${hashClave(clave)}, ${nombre}, ${programa})
    ON CONFLICT (usuario) DO NOTHING RETURNING id`;
  if (!filas.length) return res.status(409).json({ error: 'Ese usuario ya existe.' });

  await crearSesion(filas[0].id, res);
  res.status(201).json({ ok: true });
});
