// Reservas de espacios CSU (Wireframe 6, funcionalidad 5).
const R = MPU.reservas;
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const DIAS_LARGOS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

const hoy = new Date();
hoy.setHours(0, 0, 0, 0);
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const desdeIso = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };

// Si ya pasó la última franja del día, se abre en mañana.
const ultimaFranja = Number(R.franjas[R.franjas.length - 1].slice(0, 2));
const inicial = new Date(hoy);
if (new Date().getHours() >= ultimaFranja) inicial.setDate(inicial.getDate() + 1);
const estado = { espacio: R.espacios[0], mes: new Date(inicial.getFullYear(), inicial.getMonth(), 1), dia: iso(inicial), franja: null };
const misReservas = () => MPU.storage.get('reservas:mias', []);
const esMia = (f) => misReservas().some((r) => r.espacio === estado.espacio && r.fecha === estado.dia && r.franja === f);

document.getElementById('espacio').innerHTML = R.espacios.map((e) => `<option>${e}</option>`).join('');

function pintarCalendario() {
  const { mes } = estado;
  document.getElementById('mes-titulo').textContent = `${MESES[mes.getMonth()]} ${mes.getFullYear()}`;
  // No se puede ir a meses pasados
  document.getElementById('mes-ant').disabled = mes <= new Date(hoy.getFullYear(), hoy.getMonth(), 1);

  const vacios = (mes.getDay() + 6) % 7; // semana empieza el lunes
  const diasMes = new Date(mes.getFullYear(), mes.getMonth() + 1, 0).getDate();
  let html = '<span></span>'.repeat(vacios);
  for (let d = 1; d <= diasMes; d++) {
    const fecha = new Date(mes.getFullYear(), mes.getMonth(), d);
    const pasado = fecha < hoy;
    const elegido = iso(fecha) === estado.dia;
    html += `<button type="button" data-dia="${iso(fecha)}" ${pasado ? 'disabled' : ''} aria-pressed="${elegido}"
      class="h-10 rounded-lg font-semibold ${elegido ? 'bg-unab' : pasado ? 'text-gray-300' : 'hover:bg-unab-cream'}">${d}</button>`;
  }
  document.getElementById('calendario').innerHTML = html;
}

function pintarFranjas() {
  const fecha = desdeIso(estado.dia);
  document.getElementById('franjas-titulo').textContent = `Franjas del ${DIAS_LARGOS[fecha.getDay()]} ${MPU.fecha(fecha, false)}`;
  document.getElementById('franjas').innerHTML = R.franjas
    .map((f) => {
      const mia = esMia(f);
      // Hoy no se pueden reservar franjas cuya hora ya pasó
      const pasada = estado.dia === iso(hoy) && Number(f.slice(0, 2)) <= new Date().getHours();
      const ocupada = R.ocupada(estado.espacio, estado.dia, f) || mia || pasada;
      const elegida = f === estado.franja;
      const clase = elegida
        ? 'bg-unab border-unab'
        : mia
          ? 'bg-unab-cream border-unab-dark text-unab-dark cursor-not-allowed'
          : ocupada
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300'
            : 'bg-white border-unab hover:bg-unab-cream';
      const etiqueta = mia ? `${f} (tuya)` : f;
      return `<button type="button" data-franja="${f}" ${ocupada ? 'disabled' : ''} aria-pressed="${elegida}"
        class="py-2 rounded-lg border-2 font-semibold ${clase}">${etiqueta}</button>`;
    })
    .join('');

  const resumen = document.getElementById('resumen');
  const hayLibres = document.querySelector('#franjas button:not([disabled])');
  resumen.textContent = estado.franja
    ? `Resumen: ${estado.espacio} · ${MPU.fecha(fecha)} · ${estado.franja}`
    : hayLibres
      ? 'Elige una franja disponible.'
      : 'No quedan franjas disponibles este día. Elige otro día u otro espacio.';
  document.getElementById('confirmar').disabled = !estado.franja;
}

function pintarMisReservas() {
  const lista = misReservas().filter((r) => desdeIso(r.fecha) >= hoy);
  document.getElementById('mis-reservas').innerHTML = lista
    .map((r, i) => `<tr><td>${r.espacio}</td><td>${MPU.fecha(desdeIso(r.fecha))}</td><td>${r.franja}</td>
      <td class="text-right"><button type="button" data-cancelar="${r.id}" class="font-bold text-danger hover:underline">Cancelar</button></td></tr>`)
    .join('');
  document.getElementById('sin-reservas').classList.toggle('hidden', lista.length > 0);
}

function pintarTodo() {
  pintarCalendario();
  pintarFranjas();
  pintarMisReservas();
}

const ocultarOk = () => document.getElementById('ok-reserva').classList.add('hidden');

document.getElementById('espacio').addEventListener('change', (e) => {
  estado.espacio = e.target.value;
  estado.franja = null;
  ocultarOk();
  pintarFranjas();
});

document.getElementById('mes-ant').addEventListener('click', () => {
  estado.mes = new Date(estado.mes.getFullYear(), estado.mes.getMonth() - 1, 1);
  pintarCalendario();
});
document.getElementById('mes-sig').addEventListener('click', () => {
  estado.mes = new Date(estado.mes.getFullYear(), estado.mes.getMonth() + 1, 1);
  pintarCalendario();
});

document.getElementById('calendario').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-dia]');
  if (!btn || btn.disabled) return;
  estado.dia = btn.dataset.dia;
  estado.franja = null;
  ocultarOk();
  pintarCalendario();
  pintarFranjas();
});

document.getElementById('franjas').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-franja]');
  if (!btn || btn.disabled) return;
  estado.franja = btn.dataset.franja;
  ocultarOk();
  pintarFranjas();
});

document.getElementById('confirmar').addEventListener('click', () => {
  const nueva = { id: Date.now(), espacio: estado.espacio, fecha: estado.dia, franja: estado.franja };
  MPU.storage.set('reservas:mias', [...misReservas(), nueva]);
  const ok = document.getElementById('ok-reserva');
  ok.textContent = `Reserva confirmada: ${nueva.espacio} · ${MPU.fecha(desdeIso(nueva.fecha))} · ${nueva.franja}.`;
  ok.classList.remove('hidden');
  estado.franja = null;
  pintarTodo();
});

document.getElementById('mis-reservas').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-cancelar]');
  if (!btn) return;
  MPU.storage.set('reservas:mias', misReservas().filter((r) => String(r.id) !== btn.dataset.cancelar));
  ocultarOk();
  pintarTodo();
});

pintarTodo();
