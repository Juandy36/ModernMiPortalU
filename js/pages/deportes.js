// Resultados ASCUN e Interoscas (Wireframe 10, funcionalidad 10).
const D = MPU.deportes;
let torneo = MPU.storage.get('deportes:torneo', D.torneos[0]);
if (!D.torneos.includes(torneo)) torneo = D.torneos[0];

function pintar() {
  document.getElementById('torneos').innerHTML = D.torneos
    .map((t) => `<button type="button" role="tab" data-torneo="${t}" aria-selected="${t === torneo}"
      class="btn ${t === torneo ? 'btn-primary' : 'btn-secondary'}">${t}</button>`)
    .join('');

  document.getElementById('resultados').innerHTML = D.resultados
    .filter((r) => r.torneo === torneo)
    .map((r) => `<tr><td>${r.fecha}</td><td>${r.disciplina}</td><td>${r.encuentro}</td><td class="font-bold">${r.resultado}</td></tr>`)
    .join('');

  const proximos = D.proximos.filter((p) => p.torneo === torneo);
  document.getElementById('proximos').innerHTML = proximos.length
    ? proximos.map((p) => `<li class="flex gap-4"><span class="font-bold text-unab-text w-28 shrink-0">${p.fecha}</span>
        <span>${p.disciplina} · ${p.encuentro}</span></li>`).join('')
    : '<li>No hay partidos programados.</li>';

  // Ordenada por puntos; la UNAB / Ingenierías (equipo propio) se resalta
  document.getElementById('posiciones').innerHTML = [...D.posiciones[torneo]]
    .sort((a, b) => b.pts - a.pts)
    .map((e, i) => {
      const propio = e.equipo === 'UNAB' || e.equipo === 'Ingenierías';
      return `<tr class="${propio ? 'bg-unab-cream font-bold' : ''}"><td>${i + 1}. ${e.equipo}</td><td>${e.pj}</td><td>${e.g}</td><td>${e.pts}</td></tr>`;
    })
    .join('');
}

document.getElementById('torneos').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-torneo]');
  if (!btn) return;
  torneo = btn.dataset.torneo;
  MPU.storage.set('deportes:torneo', torneo);
  pintar();
});

pintar();
