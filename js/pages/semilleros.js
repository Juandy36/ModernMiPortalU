// Semilleros de investigación (Wireframe 9, funcionalidad 9): inscripción según cupos.
const inscritos = () => MPU.storage.get('semilleros:inscritos', []);
const estaInscrito = (id) => inscritos().includes(id);
// Al inscribirse se ocupa un cupo
const cuposDe = (s) => s.cupos - (estaInscrito(s.id) ? 1 : 0);

const facultades = [...new Set(MPU.semilleros.map((s) => s.facultad))];
document.getElementById('facultad').innerHTML =
  '<option value="">Todas las facultades</option>' + facultades.map((f) => `<option>${f}</option>`).join('');

function etiquetaCupos(n) {
  if (n <= 0) return '<span class="badge badge-danger">Sin cupos</span>';
  return `<span class="badge badge-ok">${n} ${n === 1 ? 'cupo' : 'cupos'}</span>`;
}

function pintar() {
  const filtro = document.getElementById('facultad').value;
  document.getElementById('lista').innerHTML = MPU.semilleros
    .filter((s) => !filtro || s.facultad === filtro)
    .map((s) => {
      const inscrito = estaInscrito(s.id);
      const sinCupo = cuposDe(s) <= 0 && !inscrito;
      const boton = inscrito
        ? '<button type="button" class="btn btn-secondary" disabled>Inscrito</button>'
        : `<button type="button" data-inscribir="${s.id}" class="btn btn-primary" ${sinCupo ? 'disabled' : ''}>Inscribirme</button>`;
      return `<article class="card flex flex-col gap-3">
        <h2 class="text-h3">${s.nombre}</h2>
        <p class="text-small">Facultad de ${s.facultad} · Docente líder por definir</p>
        <div>${etiquetaCupos(cuposDe(s))}</div>
        <div class="mt-auto">${boton}</div>
      </article>`;
    })
    .join('');

  const mios = MPU.semilleros.filter((s) => estaInscrito(s.id));
  document.getElementById('mis-inscripciones').innerHTML = mios
    .map((s) => `<li class="flex items-center justify-between gap-4">
      <span><strong>${s.nombre}</strong> · ${MPU.badge('Inscrito')}</span>
      <button type="button" data-cancelar="${s.id}" class="font-bold text-danger hover:underline">Cancelar inscripción</button></li>`)
    .join('');
  document.getElementById('sin-inscripciones').classList.toggle('hidden', mios.length > 0);
}

function avisar(texto) {
  document.getElementById('aviso').textContent = texto;
}

document.getElementById('facultad').addEventListener('change', pintar);

document.querySelector('main').addEventListener('click', (e) => {
  const ins = e.target.closest('[data-inscribir]');
  const can = e.target.closest('[data-cancelar]');
  if (ins) {
    const s = MPU.semilleros.find((x) => x.id === ins.dataset.inscribir);
    if (cuposDe(s) <= 0) return;
    MPU.storage.set('semilleros:inscritos', [...inscritos(), s.id]);
    avisar(`Te inscribiste en ${s.nombre}.`);
    pintar();
  } else if (can) {
    const s = MPU.semilleros.find((x) => x.id === can.dataset.cancelar);
    MPU.storage.set('semilleros:inscritos', inscritos().filter((id) => id !== s.id));
    avisar(`Cancelaste tu inscripción en ${s.nombre}.`);
    pintar();
  }
});

pintar();
