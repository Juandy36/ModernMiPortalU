const { buscarPorUsuario, verificarClave, crearSesion, bloqueado, registrarFallo, limpiarFallos, ruta } = require('./_lib');

module.exports = ruta('POST', async (req, res) => {
  const { usuario = '', clave = '' } = req.body || {};
  const nombre = String(usuario).trim();
  if (await bloqueado(req, nombre)) {
    return res.status(429).json({ error: 'Demasiados intentos fallidos. Espera 15 minutos o contacta a Punto U.' });
  }
  const u = await buscarPorUsuario(nombre);
  if (!u || !verificarClave(String(clave), u.clave_hash)) {
    await registrarFallo(req, nombre);
    return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
  }
  await limpiarFallos(req, nombre);
  await crearSesion(u.id, res);
  res.status(200).json({ ok: true });
});
