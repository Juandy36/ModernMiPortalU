// Pantalla de login: envía el formulario a la API y redirige al entrar.
const $ = (id) => document.getElementById(id);
const error = $('error');

// Solo se acepta volver a una ruta interna del sitio.
const volver = (() => {
  const v = new URLSearchParams(location.search).get('volver') || '';
  return /^\/(?!\/)[^\\]*$/.test(v) && !v.startsWith('/login.html') ? v : '/index.html';
})();

function mostrarError(msg) {
  error.textContent = msg;
  error.classList.toggle('hidden', !msg);
}

$('btn-olvido').addEventListener('click', () => {
  const abrir = $('olvido').hidden;
  $('olvido').hidden = !abrir;
  $('btn-olvido').setAttribute('aria-expanded', String(abrir));
});

async function enviar(url, datos, boton) {
  mostrarError('');
  boton.disabled = true;
  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });
    const cuerpo = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(cuerpo.error || 'No se pudo completar la solicitud.');
    location.href = volver;
  } catch (e) {
    mostrarError(e instanceof TypeError ? 'No hay conexión con el servidor.' : e.message);
    boton.disabled = false;
  }
}

$('form-login').addEventListener('submit', (e) => {
  e.preventDefault();
  const f = e.target;
  if (!f.usuario.value.trim() || !f.clave.value) return mostrarError('Escribe tu usuario y contraseña.');
  enviar('/api/login', { usuario: f.usuario.value, clave: f.clave.value }, f.querySelector('button'));
});
