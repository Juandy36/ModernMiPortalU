const { sql, usuarioDeSesion, ruta } = require('./_lib');

// Actualiza nombre y programa del usuario con sesión.
module.exports = ruta('POST', async (req, res) => {
  const u = await usuarioDeSesion(req);
  if (!u) return res.status(401).json({ error: 'Sin sesión' });

  const nombre = String((req.body || {}).nombre || '').trim();
  const programa = String((req.body || {}).programa || '').trim();
  if (nombre.length < 3 || nombre.length > 80) return res.status(400).json({ error: 'Escribe tu nombre completo.' });
  if (programa.length < 3 || programa.length > 80) return res.status(400).json({ error: 'Escribe tu programa académico.' });

  await sql`UPDATE usuarios SET nombre = ${nombre}, programa = ${programa} WHERE id = ${u.id}`;
  res.status(200).json({ ...u, nombre, programa });
});
