// Calificaciones: resumen, promedio por semestre, cortes del periodo actual, notas y certificado.
const $ = (id) => document.getElementById(id);
const C = MPU.cursos;
const n1 = (n) => String(n.toFixed(1)).replace('.', ',');
const n2 = (n) => String(n.toFixed(2)).replace('.', ',');
const pendiente = '<span class="badge" style="background:#F4F4F4;color:#333;border:1px solid #8C8C8C">Pendiente</span>';
const semestresCerrados = [...new Set(C.lista.filter((c) => c.estado === 'aprobado').map((c) => c.semestre))];

// --- Resumen ---
const r = C.resumen();
const proms = semestresCerrados.map((s) => ({ s, p: C.promedioSemestre(s) }));
const mejor = proms.reduce((a, b) => (b.p > a.p ? b : a));
const ultimo = proms[proms.length - 1];
$('k-pga').textContent = n2(r.pga);
$('k-creditos').textContent = `${r.creditosAprobados} / ${r.creditosTotales}`;
$('k-mejor').textContent = `${n2(mejor.p)} (sem. ${mejor.s})`;
$('k-ultimo').textContent = `${n2(ultimo.p)} (sem. ${ultimo.s})`;

// --- Promedio por semestre (barras sobre escala 0–5; la línea es la nota mínima) ---
$('evolucion').innerHTML = proms.map(({ s, p }) => `<li class="flex items-center gap-3">
  <span class="w-24 text-small font-bold shrink-0">Semestre ${s}</span>
  <div class="relative flex-1 h-5 rounded bg-surface overflow-hidden" role="img" aria-label="Semestre ${s}: promedio ${n2(p)} de 5,0">
    <div class="h-full bg-unab" style="width:${(p / 5) * 100}%"></div>
    <div class="absolute top-0 bottom-0 w-0.5 bg-ink" style="left:${(C.notaMinima / 5) * 100}%"></div>
  </div>
  <span class="w-12 text-right font-bold">${n2(p)}</span></li>`).join('');

// --- Cortes del periodo actual ---
function paraAprobar(c) {
  const a = C.avanceCortes(c);
  if (a.resta === 0) return a.acum >= C.notaMinima ? MPU.badge('Aprobado') : '<span class="badge badge-danger">Reprobado</span>';
  if (a.necesita <= 0) return `${MPU.badge('Aprobado')} <span class="text-small">ya alcanzaste 3,0</span>`;
  if (a.necesita > 5) return '<span class="badge badge-danger">No alcanzable</span>';
  const riesgo = a.necesita > 4;
  return `<span class="badge ${riesgo ? 'badge-danger' : 'badge-pending'}">${riesgo ? 'En riesgo' : 'En curso'}</span>
    <span class="text-small">necesitas ${n1(a.necesita)} en lo que resta</span>`;
}
$('cortes').innerHTML = C.lista.filter((c) => c.estado === 'curso').map((c) => {
  const a = C.avanceCortes(c);
  const celda = (v) => (v === null ? '—' : n1(v));
  return `<tr><td>${MPU.esc(c.nombre)}</td><td>${celda(c.cortes[0])}</td><td>${celda(c.cortes[1])}</td><td>${celda(c.cortes[2])}</td>
    <td>${a.pesoCalif ? n2(a.acum) + ` <span class="text-small">(${Math.round(a.pesoCalif * 100)} %)</span>` : '—'}</td><td>${paraAprobar(c)}</td></tr>`;
}).join('');

// --- Notas por semestre ---
$('semestre').innerHTML = [...new Set(C.lista.map((c) => c.semestre))]
  .map((s) => `<option value="${s}">Semestre ${s}${s === C.semestreActual ? ' (actual)' : ''}</option>`).join('');
$('semestre').value = String(ultimo.s);

function pintarNotas() {
  const s = Number($('semestre').value);
  const lista = C.lista.filter((c) => c.semestre === s);
  $('notas').innerHTML = lista.map((c) => `<tr><td>${c.codigo}</td><td>${MPU.esc(c.nombre)}</td><td>${c.creditos}</td>
    <td>${c.nota === null ? '—' : n1(c.nota)}</td>
    <td>${c.estado === 'aprobado' ? MPU.badge('Aprobado') : c.estado === 'curso' ? '<span class="badge badge-pending">En curso</span>' : pendiente}</td></tr>`).join('');
  const p = C.promedioSemestre(s);
  $('notas-prom').textContent = p === null ? 'Este semestre aún no tiene notas finales.' : `Promedio del semestre: ${n2(p)}`;
}
$('semestre').addEventListener('change', pintarNotas);
pintarNotas();

// --- Certificado de notas: solo el documento, sin encabezado extra ---
$('btn-cert').addEventListener('click', () => {
  const filas = C.lista.filter((c) => c.estado === 'aprobado')
    .map((c) => `<tr><td>${c.semestre}</td><td>${c.codigo}</td><td>${MPU.esc(c.nombre)}</td><td>${c.creditos}</td><td>${n1(c.nota)}</td></tr>`).join('');
  MPU.imprimir('Certificado de notas', `
    <h1 style="font-size: 24px; font-weight: 800; margin-bottom: 4px;">Certificado de notas</h1>
    <p style="margin-bottom: 14px;">${MPU.esc(MPU.usuario.nombre)} · ${MPU.esc(C.programa)}</p>
    <table><thead><tr><th>Sem.</th><th>Código</th><th>Curso</th><th>Créditos</th><th>Nota</th></tr></thead><tbody>${filas}</tbody></table>
    <p style="margin-top: 14px; font-weight: 700;">Créditos aprobados: ${r.creditosAprobados} · Promedio acumulado: ${n2(r.pga)}</p>`);
});
