// Componentes compartidos: navbar, footer y botón flotante de chat.
// Cada página define <body data-root="../" data-active="horario"> y este script los inyecta.

const NAV_LINKS = [
  { id: 'inicio', label: 'Inicio', href: 'index.html' },
  { id: 'horario', label: 'Mi horario', href: 'pages/horario.html' },
  { id: 'noticias', label: 'Noticias', href: 'pages/noticias.html' },
  { id: 'servicios', label: 'Servicios', href: 'pages/turnos.html' },
  { id: 'bienestar', label: 'Bienestar', href: 'pages/reservas-csu.html' },
  { id: 'chat', label: 'Contacto', href: 'pages/chat.html' },
];

const root = document.body.dataset.root || '';
const active = document.body.dataset.active || '';

function navbar() {
  const links = NAV_LINKS.map(
    (l) => `<a href="${root}${l.href}"
      class="px-3 py-2 rounded-md text-body font-semibold hover:bg-unab-cream ${
        l.id === active ? 'text-unab-dark border-b-2 border-unab' : 'text-ink'
      }">${l.label}</a>`
  ).join('');
  return `
  <header class="bg-white shadow-sm">
    <div class="max-w-page mx-auto px-6 h-16 flex items-center justify-between">
      <a href="${root}index.html" class="text-h3 text-unab-dark">MiPortalU</a>
      <nav class="flex items-center gap-1" aria-label="Principal">${links}</nav>
      <div class="flex items-center gap-3 text-small">
        <span class="w-9 h-9 rounded-full bg-unab text-white font-bold flex items-center justify-center">DR</span>
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
document.getElementById('app-footer')?.insertAdjacentHTML('afterbegin', footer());
document.body.insertAdjacentHTML('beforeend', chatButton());
