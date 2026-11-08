// Pantalla de inicio (Wireframe 1): arma las secciones con los datos de ejemplo.
const ACCESOS = [
  { label: 'Mi horario', href: 'pages/horario.html' },
  { label: 'Cursos y proyección', href: 'pages/cursos.html' },
  { label: 'Calificaciones', href: 'pages/calificaciones.html' },
  { label: 'Matrícula y turnos', href: 'pages/turnos.html' },
  { label: 'Solicitudes', href: 'pages/solicitudes.html' },
  { label: 'Pagos y fechas', href: 'pages/pagos.html' },
  { label: 'Horas libres', href: 'pages/horas-libres.html' },
  { label: 'Becas y promedio', href: 'pages/becas.html' },
];

document.getElementById('accesos').innerHTML = ACCESOS.map(
  (a) => `<a href="${a.href}" class="card text-center font-bold hover:bg-unab-cream">${a.label}</a>`
).join('');

document.getElementById('horario-hoy').innerHTML = MPU.horario
  .map((c) => `<tr><td>${c.hora}</td><td>${c.asignatura}</td><td>${c.salon}</td><td>${c.docente}</td><td>${MPU.badge(c.estado)}</td></tr>`)
  .join('');

document.getElementById('noticias-inicio').innerHTML = MPU.noticias
  .slice(0, 3)
  .map((n) => `<li><div class="text-small">${n.fecha}</div><a href="pages/noticias.html" class="font-semibold hover:underline">${n.titulo}</a></li>`)
  .join('');

const b = MPU.beca;
document.getElementById('beca-inicio').innerHTML = `
  <div class="text-h1 text-unab-text">${MPU.nota(b.promedioActual)}</div>
  <div>promedio actual</div>
  <div class="text-small">Promedio mínimo para mantener la beca: ${MPU.nota(b.minimoRequerido)}</div>
  <div class="text-small">Rendimiento: ${b.rendimiento} %</div>
  <a class="btn btn-secondary mt-3" href="pages/becas.html">Ver detalle</a>`;

document.getElementById('deportes-inicio').innerHTML = MPU.deportes.resultados
  .slice(0, 3)
  .map((r) => `<tr><td>${r.torneo}</td><td>${r.disciplina}</td><td>${r.encuentro}</td><td>${r.resultado}</td></tr>`)
  .join('');

// El buscador filtra los accesos rápidos por texto.
document.getElementById('buscador').addEventListener('input', (e) => {
  const q = e.target.value.trim().toLowerCase();
  document.querySelectorAll('#accesos a').forEach((a) => {
    a.style.display = !q || a.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
});

// Progreso para el grado
const pctGrado = MPU.grado.porcentaje();
document.getElementById('grado-pct').textContent = pctGrado + ' %';
document.getElementById('grado-barra').setAttribute('aria-valuenow', pctGrado);
document.getElementById('grado-barra').setAttribute('aria-valuetext', pctGrado + ' % del camino al grado');
document.getElementById('grado-relleno').style.width = pctGrado + '%';
document.getElementById('grado-lista').innerHTML = MPU.grado.requisitos()
  .map((r) => `<li>${r.estado === 'ok' ? '✔' : '○'} ${r.nombre}: ${MPU.esc(r.detalle)}</li>`).join('');

// Horas libres: progreso y próximas actividades
const hlr = MPU.horasLibres.resumen();
document.getElementById('hl-total').textContent = `${hlr.cumplidas} de ${hlr.meta} h`;
document.getElementById('hl-barra').setAttribute('aria-valuenow', Math.min(hlr.cumplidas, hlr.meta));
document.getElementById('hl-barra').setAttribute('aria-valuetext', `${hlr.cumplidas} de ${hlr.meta} horas`);
document.getElementById('hl-relleno').style.width = hlr.pct + '%';
const hoyIso = new Date().toISOString().slice(0, 10);
document.getElementById('hl-proximas').innerHTML = MPU.horasLibres.actividades
  .filter((a) => a.fecha >= hoyIso).slice(0, 3)
  .map((a) => `<li><strong>${MPU.fecha(new Date(a.fecha + 'T00:00:00'))}</strong> · ${MPU.esc(a.nombre)} · ${a.horas} h (${a.modalidad})</li>`).join('')
  || '<li>No hay actividades próximas.</li>';
