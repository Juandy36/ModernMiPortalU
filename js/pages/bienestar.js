// Bienestar universitario: inscripción a Potencia U, Crea U y Activa U + información de Elecciones UNAB.
const $ = (id) => document.getElementById(id);
const B = MPU.bienestar;
const fechaDe = (iso) => MPU.fecha(new Date(iso + 'T00:00:00'));
const inscritos = () => MPU.storage.get('bienestar:inscritos', []);
const todos = B.lineas.flatMap((l) => l.programas.map((p) => ({ ...p, linea: l })));

// Al inscribirse se ocupa un cupo
const cuposDe = (p) => p.cupos - (inscritos().includes(p.id) ? 1 : 0);
let tab = B.lineas[0].id;
const tabs = [...B.lineas.map((l) => ({ id: l.id, nombre: `${l.marca} · ${l.nombre}` })), { id: 'elecciones', nombre: 'Elecciones UNAB' }];

function aviso(msg, ok = true) {
  const el = $('aviso');
  el.textContent = msg;
  el.className = 'px-3 py-2 rounded-md font-semibold';
  el.style.background = ok ? '#E3F4EA' : '#FDECEA';
  el.style.color = ok ? '#1B5E38' : '#B42318';
}

function pintarTabs() {
  $('tabs').innerHTML = tabs.map((t) => `<button type="button" role="tab" data-tab="${t.id}" aria-selected="${t.id === tab}"
    class="btn ${t.id === tab ? 'btn-primary' : 'btn-secondary'}">${t.nombre}</button>`).join('');
}

function etiquetaCupos(n) {
  if (n <= 0) return '<span class="badge badge-danger">Sin cupos</span>';
  return `<span class="badge badge-ok">${n} ${n === 1 ? 'cupo' : 'cupos'}</span>`;
}

function pintarPanel() {
  if (tab === 'elecciones') return pintarElecciones();
  const l = B.lineas.find((x) => x.id === tab);
  $('panel').innerHTML = `
    <div class="card"><h2 class="text-h2">${l.marca} · ${l.nombre}</h2>
      <p class="mt-2">${l.desc}</p>
      <p class="text-small mt-2">Contacto: <a class="font-bold text-unab-text underline" href="mailto:${l.correo}">${l.correo}</a></p></div>
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">${l.programas.map((p) => {
    const ins = inscritos().includes(p.id);
    const sinCupo = cuposDe(p) <= 0 && !ins;
    const boton = ins
      ? '<button type="button" class="btn btn-secondary" disabled>Inscrito</button>'
      : `<button type="button" data-inscribir="${p.id}" class="btn btn-primary" ${sinCupo ? 'disabled' : ''}>Inscribirme<span class="sr-only"> en ${MPU.esc(p.nombre)}</span></button>`;
    return `<article class="card flex flex-col gap-2">
        <div class="flex items-start justify-between gap-3"><h3 class="text-h3">${MPU.esc(p.nombre)}</h3>
          <span class="badge" style="background:#FFF3D6;color:#A35F00;border:1px solid #FFA400">${p.modalidad}</span></div>
        <p class="text-small">${p.horario}</p>
        <div>${etiquetaCupos(cuposDe(p))}</div>
        <div class="mt-auto pt-2">${boton}</div></article>`;
  }).join('')}</div>`;
}

function pintarElecciones() {
  const E = B.elecciones;
  const hoy = (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; })();
  const estado = (e) => (e.fin < hoy ? '<span class="badge" style="background:#F4F4F4;color:#333;border:1px solid #8C8C8C">Finalizada</span>' : e.inicio > hoy ? '<span class="badge badge-pending">Próxima</span>' : '<span class="badge badge-ok">En curso</span>');
  $('panel').innerHTML = `
    <div class="card"><h2 class="text-h2">Elecciones UNAB</h2><p class="mt-2">${E.que}</p></div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card"><h3 class="text-h3 mb-2">Órganos en los que se elige</h3>
        <ul class="list-disc pl-6 space-y-1">${E.organos.map((o) => `<li>${o}</li>`).join('')}</ul>
        <h3 class="text-h3 mt-5 mb-2">Estímulo por votar</h3><p>${E.estimulo} <a href="horas-libres.html" class="font-bold text-unab-text underline">Ver mis horas libres</a>.</p></div>
      <div class="card"><h3 class="text-h3 mb-2">Requisitos para ser candidato</h3>
        <ul class="list-disc pl-6 space-y-1">${E.requisitos.map((r) => `<li>${r}</li>`).join('')}</ul>
        <h3 class="text-h3 mt-5 mb-2">Cronograma 2026</h3>
        <ul class="space-y-2">${E.cronograma.map((c) => `<li><strong>${c.etapa}</strong>: ${fechaDe(c.inicio)} – ${fechaDe(c.fin)} ${estado(c)}</li>`).join('')}</ul></div>
    </div>`;
}

function pintarMis() {
  const mios = todos.filter((p) => inscritos().includes(p.id));
  $('sin-mis').classList.toggle('hidden', mios.length > 0);
  $('mis').innerHTML = mios.map((p) => `<li class="flex flex-wrap items-center justify-between gap-3">
    <span><strong>${MPU.esc(p.nombre)}</strong> · ${p.linea.marca} · ${p.horario} · ${MPU.badge('Inscrito')}</span>
    <button type="button" data-cancelar="${p.id}" class="font-bold text-danger hover:underline">Cancelar inscripción<span class="sr-only"> de ${MPU.esc(p.nombre)}</span></button></li>`).join('');
}

function pintarTodo() { pintarTabs(); pintarPanel(); pintarMis(); }

$('tabs').addEventListener('click', (e) => {
  const b = e.target.closest('[data-tab]');
  if (!b) return;
  tab = b.dataset.tab;
  pintarTodo();
});
document.querySelector('main').addEventListener('click', (e) => {
  const i = e.target.closest('[data-inscribir]');
  const c = e.target.closest('[data-cancelar]');
  if (i) {
    const p = todos.find((x) => x.id === i.dataset.inscribir);
    if (cuposDe(p) <= 0) return aviso('Ese programa ya no tiene cupos.', false);
    MPU.storage.set('bienestar:inscritos', [...inscritos(), p.id]);
    aviso(`Te inscribiste en ${p.nombre} (${p.linea.marca}).`);
    pintarTodo();
  }
  if (c) {
    const p = todos.find((x) => x.id === c.dataset.cancelar);
    MPU.storage.set('bienestar:inscritos', inscritos().filter((x) => x !== p.id));
    aviso(`Cancelaste tu inscripción en ${p.nombre}.`);
    pintarTodo();
  }
});
pintarTodo();
