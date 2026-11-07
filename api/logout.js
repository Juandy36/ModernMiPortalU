const { sql, tokenDe, cookie, ruta } = require('./_lib');

module.exports = ruta('POST', async (req, res) => {
  const token = tokenDe(req);
  if (token) await sql`DELETE FROM sesiones WHERE token = ${token}`;
  res.setHeader('Set-Cookie', cookie('', 0));
  res.status(200).json({ ok: true });
});
