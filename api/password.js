const { sql, usuarioDeSesion, verificarClave, hashClave, validarClave, ruta } = require('./_lib');

// Cambia la contraseña con las reglas del portal original.
module.exports = ruta('POST', async (req, res) => {
  const u = await usuarioDeSesion(req);
  if (!u) return res.status(401).json({ error: 'Sin sesión' });

  const { actual = '', nueva = '' } = req.body || {};
  const [fila] = await sql`SELECT clave_hash FROM usuarios WHERE id = ${u.id}`;
  if (!verificarClave(String(actual), fila.clave_hash)) {
    return res.status(400).json({ error: 'La contraseña actual no es correcta.' });
  }

  const n = String(nueva);
  const errorClave = validarClave(n, u.nombre, u.usuario);
  if (errorClave) return res.status(400).json({ error: errorClave });
  if (n === String(actual)) return res.status(400).json({ error: 'La nueva contraseña debe ser distinta a la actual.' });

  await sql`UPDATE usuarios SET clave_hash = ${hashClave(n)} WHERE id = ${u.id}`;
  res.status(200).json({ ok: true });
});
