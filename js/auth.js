// Protege las páginas: consulta /api/me; sin sesión manda a login.html.
// Va en el <head> de cada página. Usa una petición síncrona (mismo servidor, respuesta mínima)
// para que components.js ya encuentre MPU.usuario al pintar el navbar.
window.MPU = window.MPU || {};
(function () {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', '/api/me', false);
  try { xhr.send(); } catch { /* sin servidor: se trata como sin sesión */ }
  if (xhr.status === 200) {
    MPU.usuario = JSON.parse(xhr.responseText);
  } else {
    document.documentElement.style.display = 'none';
    location.replace('/login.html?volver=' + encodeURIComponent(location.pathname + location.search));
  }
})();

MPU.cerrarSesion = async function () {
  try { await fetch('/api/logout', { method: 'POST' }); } catch { /* da igual */ }
  location.href = '/login.html';
};
