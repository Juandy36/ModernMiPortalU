const { usuarioDeSesion, ruta } = require('./_lib');

module.exports = ruta('GET', async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const u = await usuarioDeSesion(req);
  if (!u) return res.status(401).json({ error: 'Sin sesión' });
  res.status(200).json(u);
});
