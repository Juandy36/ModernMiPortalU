// Componentes compartidos: navbar, footer y botón flotante de chat.
// Cada página define <body data-root="../" data-active="horario"> y este script los inyecta.

// Los grupos con `items` se muestran como menú desplegable (mismo orden que en el inicio).
const NAV_LINKS = [
  { id: 'inicio', label: 'Inicio', href: 'index.html' },
  { id: 'horario', label: 'Mi horario', href: 'pages/horario.html' },
  { id: 'noticias', label: 'Noticias', href: 'pages/noticias.html' },
  {
    id: 'servicios', label: 'Servicios', items: [
      { id: 'turnos', label: 'Matrícula y turnos', href: 'pages/turnos.html' },
      { id: 'becas', label: 'Becas y promedio', href: 'pages/becas.html' },
    ],
  },
  {
    id: 'bienestar', label: 'Bienestar', items: [
      { id: 'reservas', label: 'Reservas CSU', href: 'pages/reservas-csu.html' },
      { id: 'parqueadero', label: 'Parqueadero', href: 'pages/parqueadero.html' },
      { id: 'semilleros', label: 'Semilleros', href: 'pages/semilleros.html' },
      { id: 'deportes', label: 'ASCUN e Interoscas', href: 'pages/deportes.html' },
    ],
  },
  { id: 'chat', label: 'Contacto', href: 'pages/chat.html' },
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

function navbar() {
  const links = NAV_LINKS.map(navItem).join('');
  return `
  <header class="bg-white shadow-sm relative z-40">
    <div class="max-w-page mx-auto px-6 h-16 flex items-center justify-between">
      <a href="${root}index.html" class="text-h3 text-unab-text">MiPortalU</a>
      <nav class="flex items-center gap-1" aria-label="Principal">${links}</nav>
      <div class="flex items-center gap-3 text-small">
        <span class="w-9 h-9 rounded-full bg-unab text-ink font-bold flex items-center justify-center" aria-hidden="true">DR</span>
        <div class="leading-tight"><div class="font-semibold">Estudiante</div><div>Ingenierías</div></div>
      </div>
    </div>
  </header>`;
}

function footer() {
  return `
  <footer class="bg-ink text-white mt-16">
    <div class="max-w-page mx-auto px-6 py-8 text-small space-y-1">
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
    class="fixed bottom-6 right-6 bg-unab hover:bg-unab-dark text-ink font-bold px-5 py-3 rounded-full shadow-lg">
    Chat con mi secretaría</a>`;
}

document.getElementById('app-navbar')?.insertAdjacentHTML('afterbegin', navbar());

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
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const abierto = menus.find((m) => m.querySelector('button').getAttribute('aria-expanded') === 'true');
  if (abierto) { abrirMenu(abierto, false); abierto.querySelector('button').focus(); }
});
document.getElementById('app-footer')?.insertAdjacentHTML('afterbegin', footer());
document.body.insertAdjacentHTML('beforeend', chatButton());
