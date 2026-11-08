// Aulas y equipos: disponibilidad por campus > bloque > tipo de espacio, y reserva de equipos.
const $ = (id) => document.getElementById(id);
const E = MPU.espacios;
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const hoy = () => iso(new Date());
const fechaDe = (s) => MPU.fecha(new Date(s + 'T00:00:00'));
const franjaTxt = (f) => `${f} – ${String(Number(f.slice(0, 2)) + 2).padStart(2, '0')}:00`;

// ===== Disponibilidad de aulas =====
$('a-campus').innerHTML = E.campus.map((c) => `<option value="${c.id}">${c.nombre}</option>`).join('');
$('a-tipo').innerHTML = '<option value="">Todos los espacios</option>' + E.tipos.map((t) => `<option>${t}</option>`).join('');
$('a-fecha').value = hoy();

function llenarBloques() {
  const c = E.campus.find((x) => x.id === $('a-campus').value);
  $('a-bloque').innerHTML = c.bloques.map((b) => `<option>${b}</option>`).join('');
}

function pintarAulas() {
  const fecha = $('a-fecha').value || hoy();
  const espacios = E.deBloque($('a-campus').value, $('a-bloque').value);
  const tipo = $('a-tipo').value;
  const q = $('a-buscar').value.trim().toLowerCase();
  const ahora = new Date();
  const hh = ahora.getHours();

  const estados = espacios.map((e) => E.estado(e, fecha));
  $('k-total').textContent = espacios.length;
  $('k-disp').textContent = estados.filter((s) => s === 'Disponible').length;
  $('k-parcial').textContent = estados.filter((s) => s === 'Parcial').length;
  $('k-reservado').textContent = estados.filter((s) => s === 'Reservado').length;

  const visibles = espacios.filter((e) => (!tipo || e.tipo === tipo) && (!q || e.codigo.toLowerCase().includes(q)));
  $('a-contador').textContent = `${visibles.length} ${visibles.length === 1 ? 'espacio' : 'espacios'} · ${fechaDe(fecha)}`;
  $('espacios').innerHTML = visibles.length ? visibles.map((e) => {
    const est = E.estado(e, fecha);
    const insignia = est === 'Disponible' ? '<span class="badge badge-ok">Disponible</span>'
      : est === 'Reservado' ? '<span class="badge badge-danger">Reservado</span>' : '<span class="badge badge-pending">Parcial</span>';
    const chips = E.franjas.map((f) => {
      const pasada = fecha < hoy() || (fecha === hoy() && Number(f.slice(0, 2)) + 2 <= hh);
      const ocup = E.ocupada(e, fecha, f);
      const estilo = pasada ? 'background:#F4F4F4;color:#333;border:1px solid #8C8C8C' : ocup ? 'background:#D64545;color:#fff' : 'background:#23794A;color:#fff';
      const txt = pasada ? 'Finalizada' : ocup ? 'Ocupada' : 'Libre';
      return `<span class="badge" style="${estilo}" title="${txt}"><span class="sr-only">${franjaTxt(f)}: ${txt}. </span><span aria-hidden="true">${f}</span></span>`;
    }).join(' ');
    return `<article class="rounded-lg border border-surface p-4">
      <div class="flex items-start justify-between gap-3">
        <div><h3 class="text-h3">${e.codigo}</h3><p class="text-small">${e.tipo} · Capacidad ${e.capacidad}</p></div>${insignia}</div>
      <div class="mt-3 flex flex-wrap gap-1">${chips}</div></article>`;
  }).join('') : '<p class="md:col-span-2 py-6 text-center">No hay espacios con esa búsqueda.</p>';
}

$('a-campus').addEventListener('change', () => { llenarBloques(); pintarAulas(); });
['a-bloque', 'a-tipo', 'a-fecha'].forEach((id) => $(id).addEventListener('change', pintarAulas));
$('a-buscar').addEventListener('input', pintarAulas);
llenarBloques();
pintarAulas();

// ===== Reserva de equipos =====
$('e-sede').innerHTML = E.sedesEquipos.map((s) => `<option value="${s.id}">${s.nombre}</option>`).join('');
$('e-equipo').innerHTML = E.equipos.map((x) => `<option>${x}</option>`).join('');
$('e-franja').innerHTML = E.franjas.map((f) => `<option value="${f}">${franjaTxt(f)}</option>`).join('');
$('e-fecha').min = hoy();
$('e-fecha').value = hoy();
const reservas = () => MPU.storage.get('espacios:equipos', []);

function avisoEquipo(msg, ok = true) {
  const el = $('e-aviso');
  el.textContent = msg;
  el.className = 'px-3 py-2 rounded-md font-semibold';
  el.style.background = ok ? '#E3F4EA' : '#FDECEA';
  el.style.color = ok ? '#1B5E38' : '#B42318';
}

function pintarEquipos() {
  const l = reservas();
  $('sin-equipos').classList.toggle('hidden', l.length > 0);
  $('mis-equipos').innerHTML = l.map((r) => `<li class="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-surface p-3">
    <span><strong>${MPU.esc(r.equipo)}</strong> · ${MPU.esc(r.sede)}<br><span class="text-small">${fechaDe(r.fecha)} · ${franjaTxt(r.franja)}</span></span>
    <span>${MPU.badge('Aprobada')} <button type="button" data-cancelar="${r.id}" class="font-bold text-danger hover:underline ml-2">Cancelar</button></span></li>`).join('');
}

$('form-equipo').addEventListener('submit', (e) => {
  e.preventDefault();
  const sedeId = $('e-sede').value;
  const nueva = {
    id: Date.now(),
    sedeId,
    sede: E.sedesEquipos.find((s) => s.id === sedeId).nombre,
    equipo: $('e-equipo').value, fecha: $('e-fecha').value, franja: $('e-franja').value,
  };
  if (!nueva.fecha || nueva.fecha < hoy()) return avisoEquipo('Elige una fecha de hoy en adelante.', false);
  if (nueva.fecha === hoy() && Number(nueva.franja.slice(0, 2)) + 2 <= new Date().getHours()) return avisoEquipo('Esa franja ya finalizó. Elige otra.', false);
  if (reservas().some((r) => r.sedeId === sedeId && r.equipo === nueva.equipo && r.fecha === nueva.fecha && r.franja === nueva.franja)) {
    return avisoEquipo('Ya reservaste ese equipo en esa sede, fecha y franja.', false);
  }
  MPU.storage.set('espacios:equipos', [...reservas(), nueva]);
  avisoEquipo(`Reserva creada: ${nueva.equipo} en ${nueva.sede}, ${fechaDe(nueva.fecha)} (${franjaTxt(nueva.franja)}).`);
  pintarEquipos();
});

$('mis-equipos').addEventListener('click', (e) => {
  const b = e.target.closest('[data-cancelar]');
  if (!b) return;
  MPU.storage.set('espacios:equipos', reservas().filter((r) => String(r.id) !== b.dataset.cancelar));
  avisoEquipo('Reserva cancelada.');
  pintarEquipos();
});
pintarEquipos();
