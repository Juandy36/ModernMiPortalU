// Horas libres: progreso hacia las 42 h, actividades con QR / confirmación en línea e historial.
const $ = (id) => document.getElementById(id);
const H = MPU.horasLibres;
const fechaDe = (iso) => MPU.fecha(new Date(iso + 'T00:00:00'));
const horasTxt = (n) => `${n} ${n === 1 ? 'hora' : 'horas'}`;
// Para buscar sin importar tildes ni mayúsculas
const plano = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const encuestas = () => MPU.storage.get('horaslibres:encuestas', {});
const OPCIONES = {
  necesario: ['Muy necesario', 'Necesario', 'Poco necesario', 'Nada necesario'],
  interes: ['Mucho', 'Moderado', 'Poco', 'Nada'],
  satisfaccion: ['Excelente', 'Bueno', 'Regular', 'Malo'],
  repetir: ['Sí', 'No'],
};
Object.entries(OPCIONES).forEach(([campo, lista]) => {
  document.querySelector(`[data-opciones="${campo}"]`).innerHTML = lista.map((o) =>
    `<label class="inline-flex items-center gap-2 cursor-pointer"><input type="radio" name="${campo}" value="${o}" class="w-4 h-4 accent-[#FFA400]"> ${o}</label>`).join('');
});
let codigoEncuesta = null;

function guardar(codigo, estado) {
  const otros = H.registros().filter((r) => r.codigo !== codigo);
  MPU.storage.set('horaslibres:registros', [...otros, { codigo, estado }]);
}
function anunciar(msg) {
  const el = $('aviso');
  el.textContent = msg;
  el.className = 'px-3 py-2 rounded-md font-semibold';
  el.style.background = '#E3F4EA';
  el.style.color = '#1B5E38';
}

function pintarProgreso() {
  const r = H.resumen();
  $('cumplidas').textContent = r.cumplidas;
  $('meta').textContent = r.meta;
  $('faltan').textContent = r.faltan;
  $('barra').setAttribute('aria-valuenow', Math.min(r.cumplidas, r.meta));
  $('barra').setAttribute('aria-valuetext', `${r.cumplidas} de ${r.meta} horas`);
  $('barra-relleno').style.width = r.pct + '%';
  $('progreso-texto').innerHTML = r.faltan === 0
    ? `${MPU.badge('Cumplido')} Completaste las ${r.meta} horas libres requeridas para grado.`
    : `Llevas el ${r.pct} % del requisito. Te faltan ${horasTxt(r.faltan)} para graduarte.`;
}

const POR_PAGINA = 6;
let pagina = 1;
$('fecha-hoy').textContent = new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' });

function pintarPaginacion(total) {
  const n = Math.max(1, Math.ceil(total / POR_PAGINA));
  pagina = Math.min(pagina, n);
  $('paginacion').innerHTML = total <= POR_PAGINA ? '' :
    `<button type="button" data-pag="${pagina - 1}" class="btn btn-secondary" ${pagina === 1 ? 'disabled' : ''}>« Anterior</button>` +
    Array.from({ length: n }, (_, i) => `<button type="button" data-pag="${i + 1}" class="btn ${i + 1 === pagina ? 'btn-primary' : 'btn-secondary'}" ${i + 1 === pagina ? 'aria-current="page"' : ''}>${i + 1}</button>`).join('') +
    `<button type="button" data-pag="${pagina + 1}" class="btn btn-secondary" ${pagina === n ? 'disabled' : ''}>Siguiente »</button>`;
}

function pintarActividades() {
  const texto = plano($('buscar').value.trim());
  const mod = $('modalidad').value;
  const registros = H.registros();
  const lista = H.actividades.filter((a) =>
    (!mod || a.modalidad === mod) &&
    (!texto || plano(`${a.nombre} ${a.lugar} ${a.codigo}`).includes(texto)));

  $('contador').textContent = `${lista.length} ${lista.length === 1 ? 'actividad' : 'actividades'}`;
  pintarPaginacion(lista.length);
  $('lista').innerHTML = lista.length
    ? lista.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA).map((a) => {
      const estado = registros.find((r) => r.codigo === a.codigo)?.estado;
      let accion;
      if (estado === 'asistio') {
        const respondida = encuestas()[a.codigo];
        accion = `${MPU.badge('Asistió')} <span class="text-small">+${horasTxt(a.horas)} sumadas</span>
          ${respondida ? '<span class="text-small">· Encuesta respondida</span>' : `<button type="button" data-encuesta="${a.codigo}" class="btn btn-secondary">Responder encuesta<span class="sr-only"> de ${MPU.esc(a.nombre)}</span></button>`}`;
      }
      else if (estado === 'qr') accion = `${MPU.badge('QR generado')} <button type="button" data-qr="${a.codigo}" class="btn btn-secondary">Ver código QR</button>`;
      else if (a.modalidad === 'Virtual') accion = `<button type="button" data-confirmar="${a.codigo}" class="btn btn-primary">Confirmar asistencia</button>`;
      else accion = `<button type="button" data-qr="${a.codigo}" class="btn btn-primary">Generar código QR</button>`;
      return `<article class="card flex flex-col gap-2">
        <div class="flex items-start justify-between gap-3">
          <div class="text-small font-bold text-unab-text">${fechaDe(a.fecha)} · ${a.inicio} – ${a.fin}</div>
          <span class="badge" style="background:#FFF3D6;color:#A35F00;border:1px solid #FFA400">${a.modalidad}</span>
        </div>
        <h3 class="text-h3">${MPU.esc(a.nombre)}</h3>
        <p class="text-small">${MPU.esc(a.lugar)}</p>
        <p class="text-small">Código del evento: <strong>${a.codigo}</strong> · Otorga <strong>${horasTxt(a.horas)}</strong></p>
        <div class="mt-auto pt-2 flex flex-wrap items-center gap-3">${accion}</div>
      </article>`;
    }).join('')
    : '<p class="md:col-span-2 py-6 text-center">No hay actividades que coincidan con tu búsqueda.</p>';
}

function pintarHistorial() {
  const r = H.resumen();
  const filas = [
    ...H.previas.map((p) => ({ fecha: p.fecha, nombre: p.nombre, modalidad: p.modalidad, horas: p.horas, estado: 'Asistió' })),
    ...r.nuevas.map((n) => ({
      fecha: n.act.fecha, nombre: n.act.nombre, modalidad: n.act.modalidad, horas: n.act.horas,
      estado: n.estado === 'asistio' ? 'Asistió' : 'QR generado',
    })),
  ].sort((a, b) => b.fecha.localeCompare(a.fecha));
  $('historial').innerHTML = filas.map((f) => `<tr>
    <td>${fechaDe(f.fecha)}</td><td>${MPU.esc(f.nombre)}</td><td>${f.modalidad}</td><td>${f.horas}</td><td>${MPU.badge(f.estado)}</td></tr>`).join('');
}

function pintarTodo() { pintarProgreso(); pintarActividades(); pintarHistorial(); }

// QR de asistencia
const dlg = $('dlg-qr');
let codigoQr = null;
function abrirQr(codigo) {
  const a = H.actividades.find((x) => x.codigo === codigo);
  codigoQr = codigo;
  if (!H.registros().some((r) => r.codigo === codigo)) guardar(codigo, 'qr');
  let svg = '';
  try {
    const q = qrcode(0, 'M');
    q.addData(`UNAB|HL|${a.codigo}|${MPU.usuario.usuario}`);
    q.make();
    svg = q.createSvgTag({ scalable: true, margin: 0 });
  } catch { /* sin librería: se muestra solo el texto */ }
  $('qr-grafico').innerHTML = svg;
  $('qr-datos').innerHTML = `<strong>${MPU.esc(MPU.usuario.nombre)}</strong><br>Evento ${a.codigo} · ${MPU.esc(a.nombre)}`;
  const yaAsistio = H.registros().find((r) => r.codigo === codigo)?.estado === 'asistio';
  $('qr-escanear').hidden = yaAsistio;
  pintarTodo();
  dlg.showModal();
}

$('lista').addEventListener('click', (e) => {
  const enc = e.target.closest('[data-encuesta]');
  if (enc) {
    codigoEncuesta = enc.dataset.encuesta;
    $('enc-actividad').textContent = H.actividades.find((x) => x.codigo === codigoEncuesta).nombre;
    $('form-encuesta').reset();
    $('enc-error').classList.add('hidden');
    $('dlg-encuesta').showModal();
    return;
  }
  const qr = e.target.closest('[data-qr]');
  const conf = e.target.closest('[data-confirmar]');
  if (qr) abrirQr(qr.dataset.qr);
  if (conf) {
    guardar(conf.dataset.confirmar, 'asistio');
    const a = H.actividades.find((x) => x.codigo === conf.dataset.confirmar);
    anunciar(`Asistencia confirmada: ${a.nombre}. Sumaste ${horasTxt(a.horas)}.`);
    pintarTodo();
  }
});
$('qr-escanear').addEventListener('click', () => {
  guardar(codigoQr, 'asistio');
  const a = H.actividades.find((x) => x.codigo === codigoQr);
  anunciar(`Asistencia validada: ${a.nombre}. Sumaste ${horasTxt(a.horas)}.`);
  dlg.close();
  pintarTodo();
});
$('qr-cerrar').addEventListener('click', () => dlg.close());

$('enc-cerrar').addEventListener('click', () => $('dlg-encuesta').close());
$('form-encuesta').addEventListener('submit', (e) => {
  e.preventDefault();
  const f = e.target;
  const faltan = Object.keys(OPCIONES).filter((c) => !f.querySelector(`input[name="${c}"]:checked`));
  if (faltan.length) {
    $('enc-error').textContent = 'Responde las preguntas 1 a 4 para enviar la encuesta.';
    $('enc-error').classList.remove('hidden');
    return;
  }
  const r = Object.fromEntries(Object.keys(OPCIONES).map((c) => [c, f.querySelector(`input[name="${c}"]:checked`).value]));
  r.tema = $('enc-tema').value.trim();
  r.comentarios = $('enc-comentarios').value.trim();
  MPU.storage.set('horaslibres:encuestas', { ...encuestas(), [codigoEncuesta]: r });
  $('dlg-encuesta').close();
  anunciar('¡Muchas gracias por tus comentarios!');
  pintarTodo();
});
$('paginacion').addEventListener('click', (e) => {
  const b = e.target.closest('[data-pag]');
  if (!b || b.disabled) return;
  pagina = Number(b.dataset.pag);
  pintarActividades();
  $('actividades-titulo').scrollIntoView({ behavior: 'smooth' });
});
$('buscar').addEventListener('input', () => { pagina = 1; pintarActividades(); });
$('modalidad').addEventListener('change', () => { pagina = 1; pintarActividades(); });
$('limpiar').addEventListener('click', () => { $('buscar').value = ''; $('modalidad').value = ''; pagina = 1; pintarActividades(); $('buscar').focus(); });

pintarTodo();
