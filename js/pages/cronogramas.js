// Cronogramas académicos: filtros por modalidad, nivel y estado (activo = próximo o en curso).
const $ = (id) => document.getElementById(id);
const K = MPU.cronogramas;
const fechaDe = (iso) => MPU.fecha(new Date(iso + 'T00:00:00'));
const hoyISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

function estadoDe(e) {
  const h = hoyISO();
  if (e.fin < h) return 'Finalizado';
  if (e.inicio > h) return 'Próximo';
  return 'En curso';
}
function insignia(estado) {
  if (estado === 'Finalizado') return '<span class="badge" style="background:#F4F4F4;color:#333;border:1px solid #8C8C8C">Finalizado</span>';
  if (estado === 'En curso') return '<span class="badge badge-ok">En curso</span>';
  return '<span class="badge badge-pending">Próximo</span>';
}

$('f-modalidad').insertAdjacentHTML('beforeend', K.modalidades.map((m) => `<option>${m}</option>`).join(''));
$('f-nivel').insertAdjacentHTML('beforeend', K.niveles.map((n) => `<option>${n}</option>`).join(''));
$('f-nivel').value = 'Pregrado profesional';

function pintar() {
  const mod = $('f-modalidad').value;
  const niv = $('f-nivel').value;
  const act = $('f-activos').value;
  const lista = K.eventos
    .filter((e) => (!mod || e.modalidad.includes(mod)) && (!niv || e.nivel === niv)
      && (act === '' || (act === 'si') === (estadoDe(e) !== 'Finalizado')))
    .sort((a, b) => a.inicio.localeCompare(b.inicio));
  $('contador').textContent = `${lista.length} ${lista.length === 1 ? 'fecha' : 'fechas'}`;
  $('vacio').classList.toggle('hidden', lista.length > 0);
  $('eventos').innerHTML = lista.map((e) => `<tr><td style="white-space:normal;min-width:220px">${MPU.esc(e.evento)}</td><td>${fechaDe(e.inicio)}</td>
    <td>${fechaDe(e.fin)}</td><td>${e.modalidad.join(', ')}</td><td>${e.nivel}</td><td>${insignia(estadoDe(e))}</td></tr>`).join('');
}
['f-modalidad', 'f-nivel', 'f-activos'].forEach((id) => $(id).addEventListener('change', pintar));
pintar();
