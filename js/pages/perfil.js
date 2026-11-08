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

function pintarDatos() {
  const filas = [
    ['Nombre', u.nombre], ['Usuario', u.usuario], ['Rol', u.rol], ['Programa', u.programa],
    ['Facultad', u.facultad], ['Nivel', 'Pregrado profesional'], ['Último periodo matriculado', '202660'],
  ];
  $('datos-lista').innerHTML = filas
    .map(([k, v]) => `<div><dt class="text-small font-bold">${k}</dt><dd>${MPU.esc(v)}</dd></div>`).join('');
  $('p-nombre').value = u.nombre;
  $('p-programa').value = u.programa;
  $('carne-iniciales').textContent = u.nombre.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();
  $('carne-nombre').textContent = u.nombre;
  $('carne-programa').textContent = `${u.programa} · ${u.rol}`;
  $('carne-id').textContent = `Usuario: ${u.usuario} · Periodo 202660`;
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
  MPU.imprimir('Carné UNAB', `
    <div style="border: 3px solid #FFA400; background: #FFF3D6; border-radius: 16px; padding: 24px; max-width: 480px;">
      <div style="font-size: 14px; font-weight: 700; color: #A35F00;">UNIVERSIDAD AUTÓNOMA DE BUCARAMANGA</div>
      <div style="font-size: 26px; font-weight: 800; margin: 8px 0;">${MPU.esc(u.nombre)}</div>
      <div style="font-size: 16px;">${MPU.esc(u.programa)} · ${MPU.esc(u.rol)}</div>
      <div style="font-size: 16px; margin-top: 6px;">Usuario: ${MPU.esc(u.usuario)} · Periodo 202660</div>
    </div>`);
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
  ['Semilleros', cantidad('semilleros:inscritos'), 'inscripciones', 'semilleros.html'],
  ['Parqueadero', cantidad('parqueadero:pagos'), 'pagos', 'parqueadero.html'],
];
$('tramites-lista').innerHTML = tramites.map(([nombre, n, unidad, href]) => `
  <li class="flex items-center justify-between gap-4 py-3">
    <span><strong>${nombre}</strong><br><span class="text-small">${n} ${unidad}</span></span>
    <a href="${href}" class="font-bold text-unab-text hover:underline">Ver<span class="sr-only"> ${nombre}</span></a>
  </li>`).join('');

pintarDatos();
