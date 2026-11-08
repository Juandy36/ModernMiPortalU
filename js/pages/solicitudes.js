// Solicitudes (CESAF simplificado): catálogo por categorías, buscador y seguimiento.
const $ = (id) => document.getElementById(id);
const S = MPU.solicitudes;
const plano = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const misSolicitudes = () => MPU.storage.get('solicitudes:mias', []);
const guardar = (l) => MPU.storage.set('solicitudes:mias', l);

let categoria = S.categorias[0].id;

function aviso(msg) {
  const el = $('aviso');
  el.textContent = msg;
  el.className = 'px-3 py-2 rounded-md font-semibold';
  el.style.background = '#E3F4EA';
  el.style.color = '#1B5E38';
}

// Lista plana de servicios con su categoría y grupo
const todos = S.categorias.flatMap((c) => c.grupos.flatMap((g) => g.servicios.map((s) => ({ ...s, categoria: c.nombre, catId: c.id, grupo: g.nombre }))));

function tarjetaServicio(s) {
  const accion = s.href
    ? `<a href="${s.href}" class="btn btn-secondary">Ir al servicio<span class="sr-only"> ${MPU.esc(s.nombre)}</span></a>`
    : `<button type="button" data-iniciar="${MPU.esc(s.nombre)}" class="btn btn-primary">Iniciar solicitud<span class="sr-only"> ${MPU.esc(s.nombre)}</span></button>`;
  return `<div class="rounded-lg border border-surface p-4 flex flex-wrap items-center justify-between gap-3">
    <div class="min-w-0 flex-1">
      <div class="font-bold">${MPU.esc(s.nombre)}</div>
      <p class="text-small">${MPU.esc(s.desc)}</p>
    </div>${accion}</div>`;
}

function pintarServicios() {
  const q = plano($('buscar').value.trim());
  if (q) {
    const r = todos.filter((s) => plano(`${s.nombre} ${s.desc} ${s.grupo}`).includes(q));
    $('contador').textContent = `${r.length} ${r.length === 1 ? 'servicio encontrado' : 'servicios encontrados'}`;
    $('servicios').innerHTML = r.length
      ? r.map((s) => `<div><p class="text-small font-bold text-unab-text mb-1">${s.categoria} · ${s.grupo}</p>${tarjetaServicio(s)}</div>`).join('')
      : '<p class="py-6 text-center">No encontramos servicios con esa búsqueda.</p>';
    return;
  }
  const cat = S.categorias.find((c) => c.id === categoria);
  $('contador').textContent = '';
  $('servicios').innerHTML = cat.grupos.map((g, i) => `<details class="rounded-lg border border-surface" ${i === 0 ? 'open' : ''}>
    <summary class="cursor-pointer font-bold px-4 py-3">${g.nombre} <span class="text-small font-normal">(${g.servicios.length})</span></summary>
    <div class="px-4 pb-4 space-y-3">${g.servicios.map(tarjetaServicio).join('')}</div></details>`).join('');
}

function pintarTabs() {
  $('tabs').innerHTML = S.categorias.map((c) => `<button type="button" role="tab" data-cat="${c.id}" aria-selected="${c.id === categoria}"
    class="btn ${c.id === categoria ? 'btn-primary' : 'btn-secondary'}">${c.nombre}</button>`).join('');
}

function itemSolicitud(s) {
  const demo = s.estado === 'En trámite'
    ? `<button type="button" data-finalizar="${s.id}" class="font-bold text-unab-text hover:underline">Simular respuesta (demo)</button>
       <button type="button" data-cancelar="${s.id}" class="font-bold text-danger hover:underline">Cancelar</button>` : '';
  return `<li class="rounded-lg border border-surface p-3">
    <div class="font-bold">${MPU.esc(s.servicio)}</div>
    <div class="text-small">${s.radicado} · ${s.fecha} · ${MPU.badge(s.estado)}</div>
    ${demo ? `<div class="mt-2 flex flex-wrap gap-3 text-small">${demo}</div>` : ''}</li>`;
}

function pintarMias() {
  const l = misSolicitudes();
  const tramite = l.filter((s) => s.estado === 'En trámite');
  const final = l.filter((s) => s.estado !== 'En trámite');
  $('n-tramite').textContent = tramite.length;
  $('n-final').textContent = final.length;
  $('lista-tramite').innerHTML = tramite.length ? tramite.map(itemSolicitud).join('') : '<li class="text-small">Todavía no tienes solicitudes en trámite.</li>';
  $('lista-final').innerHTML = final.length ? final.map(itemSolicitud).join('') : '<li class="text-small">Todavía no tienes solicitudes finalizadas.</li>';
}

function cambiarEstado(id, estado) {
  guardar(misSolicitudes().map((s) => (s.id === id ? { ...s, estado } : s)));
  pintarMias();
}

$('tabs').addEventListener('click', (e) => {
  const b = e.target.closest('[data-cat]');
  if (!b) return;
  categoria = b.dataset.cat;
  $('buscar').value = '';
  pintarTabs();
  pintarServicios();
});
$('buscar').addEventListener('input', pintarServicios);

$('servicios').addEventListener('click', (e) => {
  const b = e.target.closest('[data-iniciar]');
  if (!b) return;
  const l = misSolicitudes();
  const nombre = b.dataset.iniciar;
  if (l.some((s) => s.servicio === nombre && s.estado === 'En trámite')) {
    return aviso(`Ya tienes una solicitud en trámite para «${nombre}».`);
  }
  const radicado = `SOL-${new Date().getFullYear()}-${String(l.length + 1).padStart(4, '0')}`;
  guardar([{ id: radicado, radicado, servicio: nombre, fecha: MPU.fecha(), estado: 'En trámite' }, ...l]);
  aviso(`Solicitud ${radicado} creada: «${nombre}». La encuentras en «En trámite».`);
  pintarMias();
});

document.querySelector('main').addEventListener('click', (e) => {
  const f = e.target.closest('[data-finalizar]');
  const c = e.target.closest('[data-cancelar]');
  if (f) { cambiarEstado(f.dataset.finalizar, 'Finalizada'); aviso('La solicitud pasó a «Finalizadas».'); }
  if (c) { cambiarEstado(c.dataset.cancelar, 'Cancelada'); aviso('La solicitud fue cancelada.'); }
});

pintarTabs();
pintarServicios();
pintarMias();
