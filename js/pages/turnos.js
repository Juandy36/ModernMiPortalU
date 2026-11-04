// Solicitud de cambio de turno (Wireframe 5, funcionalidad 4).
const T = MPU.turnos;
const misSolicitudes = () => MPU.storage.get('turnos:solicitudes', []);

document.getElementById('turno-actual').textContent = T.actual;
document.getElementById('turno-deseado').innerHTML =
  '<option value="">Selecciona un turno</option>' +
  T.opciones.filter((t) => t !== T.actual).map((t) => `<option>${t}</option>`).join('');

function pintarSolicitudes() {
  // Las nuevas primero, luego las de ejemplo
  document.getElementById('solicitudes').innerHTML = [...misSolicitudes(), ...T.solicitudes]
    .map((s) => `<tr><td>${s.fecha}</td><td>${s.turno}</td><td>${MPU.badge(s.estado)}</td></tr>`)
    .join('');
}

function validar(id, errId) {
  const el = document.getElementById(id);
  const ok = el.value.trim() !== '';
  document.getElementById(errId).classList.toggle('hidden', ok);
  el.setAttribute('aria-invalid', String(!ok));
  return ok;
}

document.getElementById('form-turno').addEventListener('submit', (e) => {
  e.preventDefault();
  const okTurno = validar('turno-deseado', 'err-turno');
  const okMotivo = validar('motivo', 'err-motivo');
  if (!okTurno || !okMotivo) {
    document.getElementById(okTurno ? 'motivo' : 'turno-deseado').focus();
    return;
  }
  const turno = document.getElementById('turno-deseado').value;
  const soporte = document.getElementById('soporte').files[0];
  MPU.storage.set('turnos:solicitudes', [
    {
      fecha: MPU.fecha(new Date(), false),
      turno,
      estado: 'En revisión',
      motivo: document.getElementById('motivo').value.trim(),
      soporte: soporte ? soporte.name : null, // sin backend solo se guarda el nombre
    },
    ...misSolicitudes(),
  ]);
  e.target.reset();
  const ok = document.getElementById('ok-turno');
  ok.textContent = `Solicitud enviada: ${turno}. Queda en revisión.`;
  ok.classList.remove('hidden');
  pintarSolicitudes();
});

pintarSolicitudes();
