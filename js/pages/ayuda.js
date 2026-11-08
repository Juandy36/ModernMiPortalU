// Ayuda y Punto U: preguntas frecuentes con buscador y agenda de citas.
const $ = (id) => document.getElementById(id);
const plano = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const FAQ = [
  { p: '¿Cómo consulto mi horario?', r: 'Entra a <a class="font-bold underline" href="horario.html">Mi horario</a>: verás tus clases por día con el estado de cada una (iniciada, por iniciar o cancelada).' },
  { p: '¿Dónde veo mis calificaciones?', r: 'En <a class="font-bold underline" href="calificaciones.html">Calificaciones</a> encuentras tus cortes del periodo, las notas por semestre y tu promedio acumulado.' },
  { p: '¿Cómo descargo mi cupón de pago?', r: 'Ve a <a class="font-bold underline" href="pagos.html">Pagos y fechas</a> y usa «Descargar cupón» en el concepto que necesites.' },
  { p: '¿Qué medios de pago puedo usar?', r: 'PSE (débito desde tu banco), tarjeta de crédito, bancos aliados, Flexi-UNAB y cesantías. Los encuentras al pagar en <a class="font-bold underline" href="pagos.html">Pagos y fechas</a>.' },
  { p: '¿Cómo pago una multa de biblioteca o por repetición de curso?', r: 'Las multas aparecen en <a class="font-bold underline" href="pagos.html">Pagos y fechas</a> junto a tus demás conceptos. También puedes iniciar el trámite desde <a class="font-bold underline" href="solicitudes.html">Solicitudes</a>.' },
  { p: '¿Cómo actualizo mis datos?', r: 'Edita tu nombre y programa en <a class="font-bold underline" href="perfil.html">Mi perfil</a>. Para otros datos (como la EPS) crea una solicitud en <a class="font-bold underline" href="solicitudes.html">Solicitudes</a>.' },
  { p: '¿Cómo cambio mi contraseña?', r: 'En <a class="font-bold underline" href="perfil.html#clave">Mi perfil → Cambiar contraseña</a>. Debe tener mínimo 8 caracteres, con mayúscula, minúscula y número, y no puede contener tu nombre ni apellido. La del correo institucional se cambia desde el servicio de correo de la UNAB.' },
  { p: '¿Cómo solicito un certificado o un paz y salvo?', r: 'Entra a <a class="font-bold underline" href="solicitudes.html">Solicitudes</a>, elige la categoría (Académico o Financiero) y pulsa «Iniciar solicitud». Verás el avance en «Mis solicitudes».' },
  { p: '¿Cuántas horas libres necesito para graduarme?', r: 'Son 42 horas. Suma asistiendo a actividades de Bienestar desde <a class="font-bold underline" href="horas-libres.html">Horas libres</a>; votar en las Elecciones UNAB otorga 4 horas.' },
  { p: '¿Cómo proyecto la inscripción de mis cursos?', r: 'En <a class="font-bold underline" href="cursos.html#proyeccion">Cursos y proyección</a> puedes cargar la matrícula recomendada y guardarla. Tu turno de inscripción oficial está en <a class="font-bold underline" href="turnos.html">Matrícula y turnos</a>.' },
];

function pintarFaq() {
  const q = plano($('faq-buscar').value.trim());
  const l = FAQ.filter((f) => !q || plano(`${f.p} ${f.r.replace(/<[^>]+>/g, '')}`).includes(q));
  $('faq-contador').textContent = `${l.length} ${l.length === 1 ? 'pregunta' : 'preguntas'}`;
  $('faq').innerHTML = l.length ? l.map((f) => `<details class="card p-0 overflow-hidden">
    <summary class="cursor-pointer font-bold px-6 py-4">${f.p}</summary>
    <div class="px-6 pb-4">${f.r}</div></details>`).join('')
    : '<p class="py-6 text-center">No encontramos preguntas con esa búsqueda. Escríbenos desde <a class="font-bold underline" href="chat.html">Contacto</a>.</p>';
}
$('faq-buscar').addEventListener('input', pintarFaq);
pintarFaq();

// --- Citas ---
const horas = [];
for (let h = 8; h <= 17; h++) horas.push(`${String(h).padStart(2, '0')}:00`);
$('c-hora').innerHTML = horas.map((h) => `<option>${h}</option>`).join('');
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
$('c-fecha').min = iso(new Date());
$('c-fecha').value = iso(new Date());
const fechaDe = (s) => MPU.fecha(new Date(s + 'T00:00:00'));
const citas = () => MPU.storage.get('ayuda:citas', []);

function aviso(msg, ok = true) {
  const el = $('cita-aviso');
  el.textContent = msg;
  el.className = 'mb-3 px-3 py-2 rounded-md font-semibold';
  el.style.background = ok ? '#E3F4EA' : '#FDECEA';
  el.style.color = ok ? '#1B5E38' : '#B42318';
}

function pintarCitas() {
  const l = citas();
  $('sin-citas').classList.toggle('hidden', l.length > 0);
  $('citas').innerHTML = l.map((c) => `<li class="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-surface p-3">
    <span><strong>${MPU.esc(c.sede)}</strong> · ${fechaDe(c.fecha)} · ${c.hora}<br><span class="text-small">${MPU.esc(c.motivo)}</span></span>
    <button type="button" data-cancelar="${c.id}" class="font-bold text-danger hover:underline">Cancelar</button></li>`).join('');
}

$('form-cita').addEventListener('submit', (e) => {
  e.preventDefault();
  const c = { id: Date.now(), sede: $('c-sede').value, fecha: $('c-fecha').value, hora: $('c-hora').value, motivo: $('c-motivo').value.trim() };
  const ahora = new Date();
  if (!c.fecha || c.fecha < iso(ahora)) return aviso('Elige una fecha de hoy en adelante.', false);
  const dia = new Date(c.fecha + 'T00:00:00').getDay();
  if (dia === 0) return aviso('Punto U no atiende los domingos.', false);
  if (dia === 6 && Number(c.hora.slice(0, 2)) >= 12) return aviso('Los sábados se atiende hasta el mediodía.', false);
  if (c.fecha === iso(ahora) && Number(c.hora.slice(0, 2)) <= ahora.getHours()) return aviso('Esa hora ya pasó. Elige otra.', false);
  if (c.motivo.length < 3) return aviso('Cuéntanos brevemente el motivo de la cita.', false);
  if (citas().some((x) => x.sede === c.sede && x.fecha === c.fecha && x.hora === c.hora)) return aviso('Ya tienes una cita en esa sede, fecha y hora.', false);
  MPU.storage.set('ayuda:citas', [...citas(), c]);
  $('c-motivo').value = '';
  aviso(`Cita agendada: ${c.sede}, ${fechaDe(c.fecha)} a las ${c.hora}.`);
  pintarCitas();
});
$('citas').addEventListener('click', (e) => {
  const b = e.target.closest('[data-cancelar]');
  if (!b) return;
  MPU.storage.set('ayuda:citas', citas().filter((x) => String(x.id) !== b.dataset.cancelar));
  aviso('Cita cancelada.');
  pintarCitas();
});
pintarCitas();
