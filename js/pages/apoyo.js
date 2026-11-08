// Apoyo académico: Éxito Estudiantil, Lenguas, Competencias Digitales e Internacionalización.
const $ = (id) => document.getElementById(id);
const A = MPU.apoyo;
const pga = MPU.cursos.resumen().pga;
const fechaDe = (iso) => MPU.fecha(new Date(iso + 'T00:00:00'));
const num = (n) => String(n).replace('.', ',');
const talleres = () => MPU.storage.get('apoyo:talleres', []);
const mentoria = () => MPU.storage.get('apoyo:mentoria', null);
const monitoria = () => MPU.storage.get('apoyo:monitoria', null);
const cuposDe = (t) => t.cupos - (talleres().includes(t.id) ? 1 : 0);

const TABS = [
  { id: 'exito', nombre: 'Éxito Estudiantil' },
  { id: 'lenguas', nombre: 'Lenguas' },
  { id: 'competencias', nombre: 'Competencias digitales' },
  { id: 'internacional', nombre: 'Internacionalización' },
];
const hash = location.hash.slice(1);
let tab = TABS.some((t) => t.id === hash) ? hash : 'exito';

function aviso(msg, ok = true) {
  const el = $('aviso');
  el.textContent = msg;
  el.className = 'px-3 py-2 rounded-md font-semibold';
  el.style.background = ok ? '#E3F4EA' : '#FDECEA';
  el.style.color = ok ? '#1B5E38' : '#B42318';
}
const cumple = (ok, txt) => `<span class="badge ${ok ? 'badge-ok' : 'badge-danger'}">${ok ? 'Cumples' : 'No cumples'}</span> <span class="text-small">${txt}</span>`;

function pintarTabs() {
  $('tabs').innerHTML = TABS.map((t) => `<button type="button" role="tab" data-tab="${t.id}" aria-selected="${t.id === tab}"
    class="btn ${t.id === tab ? 'btn-primary' : 'btn-secondary'}">${t.nombre}</button>`).join('');
}

function panelExito() {
  const E = A.exito;
  const m = mentoria();
  const mon = monitoria();
  const eligible = pga >= E.monitoria.pgaMinimo;
  return `
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <article class="card flex flex-col gap-3"><h2 class="text-h3">Mentoría de facultad</h2>
      <p>${E.mentoria.desc}</p>
      <p class="text-small">Contacto: <a class="font-bold text-unab-text underline" href="mailto:${E.mentoria.correo}">${E.mentoria.correo}</a></p>
      <div class="mt-auto">${m ? `${MPU.badge('Solicitada')} <span class="text-small">el ${m.fecha}</span> <button type="button" data-accion="cancelar-mentoria" class="font-bold text-danger hover:underline ml-2">Cancelar</button>`
        : '<button type="button" data-accion="mentoria" class="btn btn-primary">Solicitar mentoría</button>'}</div></article>
    <article class="card flex flex-col gap-3"><h2 class="text-h3">Monitorías</h2>
      <p>${E.monitoria.desc}</p>
      <p>${cumple(eligible, `Tu PGA es ${num(pga.toFixed(2))} (mínimo ${num(E.monitoria.pgaMinimo.toFixed(1))}).`)}</p>
      <div class="mt-auto">${mon ? `${MPU.badge('Postulado')} <button type="button" data-accion="cancelar-monitoria" class="font-bold text-danger hover:underline ml-2">Retirar postulación</button>`
        : `<button type="button" data-accion="monitoria" class="btn btn-primary" ${eligible ? '' : 'disabled'}>Postularme como monitor</button>`}</div></article>
  </div>
  <section class="card"><h2 class="text-h3 mb-4">Talleres académicos</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">${E.talleres.map((t) => {
    const ins = talleres().includes(t.id);
    const sin = cuposDe(t) <= 0 && !ins;
    return `<div class="rounded-lg border border-surface p-4 flex flex-col gap-2">
        <div class="font-bold">${MPU.esc(t.nombre)}</div>
        <div class="text-small">${fechaDe(t.fecha)} · ${t.hora}</div>
        <div>${cuposDe(t) <= 0 ? '<span class="badge badge-danger">Sin cupos</span>' : `<span class="badge badge-ok">${cuposDe(t)} cupos</span>`}</div>
        ${ins ? `${MPU.badge('Inscrito')}<button type="button" data-taller-cancelar="${t.id}" class="font-bold text-danger hover:underline text-left">Cancelar inscripción</button>`
        : `<button type="button" data-taller="${t.id}" class="btn btn-primary self-start" ${sin ? 'disabled' : ''}>Inscribirme<span class="sr-only"> en ${MPU.esc(t.nombre)}</span></button>`}</div>`;
  }).join('')}</div></section>
  <section class="card"><h2 class="text-h3 mb-2">Banco de parciales</h2>
    <p class="text-small mb-3">Parciales de años anteriores para practicar. Cursos disponibles:</p>
    <ul class="flex flex-wrap gap-2">${E.parciales.map((c) => `<li class="badge" style="background:#FFF3D6;color:#A35F00;border:1px solid #FFA400">${c}</li>`).join('')}</ul></section>`;
}

function panelLenguas() {
  const L = A.lenguas;
  return `
  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">${L.idiomas.map((i) => `<article class="card"><h2 class="text-h3">${i.nombre}</h2><p class="text-small mt-2">${i.nota}</p></article>`).join('')}</div>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <section class="card"><h2 class="text-h3 mb-2">Otros servicios</h2><ul class="list-disc pl-6 space-y-1">${L.extras.map((e) => `<li>${e}</li>`).join('')}</ul>
      <h3 class="font-bold mt-4 mb-1">Centro autorizado para presentar</h3>
      <ul class="flex flex-wrap gap-2">${L.pruebas.map((p) => `<li class="badge" style="background:#FFF3D6;color:#A35F00;border:1px solid #FFA400">${p}</li>`).join('')}</ul></section>
    <section class="card"><h2 class="text-h3 mb-2">Mi requisito de inglés</h2>
      <p>Inglés es requisito de grado. Revisa tu avance en <a href="grado.html" class="font-bold text-unab-text underline">Mi grado</a> y consulta tus cursos en <a href="cursos.html" class="font-bold text-unab-text underline">Cursos y proyección</a>.</p>
      <p class="text-small mt-3">${L.contacto}</p></section>
  </div>`;
}

function panelCompetencias() {
  const C = A.competencias;
  const total = C.ruta.flatMap((r) => r.cursos);
  const hechos = C.aprobados.length;
  const pct = Math.min(100, Math.round((hechos / C.cursosParaInsignia) * 100));
  return `
  <section class="card"><h2 class="text-h3 mb-2">Mi avance hacia la insignia</h2>
    <p class="text-h2 text-unab-text">${hechos} de ${C.cursosParaInsignia} cursos</p>
    <div role="progressbar" aria-label="Avance hacia la insignia de competencias digitales" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}" class="h-4 rounded-full bg-surface overflow-hidden mt-2"><div class="h-full bg-unab" style="width:${pct}%"></div></div>
    <p class="text-small mt-2">Cada curso dura ${C.horasPorCurso} horas y se califica como aprobado o no aprobado. Al completar ${C.cursosParaInsignia} cursos obtienes la Insignia de Competencias Digitales UNAB. Avance de ejemplo.</p></section>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">${C.ruta.map((r, i) => `<article class="card"><h3 class="text-h3">${i + 1}. ${r.nivel}</h3>
    <ul class="mt-3 space-y-2">${r.cursos.map((c) => `<li class="flex items-center justify-between gap-2"><span>${c}</span>${C.aprobados.includes(c) ? MPU.badge('Aprobado') : '<span class="badge" style="background:#F4F4F4;color:#333;border:1px solid #8C8C8C">Pendiente</span>'}</li>`).join('')}</ul></article>`).join('')}</div>
  <p class="text-small">${total.length} cursos en la ruta, alineada a DigComp.</p>`;
}

function panelInternacional() {
  return `<div class="grid grid-cols-1 md:grid-cols-2 gap-6">${A.internacional.map((o) => `<article class="card flex flex-col gap-2">
    <h2 class="text-h3">${o.nombre}</h2><p class="text-small">${o.detalle}</p>
    <p>${o.pga ? cumple(pga >= o.pga, `PGA mínimo ${num(o.pga.toFixed(1))}; el tuyo es ${num(pga.toFixed(2))}.`) : '<span class="badge badge-ok">Abierto a todos</span>'}</p></article>`).join('')}</div>`;
}

function pintar() {
  pintarTabs();
  $('panel').innerHTML = { exito: panelExito, lenguas: panelLenguas, competencias: panelCompetencias, internacional: panelInternacional }[tab]();
}

$('tabs').addEventListener('click', (e) => {
  const b = e.target.closest('[data-tab]');
  if (!b) return;
  tab = b.dataset.tab;
  history.replaceState(null, '', '#' + tab);
  pintar();
});
$('panel').addEventListener('click', (e) => {
  const t = (s) => e.target.closest(s);
  if (t('[data-accion="mentoria"]')) { MPU.storage.set('apoyo:mentoria', { fecha: MPU.fecha() }); aviso('Solicitaste mentoría. Un mentor de tu facultad te contactará.'); }
  else if (t('[data-accion="cancelar-mentoria"]')) { MPU.storage.set('apoyo:mentoria', null); aviso('Cancelaste tu solicitud de mentoría.'); }
  else if (t('[data-accion="monitoria"]')) { MPU.storage.set('apoyo:monitoria', { fecha: MPU.fecha() }); aviso('Te postulaste como monitor.'); }
  else if (t('[data-accion="cancelar-monitoria"]')) { MPU.storage.set('apoyo:monitoria', null); aviso('Retiraste tu postulación.'); }
  else if (t('[data-taller]')) {
    const id = t('[data-taller]').dataset.taller;
    const taller = A.exito.talleres.find((x) => x.id === id);
    MPU.storage.set('apoyo:talleres', [...talleres(), id]); aviso(`Te inscribiste en «${taller.nombre}».`);
  } else if (t('[data-taller-cancelar]')) {
    const id = t('[data-taller-cancelar]').dataset.tallerCancelar;
    MPU.storage.set('apoyo:talleres', talleres().filter((x) => x !== id)); aviso('Cancelaste tu inscripción al taller.');
  } else return;
  pintar();
});
pintar();
