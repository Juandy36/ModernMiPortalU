// Cursos y proyección: avance curricular, cursos inscritos, proyección del próximo periodo y plan.
const $ = (id) => document.getElementById(id);
const C = MPU.cursos;
const fechaDe = (iso) => MPU.fecha(new Date(iso + 'T00:00:00'));
const num = (n) => String(n).replace('.', ',');

// --- Avance ---
const r = C.resumen();
const pct = Math.round((r.creditosAprobados / r.creditosTotales) * 100);
$('r-semestre').textContent = C.semestreActual;
$('r-creditos').textContent = `${r.creditosAprobados} / ${r.creditosTotales}`;
$('r-pga').textContent = num(r.pga.toFixed(2));
$('r-faltan').textContent = r.creditosTotales - r.creditosAprobados - r.creditosEnCurso;
$('barra').setAttribute('aria-valuenow', pct);
$('barra').setAttribute('aria-valuetext', `${pct} % del plan de estudios`);
$('barra-relleno').style.width = pct + '%';
$('avance-texto').textContent =
  `${pct} % del plan aprobado. Cursas ${r.creditosEnCurso} créditos este periodo. Datos de ejemplo.`;

// --- Cursos inscritos ---
const enCurso = C.lista.filter((c) => c.estado === 'curso');
$('inscritos-sub').textContent = `Periodo ${C.periodoActual} · ${enCurso.reduce((t, c) => t + c.creditos, 0)} créditos`;
$('inscritos').innerHTML = enCurso.map((c) => `<tr>
  <td>${c.codigo}</td><td>${MPU.esc(c.nombre)}</td><td>${c.creditos}</td><td>${fechaDe(C.inicio)}</td><td>${fechaDe(C.fin)}</td></tr>`).join('');

// --- Proyección ---
// Recomendada: todos los cursos del semestre siguiente. Disponibles: pendientes de ese semestre y del siguiente.
const siguiente = C.semestreActual + 1;
const recomendados = C.lista.filter((c) => c.semestre === siguiente).map((c) => c.codigo);
const disponibles = C.lista.filter((c) => c.estado === 'pendiente' && c.semestre <= siguiente + 1);
const guardada = () => MPU.storage.get('cursos:proyeccion', null);
let elegidos = new Set(guardada() || recomendados);

$('proy-sub').textContent = `Periodo ${C.periodoSiguiente} · máximo ${C.maxCreditos} créditos`;

function creditosElegidos() {
  return C.lista.filter((c) => elegidos.has(c.codigo)).reduce((t, c) => t + c.creditos, 0);
}

function pintarProyeccion() {
  $('proy-lista').innerHTML = disponibles.map((c) => `<li class="py-2">
    <label class="flex items-center gap-3 cursor-pointer">
      <input type="checkbox" data-cod="${c.codigo}" class="w-5 h-5 accent-[#FFA400]" ${elegidos.has(c.codigo) ? 'checked' : ''}>
      <span class="flex-1"><strong>${MPU.esc(c.nombre)}</strong>
        <span class="block text-small">${c.codigo} · Semestre ${c.semestre}${recomendados.includes(c.codigo) ? ' · Recomendado' : ''}</span></span>
      <span class="text-small font-bold">${c.creditos} cr.</span>
    </label></li>`).join('');
  const total = creditosElegidos();
  $('proy-total').textContent = `Total proyectado: ${total} de ${C.maxCreditos} créditos`;
  $('proy-total').style.color = total > C.maxCreditos ? '#B42318' : '';
}

$('proy-lista').addEventListener('change', (e) => {
  const cod = e.target.dataset.cod;
  if (!cod) return;
  e.target.checked ? elegidos.add(cod) : elegidos.delete(cod);
  $('proy-error').classList.add('hidden');
  $('proy-aviso').textContent = '';
  pintarProyeccion();
});
$('proy-recomendada').addEventListener('click', () => {
  elegidos = new Set(recomendados);
  $('proy-aviso').textContent = 'Se cargó la matrícula recomendada del semestre ' + siguiente + '.';
  pintarProyeccion();
});
$('proy-guardar').addEventListener('click', () => {
  const error = $('proy-error');
  if (!elegidos.size) { error.textContent = 'Elige al menos un curso para proyectar.'; error.classList.remove('hidden'); return; }
  if (creditosElegidos() > C.maxCreditos) {
    error.textContent = `Superas el máximo de ${C.maxCreditos} créditos por periodo. Quita algún curso.`;
    error.classList.remove('hidden');
    return;
  }
  error.classList.add('hidden');
  MPU.storage.set('cursos:proyeccion', [...elegidos]);
  $('proy-aviso').textContent = `Proyección guardada (${elegidos.size} cursos, ${creditosElegidos()} créditos).`;
});
pintarProyeccion();

// --- Plan de estudios (un desplegable por semestre) ---
const semestres = [...new Set(C.lista.map((c) => c.semestre))];
$('plan').innerHTML = semestres.map((s) => {
  const cursos = C.lista.filter((c) => c.semestre === s);
  const abierto = s === C.semestreActual ? ' open' : '';
  return `<details class="card p-0 overflow-hidden"${abierto}>
    <summary class="cursor-pointer font-bold text-h3 px-6 py-4">Semestre ${s}
      <span class="text-small font-normal"> · ${cursos.reduce((t, c) => t + c.creditos, 0)} créditos</span></summary>
    <div class="tabla-scroll px-6 pb-4"><table class="table">
      <thead><tr><th>Código</th><th>Curso</th><th>Créditos</th><th>Nota</th><th>Estado</th></tr></thead>
      <tbody>${cursos.map((c) => `<tr><td>${c.codigo}</td><td>${MPU.esc(c.nombre)}</td><td>${c.creditos}</td>
        <td>${c.nota === null ? '—' : num(c.nota.toFixed(1))}</td>
        <td>${c.estado === 'aprobado' ? MPU.badge('Aprobado') : c.estado === 'curso' ? '<span class="badge badge-pending">En curso</span>' : '<span class="badge" style="background:#F4F4F4;color:#333;border:1px solid #8C8C8C">Pendiente</span>'}</td></tr>`).join('')}
      </tbody></table></div></details>`;
}).join('');
