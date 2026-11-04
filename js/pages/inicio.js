// Pantalla de inicio (Wireframe 1): arma las secciones con los datos de ejemplo.
const ACCESOS = [
  { label: 'Matrícula y turnos', href: 'pages/turnos.html' },
  { label: 'Certificados', href: 'pages/chat.html' },
  { label: 'Mi horario', href: 'pages/horario.html' },
  { label: 'Becas y promedio', href: 'pages/becas.html' },
  { label: 'Reservas CSU', href: 'pages/reservas-csu.html' },
  { label: 'Semilleros', href: 'pages/semilleros.html' },
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
  <div class="text-h1 text-unab-dark">${MPU.nota(b.promedioActual)}</div>
  <div>promedio actual</div>
  <div class="text-small">Promedio mínimo para mantener la beca: ${MPU.nota(b.minimoRequerido)}</div>
  <div class="text-small">Rendimiento: ${b.rendimiento} %</div>
  <a class="btn btn-secondary mt-3" href="pages/becas.html">Ver detalle</a>`;

document.getElementById('deportes-inicio').innerHTML = MPU.deportes.resultados
  .map((r) => `<tr><td>${r.torneo}</td><td>${r.disciplina}</td><td>${r.encuentro}</td><td>${r.resultado}</td></tr>`)
  .join('');

// El buscador filtra los accesos rápidos por texto.
document.getElementById('buscador').addEventListener('input', (e) => {
  const q = e.target.value.trim().toLowerCase();
  document.querySelectorAll('#accesos a').forEach((a) => {
    a.style.display = !q || a.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
});
