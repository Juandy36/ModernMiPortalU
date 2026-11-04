// Chat con la secretaría (Wireframe 2, funcionalidad 1). Respuestas simuladas; mensajes en localStorage.
let activa = MPU.storage.get('chat:activa', MPU.conversaciones[0].id);
if (!MPU.conversaciones.some((c) => c.id === activa)) activa = MPU.conversaciones[0].id;

const mensajesGuardados = () => MPU.storage.get('chat:mensajes', {});
function mensajesDe(conv) {
  return mensajesGuardados()[conv.id] || conv.mensajes;
}
function guardar(conv, mensajes) {
  MPU.storage.set('chat:mensajes', { ...mensajesGuardados(), [conv.id]: mensajes });
}
const convActiva = () => MPU.conversaciones.find((c) => c.id === activa);

function esc(s) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function pintarLista() {
  document.getElementById('conversaciones').innerHTML = MPU.conversaciones
    .map(
      (c) => `<li><button type="button" data-id="${c.id}"
        class="w-full text-left p-3 rounded-lg ${c.id === activa ? 'bg-unab-cream' : 'hover:bg-surface'}">
        <div class="font-semibold">${c.nombre}</div>
        <div class="text-small ${c.enLinea ? 'text-ok' : 'text-danger'}">${c.enLinea ? 'En línea' : 'Fuera de horario'}</div>
      </button></li>`
    )
    .join('');
}

function pintarChat() {
  const c = convActiva();
  document.getElementById('chat-titulo').textContent = c.nombre;
  document.getElementById('chat-estado').textContent = c.enLinea
    ? 'En línea · responde en horario de atención'
    : 'Fuera de horario · te responderemos al abrir la atención';
  const cont = document.getElementById('mensajes');
  cont.innerHTML = mensajesDe(c).length
    ? mensajesDe(c)
        .map(
          (m) => `<div class="flex ${m.de === 'yo' ? 'justify-end' : ''}">
            <p class="max-w-md px-4 py-2 rounded-2xl ${m.de === 'yo' ? 'bg-unab text-ink' : 'bg-surface'}">${esc(m.texto)}</p></div>`
        )
        .join('')
    : '<p class="text-center text-small">Aún no hay mensajes. Escribe el primero.</p>';
  cont.scrollTop = cont.scrollHeight;
}

document.getElementById('conversaciones').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-id]');
  if (!btn) return;
  activa = btn.dataset.id;
  MPU.storage.set('chat:activa', activa);
  pintarLista();
  pintarChat();
});

document.getElementById('form-chat').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.getElementById('texto');
  const texto = input.value.trim();
  if (!texto) return;
  const conv = convActiva();
  guardar(conv, [...mensajesDe(conv), { de: 'yo', texto }]);
  input.value = '';
  pintarChat();

  // Respuesta simulada de la secretaría
  const respuesta = conv.enLinea
    ? 'Recibimos tu mensaje. En un momento te ayudamos.'
    : 'Estamos fuera de horario. Te responderemos en cuanto abra la atención.';
  setTimeout(() => {
    guardar(conv, [...mensajesDe(conv), { de: 'ellos', texto: respuesta }]);
    if (convActiva().id === conv.id) pintarChat();
  }, 900);
});

pintarLista();
pintarChat();
