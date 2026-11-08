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
    ],
  },
  {
    id: 'bienestar', label: 'Bienestar', items: [
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

const root = document.body.dataset.root || '';
const active = document.body.dataset.active || '';

const NAV_BASE = 'px-3 py-2 rounded-md text-body font-semibold hover:bg-unab-cream';
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

// Menú del usuario (clic en las iniciales): perfil, carné, contraseña, trámites y accesos UNAB.
function menuPerfil(u, iniciales) {
  const item = (href, texto, externo) => `<li><a href="${externo ? href : root + href}"${externo ? ' target="_blank" rel="noopener noreferrer"' : ''}
    class="block px-4 py-2 rounded-md hover:bg-unab-cream">${texto}${externo ? '<span class="sr-only"> (abre en otra pestaña)</span>' : ''}</a></li>`;
  const titulo = (t) => `<li class="px-4 pt-2 pb-1 text-small font-bold uppercase" role="presentation">${t}</li>`;
  return `
    <div class="relative" data-menu>
      <button type="button" aria-expanded="false" aria-controls="menu-perfil" aria-label="Menú de perfil de ${MPU.esc(u.nombre || 'Estudiante')}"
        class="flex items-center gap-2 rounded-full pr-2 hover:bg-unab-cream text-left">
        <span class="w-9 h-9 rounded-full bg-unab text-ink font-bold flex items-center justify-center" aria-hidden="true">${iniciales}</span>
        <span class="leading-tight hidden sm:block"><span class="block font-semibold">${MPU.esc(u.nombre || 'Estudiante')}</span><span class="block">${MPU.esc(u.facultad || '')}</span></span>
        <span aria-hidden="true" class="text-small transition-transform" data-flecha>▾</span>
      </button>
      <ul id="menu-perfil" hidden class="absolute right-0 top-full mt-2 w-72 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-lg p-2 z-50">
        <li class="px-4 py-3 border-b border-surface mb-1">
          <div class="font-bold">${MPU.esc(u.nombre || 'Estudiante')}</div>
          <div class="text-small">${MPU.esc(u.programa || '')} · ${MPU.esc(u.rol || 'Estudiante')}</div>
        </li>
        ${titulo('Mi cuenta')}
        ${item('pages/perfil.html', 'Mi perfil')}
        ${item('pages/perfil.html#carne', 'Mi carné UNAB')}
        ${item('pages/perfil.html#clave', 'Cambiar contraseña')}
        ${item('pages/perfil.html#tramites', 'Mis trámites y solicitudes')}
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

function navbar() {
  const u = MPU.usuario || {};
  const iniciales = MPU.esc((u.nombre || 'E').split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase());
  const links = NAV_LINKS.map(navItem).join('');
  return `
  <header class="bg-white shadow-sm relative z-40">
    <div class="max-w-page mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
      <a href="${root}index.html" class="text-h3 text-unab-text">MiPortalU</a>
      <nav class="hidden xl:flex items-center gap-1" aria-label="Principal">${links}</nav>
      <div class="flex items-center gap-3 text-small">
        ${menuPerfil(u, iniciales)}
        <button id="btn-menu-movil" type="button" aria-expanded="false" aria-controls="menu-movil"
          class="xl:hidden inline-flex items-center gap-2 px-3 py-2 rounded-md border-2 border-unab font-bold text-body hover:bg-unab-cream">
          <span aria-hidden="true" data-icono>☰</span> Menú
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
  menu.querySelector('ul').hidden = !abrir;
  menu.querySelector('[data-flecha]').style.transform = abrir ? 'rotate(180deg)' : '';
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
