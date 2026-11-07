const { buscarPorUsuario, verificarClave, crearSesion, ruta } = require('./_lib');

module.exports = ruta('POST', async (req, res) => {
  const { usuario = '', clave = '' } = req.body || {};
  const u = await buscarPorUsuario(String(usuario).trim());
  if (!u || !verificarClave(String(clave), u.clave_hash)) {
    return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
  }
  await crearSesion(u.id, res);
  res.status(200).json({ ok: true });
});
