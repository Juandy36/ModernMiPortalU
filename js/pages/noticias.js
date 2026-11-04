// Noticias y actividades (Wireframe 3, funcionalidad 2): filtros por categoría y "Leer más".
const CATEGORIAS = ['Todas', 'Académica', 'Bienestar', 'Eventos', 'Deportes'];
let filtro = 'Todas';

function pintarFiltros() {
  document.getElementById('filtros').innerHTML = CATEGORIAS.map(
    (c) => `<button type="button" data-cat="${c}" aria-pressed="${c === filtro}"
      class="btn ${c === filtro ? 'btn-primary' : 'btn-secondary'}">${c}</button>`
  ).join('');
}

function pintarLista() {
  const items = MPU.noticias.filter((n) => filtro === 'Todas' || n.categoria === filtro);
  document.getElementById('lista').innerHTML = items
    .map(
      (n, i) => `<article class="card">
        <div class="flex justify-between text-small">
          <span class="font-bold text-unab-text">${n.categoria}</span><span>${n.fecha}</span>
        </div>
        <h2 class="text-h3 mt-2">${n.titulo}</h2>
        <p class="mt-2">${n.resumen}</p>
        <p id="texto-${i}" class="mt-2 hidden">${n.texto}</p>
        <button type="button" data-leer="${i}" aria-expanded="false" class="mt-3 font-bold text-unab-text hover:underline">Leer más →</button>
      </article>`
    )
    .join('');
  document.getElementById('sin-noticias').classList.toggle('hidden', items.length > 0);
}

document.getElementById('filtros').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-cat]');
  if (!btn) return;
  filtro = btn.dataset.cat;
  pintarFiltros();
  pintarLista();
});

document.getElementById('lista').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-leer]');
  if (!btn) return;
  const texto = document.getElementById('texto-' + btn.dataset.leer);
  const abierto = texto.classList.toggle('hidden') === false;
  btn.textContent = abierto ? 'Leer menos ←' : 'Leer más →';
  btn.setAttribute('aria-expanded', String(abierto));
});

pintarFiltros();
pintarLista();
