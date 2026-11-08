// Mi grado: requisitos con progreso y fechas relacionadas.
const $ = (id) => document.getElementById(id);
const G = MPU.grado;
const etiqueta = {
  ok: MPU.badge('Cumplido'),
  proceso: '<span class="badge badge-pending">En proceso</span>',
  pendiente: '<span class="badge" style="background:#F4F4F4;color:#333;border:1px solid #8C8C8C">Pendiente</span>',
};

const pct = G.porcentaje();
$('global-pct').textContent = pct + ' %';
$('global-barra').setAttribute('aria-valuenow', pct);
$('global-barra').setAttribute('aria-valuetext', `${pct} % del camino al grado`);
$('global-relleno').style.width = pct + '%';

$('requisitos').innerHTML = G.requisitos().map((r) => {
  const p = Math.round(r.avance * 100);
  return `<article class="card flex flex-col gap-3">
    <div class="flex items-start justify-between gap-3"><h3 class="text-h3">${r.nombre}</h3>${etiqueta[r.estado]}</div>
    <div role="progressbar" aria-label="${r.nombre}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${p}" class="h-3 rounded-full bg-surface overflow-hidden">
      <div class="h-full bg-unab" style="width:${p}%"></div></div>
    <p class="text-small">${MPU.esc(r.detalle)}</p>
    <div class="mt-auto"><a href="${r.href}" class="font-bold text-unab-text hover:underline">Ver detalle<span class="sr-only"> de ${r.nombre}</span></a></div>
  </article>`;
}).join('');

const fechaDe = (iso) => MPU.fecha(new Date(iso + 'T00:00:00'));
$('fechas').innerHTML = MPU.cronogramas.eventos
  .filter((e) => /grado|tesis/i.test(e.evento) && e.nivel === 'Pregrado profesional')
  .map((e) => `<li><strong>${MPU.esc(e.evento)}</strong> · ${fechaDe(e.inicio)} – ${fechaDe(e.fin)}</li>`).join('')
  || '<li>No hay fechas de grado publicadas.</li>';
