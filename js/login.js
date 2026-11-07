// Pantalla de login / registro: envía los formularios a la API y redirige al entrar.
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

function cambiarTab(registro) {
  $('form-login').hidden = registro;
  $('form-registro').hidden = !registro;
  $('tab-login').setAttribute('aria-selected', String(!registro));
  $('tab-registro').setAttribute('aria-selected', String(registro));
  $('tab-login').className = 'btn ' + (registro ? 'btn-secondary' : 'btn-primary');
  $('tab-registro').className = 'btn ' + (registro ? 'btn-primary' : 'btn-secondary');
  $('titulo').textContent = registro ? 'Crea tu cuenta' : 'Ingresa a tu portal';
  mostrarError('');
  $(registro ? 'r-nombre' : 'l-usuario').focus();
}
$('tab-login').addEventListener('click', () => cambiarTab(false));
$('tab-registro').addEventListener('click', () => cambiarTab(true));

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

$('form-registro').addEventListener('submit', (e) => {
  e.preventDefault();
  const f = e.target;
  if ($('r-clave').value !== $('r-clave2').value) return mostrarError('Las contraseñas no coinciden.');
  enviar('/api/register', {
    nombre: f.nombre.value, usuario: f.usuario.value, programa: f.programa.value, clave: f.clave.value,
  }, f.querySelector('button'));
});
