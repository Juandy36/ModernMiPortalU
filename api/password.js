const { sql, usuarioDeSesion, verificarClave, hashClave, ruta } = require('./_lib');

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
  if (n.length < 8 || !/[A-Z]/.test(n) || !/[a-z]/.test(n) || !/\d/.test(n)) {
    return res.status(400).json({ error: 'La nueva contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número.' });
  }
  // Sin nombre, apellido ni usuario dentro de la contraseña
  const prohibidas = [...u.nombre.split(/\s+/), u.usuario].map((p) => p.toLowerCase()).filter((p) => p.length >= 3);
  if (prohibidas.some((p) => n.toLowerCase().includes(p))) {
    return res.status(400).json({ error: 'La contraseña no puede contener tu nombre, apellido ni usuario.' });
  }
  if (n === String(actual)) return res.status(400).json({ error: 'La nueva contraseña debe ser distinta a la actual.' });

  await sql`UPDATE usuarios SET clave_hash = ${hashClave(n)} WHERE id = ${u.id}`;
  res.status(200).json({ ok: true });
});
