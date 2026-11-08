// Horario y estado de clase (Wireframe 4, funcionalidades 3 y 7).
const DIAS = Object.keys(MPU.horarioSemana);
let diaActivo = MPU.storage.get('horario:dia', 'Lun');
if (!DIAS.includes(diaActivo)) diaActivo = 'Lun';

function pintarDias() {
  document.getElementById('dias').innerHTML = DIAS.map(
    (d) => `<button type="button" role="tab" aria-selected="${d === diaActivo}" data-dia="${d}"
      class="btn ${d === diaActivo ? 'btn-primary' : 'btn-secondary'}">${d}</button>`
  ).join('');
}

function pintarClases() {
  const clases = MPU.horarioSemana[diaActivo];
  document.getElementById('clases').innerHTML = clases
    .map((c) => {
      const estado = c.detalle ? `${c.estado} ${c.detalle}` : c.estado;
      return `<tr><td>${c.hora}</td><td>${c.asignatura}</td><td>${c.salon}</td><td>${c.docente}</td><td>${MPU.badge(estado)}</td></tr>`;
    })
    .join('');
  document.getElementById('sin-clases').classList.toggle('hidden', clases.length > 0);
}

document.getElementById('dias').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-dia]');
  if (!btn) return;
  diaActivo = btn.dataset.dia;
  MPU.storage.set('horario:dia', diaActivo);
  pintarDias();
  pintarClases();
});

// Horas libres
const horas = MPU.horasLibresSemana();
document.getElementById('horas-libres').textContent =
  `${String(horas).replace('.', ',')} h por semana (dato de ejemplo)`;

// Avisos (se recuerda la preferencia)
const btnAvisos = document.getElementById('btn-avisos');
function pintarAvisos() {
  const on = MPU.storage.get('horario:avisos', false);
  btnAvisos.textContent = on ? 'Avisos activados' : 'Activar avisos';
  btnAvisos.classList.toggle('btn-primary', !on);
  btnAvisos.classList.toggle('btn-secondary', on);
  btnAvisos.setAttribute('aria-pressed', String(on));
}
btnAvisos.addEventListener('click', () => {
  MPU.storage.set('horario:avisos', !MPU.storage.get('horario:avisos', false));
  pintarAvisos();
});

// PDF: se imprime solo una tabla con el horario de toda la semana (sin estados, que cambian a diario).
document.getElementById('btn-pdf').addEventListener('click', () => {
  const filas = DIAS.flatMap((dia) =>
    MPU.horarioSemana[dia].map(
      (c, i) => `<tr><td>${i === 0 ? `<strong>${dia}</strong>` : ''}</td><td>${c.hora}</td><td>${c.asignatura}</td><td>${c.salon}</td><td>${c.docente}</td></tr>`
    )
  );
  MPU.imprimir(
    'Horario de clases',
    `<table>
      <thead><tr><th>Día</th><th>Hora</th><th>Asignatura</th><th>Salón</th><th>Docente</th></tr></thead>
      <tbody>${filas.join('')}</tbody>
    </table>`
  );
});

pintarDias();
pintarClases();
pintarAvisos();
