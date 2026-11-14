// Componentes compartidos: navbar, footer y botón flotante de chat.
// Cada página define <body data-root="../" data-active="horario"> y este script los inyecta.

// Los grupos con `items` se muestran como menú desplegable (mismo orden que en el inicio).
const NAV_LINKS = [
  { id: 'inicio', label: 'Inicio', href: 'index.html' },
  {
    id: 'academico', label: 'Académico', items: [
      { id: 'horario', label: 'Mi horario', href: 'pages/horario.html' },
      { id: 'cursos', label: 'Cursos y proyección', href: 'pages/cursos.html' },
      { id: 'calificaciones', label: 'Calificaciones', href: 'pages/calificaciones.html' },
      { id: 'cronogramas', label: 'Cronogramas académicos', href: 'pages/cronogramas.html' },
      { id: 'syllabus', label: 'Syllabus', href: 'pages/syllabus.html' },
      { id: 'investigacion', label: 'Investigación', href: 'pages/investigacion.html' },
      { id: 'apoyo', label: 'Apoyo académico', href: 'pages/apoyo.html' },
      { id: 'grado', label: 'Mi grado', href: 'pages/grado.html' },
    ],
  },
  {
    id: 'servicios', label: 'Servicios', items: [
      { id: 'turnos', label: 'Matrícula y turnos', href: 'pages/turnos.html' },
      { id: 'becas', label: 'Becas y promedio', href: 'pages/becas.html' },
      { id: 'solicitudes', label: 'Solicitudes', href: 'pages/solicitudes.html' },
      { id: 'pagos', label: 'Pagos y fechas', href: 'pages/pagos.html' },
      { id: 'espacios', label: 'Aulas y equipos', href: 'pages/espacios.html' },
      { id: 'ayuda', label: 'Ayuda y Punto U', href: 'pages/ayuda.html' },
    ],
  },
  {
    id: 'bienestar', label: 'Bienestar', items: [
      { id: 'bienestar-programas', label: 'Programas de bienestar', href: 'pages/bienestar.html' },
      { id: 'horaslibres', label: 'Horas libres', href: 'pages/horas-libres.html' },
      { id: 'reservas', label: 'Reservas CSU', href: 'pages/reservas-csu.html' },
      { id: 'parqueadero', label: 'Parqueadero', href: 'pages/parqueadero.html' },
      { id: 'semilleros', label: 'Semilleros', href: 'pages/semilleros.html' },
      { id: 'deportes', label: 'ASCUN e Interoscas', href: 'pages/deportes.html' },
    ],
  },
  { id: 'noticias', label: 'Noticias', href: 'pages/noticias.html' },
  { id: 'chat', label: 'Contacto', href: 'pages/chat.html' },
  { id: 'nosotros', label: 'Quiénes somos', href: 'pages/quienes-somos.html' },
];

// Índice del buscador global: páginas del menú + trámites y temas frecuentes.
const SITE_EXTRA = [
  ['Certificado de notas', 'pages/calificaciones.html', 'certificado constancia notas calificaciones pdf'],
  ['Promedio acumulado (PGA)', 'pages/calificaciones.html', 'pga promedio notas cortes corte'],
  ['Proyección de cursos', 'pages/cursos.html#proyeccion', 'proyeccion matricula recomendada inscripcion proximo periodo'],
  ['Cursos inscritos', 'pages/cursos.html', 'cursos inscritos avance curricular plan de estudios creditos'],
  ['Paz y salvo financiero', 'pages/solicitudes.html', 'paz y salvo certificado valor adeudado tramite cesaf'],
  ['Cupón de pago de matrícula', 'pages/pagos.html', 'cupon pago matricula recibo valor adeudado'],
  ['Multa de biblioteca', 'pages/pagos.html', 'multa biblioteca repeticion de curso pagar'],
  ['Mecanismos de financiación (Flexi-UNAB, ICETEX)', 'pages/pagos.html', 'financiacion flexi icetex cesantias horizontes credito'],
  ['Mi carné UNAB', 'pages/perfil.html#carne', 'carne unab qr identificacion'],
  ['Cambiar contraseña', 'pages/perfil.html#clave', 'contrasena clave cambiar password'],
  ['Solicitud de grado', 'pages/grado.html', 'grado graduacion requisitos solicitud proyecto de grado'],
  ['Turno de inscripción de cursos', 'pages/turnos.html', 'turno inscripcion matricula cursos'],
  ['Beca y promedio mínimo', 'pages/becas.html', 'beca descuento promedio fondo de becas'],
  ['Disponibilidad de aulas', 'pages/espacios.html#aulas', 'aulas salones laboratorios salas auditorios bloque campus disponibilidad'],
  ['Reserva de equipos', 'pages/espacios.html#equipos', 'equipos video beam portatil sede reserva'],
  ['Cronograma de fechas de pago', 'pages/pagos.html', 'fechas de pago cronograma recargo'],
  ['Actividades de horas libres', 'pages/horas-libres.html', 'horas libres 42 actividades qr asistencia bienestar'],
  ['Punto U: canales y citas', 'pages/ayuda.html', 'punto u atencion estudiante cita agendar whatsapp telefono horario de atencion'],
  ['Preguntas frecuentes', 'pages/ayuda.html', 'faq ayuda dudas como donde lo encuentro'],
  ['Potencia U: desarrollo humano (yoga, inteligencia emocional)', 'pages/bienestar.html', 'potencia u desarrollo humano talleres yoga cocina saludable habilidades'],
  ['Crea U: cultura (teatro, danzas, guitarra)', 'pages/bienestar.html', 'crea u cultura cursos teatro danzas guitarra origami tamboras'],
  ['Activa U: deportes y acondicionamiento físico', 'pages/bienestar.html', 'activa u deportes baloncesto padel futbol tenis taekwondo ajedrez gimnasio'],
  ['Elecciones UNAB (4 horas libres)', 'pages/bienestar.html', 'elecciones unab votar voto candidatos representantes'],
  ['Syllabus de los programas', 'pages/syllabus.html', 'syllabus programa cursos contenido guia de catedra socio humanisticos'],
  ['Mentoría y monitorías (Éxito Estudiantil)', 'pages/apoyo.html#exito', 'exito estudiantil meta mentoria monitor monitoria talleres banco de parciales'],
  ['Cursos de inglés y otros idiomas', 'pages/apoyo.html#lenguas', 'ingles frances portugues aleman lenguas toefl ielts club de conversacion'],
  ['Competencias digitales (insignia)', 'pages/apoyo.html#competencias', 'competencias digitales insignia digcomp curso'],
  ['Intercambio e internacionalización', 'pages/apoyo.html#internacional', 'intercambio internacionalizacion delfin rotaciones movilidad exterior'],
  ['Investigación: grupos, convocatorias y Apolo', 'pages/investigacion.html', 'investigacion grupos convocatorias apolo investigandoando transferencia de conocimiento'],
  ['Espacios UNAB: reservar espacios para eventos', 'pages/espacios.html', 'espacios unab reservas eventos auditorio reservar espacio'],
  ['CLIC: mesa de ayuda tecnológica', 'pages/ayuda.html', 'clic kayako mesa de ayuda soporte tecnico tecnologica'],
  ['Centros: EHLE y Bioeconomía Circular', 'pages/apoyo.html#centros', 'centros ehle escritura habla lectura bioeconomia circular'],
  ['Estado de clases de hoy', 'pages/horario.html', 'horario clases docente salon hoy'],
];

const root = document.body.dataset.root || '';
const active = document.body.dataset.active || '';

const NAV_BASE = 'px-3 py-2 rounded-md text-body font-semibold whitespace-nowrap hover:bg-unab-cream';
const navEstado = (on) => (on ? 'text-unab-text border-b-2 border-unab' : 'text-ink');
const actual = (on) => (on ? ' aria-current="page"' : '');

function navItem(l) {
  if (!l.items) {
    return `<a href="${root}${l.href}" class="${NAV_BASE} ${navEstado(l.id === active)}"${actual(l.id === active)}>${l.label}</a>`;
  }
  const grupoActivo = l.items.some((i) => i.id === active);
  const opciones = l.items
    .map((i) => `<li><a href="${root}${i.href}"${actual(i.id === active)}
      class="block px-4 py-2 rounded-md hover:bg-unab-cream ${i.id === active ? 'font-bold text-unab-text' : ''}">${i.label}</a></li>`)
    .join('');
  return `
    <div class="relative" data-menu>
      <button type="button" aria-expanded="false" aria-controls="menu-${l.id}"
        class="${NAV_BASE} ${navEstado(grupoActivo)} inline-flex items-center gap-1">
        ${l.label}<span aria-hidden="true" class="text-small transition-transform" data-flecha>▾</span>
      </button>
      <ul id="menu-${l.id}" hidden
        class="absolute left-0 top-full mt-2 min-w-[220px] bg-white rounded-xl shadow-lg p-2 z-50">${opciones}</ul>
    </div>`;
}

// Menú para móvil y tablet (< 1280 px): lista vertical; los grupos se muestran con sus opciones.
function menuMovil() {
  const enlace = (l, sub) => `<li><a href="${root}${l.href}"${actual(l.id === active)}
    class="block ${sub ? 'pl-8' : 'px-4'} pr-4 py-3 rounded-md font-semibold hover:bg-unab-cream ${l.id === active ? 'bg-unab-cream text-unab-text' : ''}">${l.label}</a></li>`;
  const items = NAV_LINKS.map((l) => (l.items
    ? `<li class="px-4 pt-3 pb-1 text-small font-bold uppercase">${l.label}</li>${l.items.map((i) => enlace(i, true)).join('')}`
    : enlace(l, false))).join('');
  return `<nav id="menu-movil" hidden class="xl:hidden border-t border-surface max-h-[calc(100vh-4rem)] overflow-y-auto" aria-label="Menú principal">
    <ul class="max-w-page mx-auto px-2 py-2">${items}</ul></nav>`;
}

// Avatar del header: foto del perfil si existe; si no, las iniciales.
function avatarHtml(iniciales) {
  const foto = MPU.storage.get('perfil:foto', null);
  return foto
    ? `<img data-avatar src="${foto}" alt="" class="w-9 h-9 rounded-full object-cover border-2 border-unab">`
    : `<span data-avatar class="w-9 h-9 rounded-full bg-unab text-ink font-bold flex items-center justify-center" aria-hidden="true">${iniciales}</span>`;
}
// La página de perfil lo llama al cambiar la foto.
MPU.refrescarAvatar = function () {
  const actual = document.querySelector('[data-avatar]');
  if (!actual) return;
  const n = (MPU.usuario && MPU.usuario.nombre) || 'E';
  actual.outerHTML = avatarHtml(n.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase());
};

// Menú del usuario (clic en las iniciales): perfil, carné, contraseña, trámites y accesos UNAB.
function menuPerfil(u, iniciales) {
  const item = (href, texto, externo) => `<li><a href="${externo ? href : root + href}"${externo ? ' target="_blank" rel="noopener noreferrer"' : ''}
    class="block px-4 py-2 rounded-md hover:bg-unab-cream">${texto}${externo ? '<span class="sr-only"> (abre en otra pestaña)</span>' : ''}</a></li>`;
  const titulo = (t) => `<li class="px-4 pt-2 pb-1 text-small font-bold uppercase" role="presentation">${t}</li>`;
  return `
    <div class="relative" data-menu>
      <button type="button" aria-expanded="false" aria-controls="menu-perfil" aria-label="Menú de perfil de ${MPU.esc(u.nombre || 'Estudiante')}"
        class="flex items-center gap-2 rounded-full pr-2 hover:bg-unab-cream text-left">
        ${avatarHtml(iniciales)}
        <span class="leading-tight hidden 2xl:block whitespace-nowrap max-w-[220px] truncate"><span class="block font-semibold">${MPU.esc(u.nombre || 'Estudiante')}</span><span class="block">${MPU.esc(u.facultad || '')}</span></span>
        <span aria-hidden="true" class="hidden sm:inline text-small transition-transform" data-flecha>▾</span>
      </button>
      <ul id="menu-perfil" hidden class="fixed sm:absolute left-2 right-2 sm:left-auto sm:right-0 top-[4.25rem] sm:top-full sm:mt-2 sm:w-72 bg-white rounded-xl shadow-lg p-2 z-50">
        <li class="px-4 py-3 border-b border-surface mb-1">
          <div class="font-bold">${MPU.esc(u.nombre || 'Estudiante')}</div>
          <div class="text-small">${MPU.esc(u.programa || '')} · ${MPU.esc(u.rol || 'Estudiante')}</div>
        </li>
        ${titulo('Mi cuenta')}
        ${item('pages/perfil.html', 'Mi perfil')}
        ${item('pages/perfil.html#carne', 'Mi carné UNAB')}
        ${item('pages/perfil.html#clave', 'Cambiar contraseña')}
        ${item('pages/perfil.html#tramites', 'Mis trámites y solicitudes')}
        ${u.rol === 'Administrador' ? titulo('Administración') + item('pages/admin.html', 'Administrar usuarios') : ''}
        ${titulo('Accesos UNAB')}
        ${item('https://correo.unab.edu.co', 'Correo institucional', true)}
        ${item('https://biblioteca.unab.edu.co', 'Biblioteca', true)}
        ${item('https://www.office.com', 'Office 365', true)}
        <li class="border-t border-surface mt-1 pt-1">
          <button type="button" data-cerrar-sesion class="block w-full text-left px-4 py-2 rounded-md font-bold hover:bg-unab-cream">Cerrar sesión</button>
        </li>
      </ul>
    </div>`;
}

MPU.plano = (t) => String(t).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

// Buscador global: devuelve [{titulo, href, seccion}] ordenados por coincidencia.
MPU.buscar = function (consulta) {
  const q = MPU.plano(consulta).trim();
  if (!q) return [];
  const palabras = q.split(/\s+/);
  const entradas = NAV_LINKS.flatMap((l) => (l.items ? l.items.map((i) => ({ titulo: i.label, href: i.href, seccion: l.label, claves: '' })) : [{ titulo: l.label, href: l.href, seccion: 'Menú', claves: '' }]))
    .concat(SITE_EXTRA.map(([titulo, href, claves]) => ({ titulo, href, seccion: 'Trámite o tema', claves })));
  const vistos = new Set();
  return entradas
    .map((e) => {
      const t = MPU.plano(e.titulo);
      const todo = `${t} ${e.claves}`;
      const ok = palabras.every((p) => todo.includes(p));
      return { e, puntaje: ok ? (t.includes(q) ? 2 : 1) : 0 };
    })
    .filter((x) => x.puntaje)
    .sort((a, b) => b.puntaje - a.puntaje)
    .map((x) => x.e)
    .filter((e) => { const k = e.titulo + e.href; if (vistos.has(k)) return false; vistos.add(k); return true; })
    .slice(0, 8);
};

function navbar() {
  const u = MPU.usuario || {};
  const iniciales = MPU.esc((u.nombre || 'E').split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase());
  const links = NAV_LINKS.map(navItem).join('');
  return `
  <header class="bg-white shadow-sm relative z-40">
    <div class="max-w-page mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
      <a href="${root}index.html" class="text-h3 text-unab-text">MiPortalU</a>
      <nav class="hidden xl:flex items-center gap-1" aria-label="Principal">${links}</nav>
      <div class="flex items-center gap-2 sm:gap-3 text-small">
        <div class="relative" data-menu>
          <button type="button" aria-expanded="false" aria-controls="menu-notif" id="btn-notif" aria-label="Notificaciones"
            class="relative inline-flex items-center px-2.5 sm:px-3 py-2 rounded-md border-2 border-unab hover:bg-unab-cream">
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>
            <span id="notif-n" hidden class="absolute -top-2 -right-2 min-w-[20px] h-5 px-1 rounded-full bg-danger text-white text-small font-bold flex items-center justify-center" style="background:#B42318"></span>
          </button>
          <div id="menu-notif" data-panel hidden class="fixed sm:absolute left-2 right-2 sm:left-auto sm:right-0 top-[4.25rem] sm:top-full sm:mt-2 sm:w-80 bg-white rounded-xl shadow-lg p-2 z-50">
            <div class="flex items-center justify-between px-3 py-2"><h2 class="font-bold">Notificaciones</h2>
              <button type="button" id="notif-leer" class="text-small font-bold text-unab-text hover:underline">Marcar como leídas</button></div>
            <ul id="notif-lista" class="max-h-96 overflow-y-auto"></ul>
          </div>
        </div>
        <button type="button" data-buscar aria-label="Buscar en el portal" aria-haspopup="dialog"
          class="inline-flex items-center gap-2 px-2.5 sm:px-3 py-2 rounded-md border-2 border-unab font-bold text-body hover:bg-unab-cream">
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          <span class="hidden 2xl:inline">Buscar</span>
        </button>
        ${menuPerfil(u, iniciales)}
        <button id="btn-menu-movil" type="button" aria-label="Menú" aria-expanded="false" aria-controls="menu-movil"
          class="xl:hidden inline-flex items-center gap-2 px-3 py-2 rounded-md border-2 border-unab font-bold text-body hover:bg-unab-cream">
          <span aria-hidden="true" data-icono>☰</span><span class="hidden sm:inline">Menú</span>
        </button>
      </div>
    </div>
    ${menuMovil()}
  </header>`;
}

function footer() {
  return `
  <footer class="bg-ink text-white mt-16">
    <div class="max-w-page mx-auto px-4 sm:px-6 pt-8 pb-24 sm:pb-8 text-small space-y-1">
      <div class="font-bold text-body">Universidad Autónoma de Bucaramanga</div>
      <div>Avenida 42 No. 48 - 11 · Bucaramanga, Colombia</div>
      <div>PBX: (607) 643 6111 · Centro de Contacto: 01 8000 931 170</div>
      <div>unab.edu.co · @unab_online</div>
      <div class="pt-2 opacity-80">NIT 890.200.499-9 | VIGILADA MINEDUCACIÓN</div>
    </div>
  </footer>`;
}

function chatButton() {
  if (active === 'chat') return '';
  return `<a href="${root}pages/chat.html"
    class="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 bg-unab hover:bg-unab-dark text-ink font-bold text-small sm:text-body px-4 py-2.5 sm:px-5 sm:py-3 rounded-full shadow-lg">
    Chat con mi secretaría</a>`;
}

document.getElementById('app-navbar')?.insertAdjacentHTML('afterbegin', navbar());

document.querySelector('[data-cerrar-sesion]')?.addEventListener('click', () => MPU.cerrarSesion());

// Menús desplegables: clic abre/cierra; Escape, clic fuera o salir con Tab los cierra.
const menus = [...document.querySelectorAll('[data-menu]')];
function abrirMenu(menu, abrir) {
  const btn = menu.querySelector('button');
  btn.setAttribute('aria-expanded', String(abrir));
  menu.querySelector('[data-panel], ul').hidden = !abrir;
  const flecha = menu.querySelector('[data-flecha]');
  if (flecha) flecha.style.transform = abrir ? 'rotate(180deg)' : '';
}
menus.forEach((menu) => {
  menu.querySelector('button').addEventListener('click', () => {
    const abrir = menu.querySelector('button').getAttribute('aria-expanded') !== 'true';
    menus.forEach((m) => abrirMenu(m, false));
    abrirMenu(menu, abrir);
  });
  menu.addEventListener('focusout', (e) => {
    if (e.relatedTarget && !menu.contains(e.relatedTarget)) abrirMenu(menu, false);
  });
});
document.addEventListener('click', (e) => {
  menus.forEach((m) => { if (!m.contains(e.target)) abrirMenu(m, false); });
});
// Menú móvil: el botón "Menú" abre/cierra el panel.
const btnMovil = document.getElementById('btn-menu-movil');
const panelMovil = document.getElementById('menu-movil');
function abrirMovil(abrir) {
  if (!btnMovil) return;
  btnMovil.setAttribute('aria-expanded', String(abrir));
  btnMovil.querySelector('[data-icono]').textContent = abrir ? '✕' : '☰';
  panelMovil.hidden = !abrir;
}
btnMovil?.addEventListener('click', () => abrirMovil(panelMovil.hidden));
// Si la ventana se agranda a escritorio, el panel queda cerrado.
window.matchMedia('(min-width: 1280px)').addEventListener('change', (e) => { if (e.matches) abrirMovil(false); });

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const abierto = menus.find((m) => m.querySelector('button').getAttribute('aria-expanded') === 'true');
  if (abierto) { abrirMenu(abierto, false); abierto.querySelector('button').focus(); }
  else if (btnMovil && !panelMovil.hidden) { abrirMovil(false); btnMovil.focus(); }
});

// Tablas: en pantallas chicas se desplazan de lado dentro de su tarjeta.
document.querySelectorAll('table.table').forEach((t) => {
  if (t.parentElement.classList.contains('tabla-scroll')) return;
  const envoltorio = document.createElement('div');
  envoltorio.className = 'tabla-scroll';
  t.replaceWith(envoltorio);
  envoltorio.appendChild(t);
});
document.getElementById('app-footer')?.insertAdjacentHTML('afterbegin', footer());
document.body.insertAdjacentHTML('beforeend', chatButton());

// Diálogo de búsqueda global (botón «Buscar» o tecla «/»)
document.body.insertAdjacentHTML('beforeend', `
  <dialog id="dlg-busqueda" aria-labelledby="busq-titulo" class="rounded-xl p-6 w-[min(94vw,560px)] shadow-lg backdrop:bg-black/40 mt-16 mx-auto">
    <h2 id="busq-titulo" class="text-h3">¿Qué estás buscando?</h2>
    <label class="label mt-3" for="busq-input">Trámite, página o tema</label>
    <input id="busq-input" type="search" class="field" placeholder="Ej. paz y salvo, horario, cupón…" autocomplete="off">
    <ul id="busq-resultados" class="mt-3 space-y-1" aria-live="polite"></ul>
    <div class="mt-4 text-right"><button type="button" id="busq-cerrar" class="btn btn-secondary">Cerrar</button></div>
  </dialog>`);
const dlgBusq = document.getElementById('dlg-busqueda');
const inputBusq = document.getElementById('busq-input');
function pintarBusqueda() {
  const r = MPU.buscar(inputBusq.value);
  document.getElementById('busq-resultados').innerHTML = !inputBusq.value.trim() ? ''
    : r.length ? r.map((x) => `<li><a href="${root}${x.href}" class="block px-3 py-2 rounded-md hover:bg-unab-cream"><span class="font-bold">${MPU.esc(x.titulo)}</span><span class="block text-small">${x.seccion}</span></a></li>`).join('')
      : '<li class="px-3 py-2">No encontramos resultados. Prueba con otra palabra o escribe a <a class="font-bold underline" href="' + root + 'pages/chat.html">Contacto</a>.</li>';
}
function abrirBusqueda() { inputBusq.value = ''; pintarBusqueda(); dlgBusq.showModal(); inputBusq.focus(); }
document.querySelector('[data-buscar]')?.addEventListener('click', abrirBusqueda);
inputBusq.addEventListener('input', pintarBusqueda);
inputBusq.addEventListener('keydown', (e) => { if (e.key === 'Enter') document.querySelector('#busq-resultados a')?.click(); });
document.getElementById('busq-cerrar').addEventListener('click', () => dlgBusq.close());
document.addEventListener('keydown', (e) => {
  if (e.key === '/' && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName) && !dlgBusq.open) { e.preventDefault(); abrirBusqueda(); }
});

// ===== Notificaciones =====
// Se calculan con los datos de ejemplo y el estado guardado. Los datos se cargan solo si la página no los trae.
const NOTIF_DATOS = [['cursos', 'cursos.js'], ['pagos', 'pagos.js'], ['horasLibres', 'horas-libres.js'], ['cronogramas', 'cronogramas.js']];
function cargarScript(src) {
  return new Promise((ok) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = ok;
    s.onerror = ok; // si falla, solo se omiten esas notificaciones
    document.head.appendChild(s);
  });
}
const hoyLocal = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const diasHasta = (iso) => Math.round((new Date(iso + 'T00:00:00') - new Date(hoyLocal() + 'T00:00:00')) / 86400000);
const fechaCorta = (iso) => MPU.fecha(new Date(iso + 'T00:00:00'));

MPU.calcularNotificaciones = function () {
  const n = [];
  if (MPU.pagos) {
    const pagados = MPU.storage.get('pagos:pagados', []).map((p) => p.id);
    MPU.pagos.conceptos.filter((c) => !pagados.includes(c.id)).forEach((c) => {
      const d = diasHasta(c.vence);
      if (d < 0) n.push({ id: `pago-vencido:${c.id}`, titulo: `Pago vencido: ${c.concepto}`, detalle: `Venció el ${fechaCorta(c.vence)}`, href: 'pages/pagos.html', urgente: true });
      else if (d <= 14) n.push({ id: `pago:${c.id}`, titulo: `Vence pronto: ${c.concepto}`, detalle: d === 0 ? 'Vence hoy' : `Vence en ${d} ${d === 1 ? 'día' : 'días'} (${fechaCorta(c.vence)})`, href: 'pages/pagos.html', urgente: d <= 3 });
    });
  }
  if (MPU.cursos) {
    if (MPU.storage.get('cursos:proyeccion', null) === null) {
      n.push({ id: 'proyeccion:' + MPU.cursos.periodoSiguiente, titulo: 'Proyecta tu próximo periodo', detalle: `Aún no guardas tu proyección del periodo ${MPU.cursos.periodoSiguiente}`, href: 'pages/cursos.html#proyeccion' });
    }
    MPU.cursos.lista.filter((c) => c.estado === 'curso' && c.cortes).forEach((c) => {
      const a = MPU.cursos.avanceCortes(c);
      if (a.necesita !== null && a.necesita > 3.5 && a.necesita <= 5) {
        n.push({ id: `riesgo:${c.codigo}:${a.pesoCalif}`, titulo: `${c.nombre}: ponte al día`, detalle: `Necesitas ${String(a.necesita.toFixed(1)).replace('.', ',')} en lo que resta para aprobar`, href: 'pages/calificaciones.html', urgente: true });
      }
    });
  }
  if (MPU.horasLibres) {
    const r = MPU.horasLibres.resumen();
    if (r.faltan > 0) {
      const reg = MPU.horasLibres.registros().map((x) => x.codigo);
      MPU.horasLibres.actividades.filter((a) => !reg.includes(a.codigo) && diasHasta(a.fecha) >= 0 && diasHasta(a.fecha) <= 2).forEach((a) => {
        n.push({ id: `hl:${a.codigo}`, titulo: `Horas libres: ${a.nombre}`, detalle: `${diasHasta(a.fecha) === 0 ? 'Hoy' : diasHasta(a.fecha) === 1 ? 'Mañana' : fechaCorta(a.fecha)} · +${a.horas} h`, href: 'pages/horas-libres.html' });
      });
    }
  }
  if (MPU.cronogramas) {
    MPU.cronogramas.eventos.filter((e) => e.nivel === 'Pregrado profesional' && diasHasta(e.fin) >= 0 && diasHasta(e.fin) <= 7 && diasHasta(e.inicio) <= 0).forEach((e) => {
      n.push({ id: `cron:${e.evento}`, titulo: e.evento, detalle: `Termina el ${fechaCorta(e.fin)}`, href: 'pages/cronogramas.html' });
    });
  }
  MPU.storage.get('solicitudes:mias', []).filter((s) => s.estado === 'En trámite').forEach((s) => {
    n.push({ id: `sol:${s.id}`, titulo: `Solicitud en trámite: ${s.servicio}`, detalle: s.radicado, href: 'pages/solicitudes.html' });
  });
  MPU.storage.get('ayuda:citas', []).filter((c) => diasHasta(c.fecha) >= 0 && diasHasta(c.fecha) <= 1).forEach((c) => {
    n.push({ id: `cita:${c.id}`, titulo: `Cita en Punto U (${c.sede})`, detalle: `${diasHasta(c.fecha) === 0 ? 'Hoy' : 'Mañana'} a las ${c.hora}`, href: 'pages/ayuda.html', urgente: true });
  });
  return n;
};

async function iniciarNotificaciones() {
  const base = root + 'js/data/';
  await Promise.all(NOTIF_DATOS.filter(([k]) => !MPU[k]).map(([, f]) => cargarScript(base + f)));
  // pagos.js, horas-libres.js y cronogramas.js necesitan MPU.storage (ya cargado) y cursos.js nada más
  const leidas = () => MPU.storage.get('notif:leidas', []);
  function pintar() {
    const todas = MPU.calcularNotificaciones();
    const sinLeer = todas.filter((x) => !leidas().includes(x.id));
    const cont = document.getElementById('notif-n');
    cont.hidden = sinLeer.length === 0;
    cont.textContent = sinLeer.length;
    document.getElementById('btn-notif').setAttribute('aria-label', sinLeer.length ? `Notificaciones, ${sinLeer.length} sin leer` : 'Notificaciones');
    document.getElementById('notif-lista').innerHTML = todas.length
      ? todas.sort((a, b) => (leidas().includes(a.id) - leidas().includes(b.id)) || (b.urgente === true) - (a.urgente === true)).map((x) => {
        const leida = leidas().includes(x.id);
        return `<li><a href="${root}${x.href}" data-notif="${MPU.esc(x.id)}" class="block px-3 py-2 rounded-md hover:bg-unab-cream ${leida ? 'opacity-70' : ''}">
          <span class="${leida ? '' : 'font-bold'}">${x.urgente && !leida ? '⚠ ' : ''}${MPU.esc(x.titulo)}</span><span class="block text-small">${MPU.esc(x.detalle)}</span></a></li>`;
      }).join('')
      : '<li class="px-3 py-4 text-center text-small">No tienes notificaciones.</li>';
  }
  document.getElementById('notif-leer').addEventListener('click', () => {
    MPU.storage.set('notif:leidas', [...new Set([...leidas(), ...MPU.calcularNotificaciones().map((x) => x.id)])]);
    pintar();
  });
  document.getElementById('notif-lista').addEventListener('click', (e) => {
    const a = e.target.closest('[data-notif]');
    if (a) MPU.storage.set('notif:leidas', [...new Set([...leidas(), a.dataset.notif])]);
  });
  pintar();
}
iniciarNotificaciones();
