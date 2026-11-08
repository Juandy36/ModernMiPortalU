// Perfil: datos, carné, cambio de contraseña y resumen de trámites.
const $ = (id) => document.getElementById(id);
const u = MPU.usuario;
const cantidad = (clave) => { const v = MPU.storage.get(clave, []); return Array.isArray(v) ? v.length : 0; };

function aviso(msg, ok = true) {
  const el = $('aviso');
  el.textContent = msg;
  el.className = 'px-3 py-2 rounded-md font-semibold';
  el.style.background = ok ? '#E3F4EA' : '#FDECEA';
  el.style.color = ok ? '#1B5E38' : '#B42318';
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

async function api(url, datos) {
  const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datos) });
  const cuerpo = await r.json().catch(() => ({}));
  if (r.status === 401) { location.href = '/login.html'; throw new Error('Sin sesión'); }
  if (!r.ok) throw new Error(cuerpo.error || 'No se pudo completar la solicitud.');
  return cuerpo;
}

// Carné horizontal (misma distribución del carné real). Todo con estilos en línea para que
// salga igual en pantalla y al imprimir; las medidas escalan con el ancho del carné (cqw).
function carneHtml() {
  const id = 'U' + String(u.id).padStart(8, '0'); // identificador de ejemplo
  const palabras = u.nombre.trim().toUpperCase().split(/\s+/);
  const mitad = Math.ceil(palabras.length / 2);
  const lineas = [palabras.slice(0, mitad).join(' '), palabras.slice(mitad).join(' ')].filter(Boolean);
  const iniciales = u.nombre.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();

  let qr = '';
  try {
    const q = qrcode(0, 'M');
    q.addData(`UNAB|${id}|${u.usuario}|${u.nombre}`);
    q.make();
    qr = q.createSvgTag({ scalable: true, margin: 0 });
  } catch { /* sin librería: el carné sale sin QR */ }

  const franja = (c, h) => `<div style="background:${c};height:${h}%"></div>`;
  return `
  <div role="img" aria-label="Carné de ${MPU.esc(u.nombre)}, ${MPU.esc(u.programa)}, ${MPU.esc(u.rol)}"
    style="container-type:inline-size;width:100%;max-width:560px;margin:0 auto;">
    <div style="display:flex;aspect-ratio:2/1;background:#fff;border-radius:6cqw;overflow:hidden;box-shadow:0 0 0 1px #d9d9d9,0 2px 8px rgba(0,0,0,.25);font-family:Montserrat,'Segoe UI',Arial,sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact;">
      <div style="width:33%;background:#FFA400;padding:4cqw 4cqw;display:flex;flex-direction:column;justify-content:space-between;">
        <div style="color:#fff;line-height:.95;">
          <div style="font-size:4cqw;font-weight:600;">Universidad</div>
          <div style="font-size:10cqw;font-weight:800;letter-spacing:-.02em;">unab</div>
        </div>
        <div style="aspect-ratio:1/1;width:88%;background:#FFF3D6;display:flex;align-items:center;justify-content:center;font-size:10cqw;font-weight:800;color:#A35F00;">${MPU.esc(iniciales)}</div>
      </div>
      <div style="flex:1;position:relative;padding:5cqw 4cqw 4cqw 5cqw;min-width:0;">
        <div style="line-height:1.25;">
          <div style="font-size:3.4cqw;font-weight:700;color:#A35F00;">${lineas.map(MPU.esc).join('<br>')}</div>
          <div style="font-size:3.4cqw;font-weight:600;color:#555;">${id}</div>
          <div style="font-size:3.4cqw;font-weight:700;color:#A35F00;">${MPU.esc(u.rol.toUpperCase())}</div>
          <div style="font-size:3cqw;font-weight:600;color:#555;margin-top:2cqw;white-space:nowrap;">${MPU.esc(u.programa.toUpperCase())}</div>
        </div>
        <div style="position:absolute;right:4cqw;bottom:4cqw;width:16cqw;height:16cqw;">${qr}</div>
      </div>
      <div style="width:3%;display:flex;flex-direction:column;">
        ${franja('#8E00B8', 25)}${franja('#8CDB00', 25)}${franja('#3DB8F5', 25)}${franja('#FFA400', 25)}
      </div>
    </div>
  </div>`;
}

function pintarDatos() {
  const filas = [
    ['Nombre', u.nombre], ['Usuario', u.usuario], ['Rol', u.rol], ['Programa', u.programa],
    ['Facultad', u.facultad], ['Nivel', 'Pregrado profesional'], ['Último periodo matriculado', MPU.cursos.periodoActual],
    ['Semestre actual', MPU.cursos.semestreActual], ['Créditos aprobados', `${MPU.cursos.resumen().creditosAprobados} de ${MPU.cursos.resumen().creditosTotales}`],
    ['Promedio (PGA)', String(MPU.cursos.resumen().pga.toFixed(2)).replace('.', ',')],
  ];
  $('datos-lista').innerHTML = filas
    .map(([k, v]) => `<div><dt class="text-small font-bold">${k}</dt><dd>${MPU.esc(v)}</dd></div>`).join('');
  $('p-nombre').value = u.nombre;
  $('p-programa').value = u.programa;
  $('carne-vista').innerHTML = carneHtml();
}

$('form-datos').addEventListener('submit', async (e) => {
  e.preventDefault();
  const boton = e.target.querySelector('button');
  boton.disabled = true;
  try {
    Object.assign(u, await api('/api/perfil', { nombre: $('p-nombre').value, programa: $('p-programa').value }));
    pintarDatos();
    aviso('Datos actualizados. El menú superior se actualizará al recargar la página.');
  } catch (err) { aviso(err.message, false); }
  boton.disabled = false;
});

$('btn-carne').addEventListener('click', () => {
  MPU.imprimir('Carné UNAB', carneHtml());
});

$('form-clave').addEventListener('submit', async (e) => {
  e.preventDefault();
  const error = $('error-clave');
  const mostrar = (m) => { error.textContent = m; error.classList.toggle('hidden', !m); };
  mostrar('');
  if ($('c-nueva').value !== $('c-nueva2').value) return mostrar('Las contraseñas nuevas no coinciden.');
  const boton = e.target.querySelector('button');
  boton.disabled = true;
  try {
    await api('/api/password', { actual: $('c-actual').value, nueva: $('c-nueva').value });
    e.target.reset();
    aviso('Contraseña cambiada correctamente.');
  } catch (err) { mostrar(err.message); }
  boton.disabled = false;
});

const tramites = [
  ['Matrícula y turnos', cantidad('turnos:solicitudes'), 'solicitudes', 'turnos.html'],
  ['Reservas CSU', cantidad('reservas:mias'), 'reservas', 'reservas-csu.html'],
  ['Solicitudes en trámite', MPU.storage.get('solicitudes:mias', []).filter((s) => s.estado === 'En trámite').length, 'solicitudes', 'solicitudes.html'],
  ['Proyección de cursos', cantidad('cursos:proyeccion'), 'cursos proyectados', 'cursos.html#proyeccion'],
  ['Horas libres', MPU.horasLibres.resumen().cumplidas, `de ${MPU.horasLibres.meta} horas`, 'horas-libres.html'],
  ['Semilleros', cantidad('semilleros:inscritos'), 'inscripciones', 'semilleros.html'],
  ['Parqueadero', cantidad('parqueadero:pagos'), 'pagos', 'parqueadero.html'],
];
$('tramites-lista').innerHTML = tramites.map(([nombre, n, unidad, href]) => `
  <li class="flex items-center justify-between gap-4 py-3">
    <span><strong>${nombre}</strong><br><span class="text-small">${n} ${unidad}</span></span>
    <a href="${href}" class="font-bold text-unab-text hover:underline">Ver<span class="sr-only"> ${nombre}</span></a>
  </li>`).join('');

pintarDatos();
