// Syllabus: listado de programas con filtros y detalle de cursos (disponible para Ingeniería de Sistemas).
const $ = (id) => document.getElementById(id);
const S = MPU.apoyo.syllabus;
const plano = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const unico = (k) => [...new Set(S.programas.map((p) => p[k]))].sort();
$('f-facultad').insertAdjacentHTML('beforeend', unico('facultad').map((f) => `<option>${f}</option>`).join(''));
$('f-nivel').insertAdjacentHTML('beforeend', unico('nivel').map((f) => `<option>${f}</option>`).join(''));

function pintar() {
  const fac = $('f-facultad').value;
  const niv = $('f-nivel').value;
  const q = plano($('f-buscar').value.trim());
  const l = S.programas.filter((p) => (!fac || p.facultad === fac) && (!niv || p.nivel === niv) && (!q || plano(p.programa).includes(q)));
  $('contador').textContent = `${l.length} ${l.length === 1 ? 'programa' : 'programas'}`;
  $('vacio').classList.toggle('hidden', l.length > 0);
  $('programas').innerHTML = l.map((p) => `<tr><td>${p.facultad}</td><td>${p.nivel}</td><td>${p.modalidad}</td>
    <td style="white-space:normal">${MPU.esc(p.programa)}</td>
    <td><button type="button" data-programa="${MPU.esc(p.programa)}" class="font-bold text-unab-text hover:underline">Ver cursos<span class="sr-only"> de ${MPU.esc(p.programa)}</span></button></td></tr>`).join('');
  $('detalle').classList.add('hidden');
}
['f-facultad', 'f-nivel'].forEach((id) => $(id).addEventListener('change', pintar));
$('f-buscar').addEventListener('input', pintar);

$('programas').addEventListener('click', (e) => {
  const b = e.target.closest('[data-programa]');
  if (!b) return;
  const p = S.programas.find((x) => x.programa === b.dataset.programa);
  const d = $('detalle');
  if (p.plan) {
    const semestres = [...new Set(MPU.cursos.lista.map((c) => c.semestre))];
    d.innerHTML = `<h2 class="text-h3 mb-3">${p.programa}: plan de estudios</h2>` + semestres.map((s) => `<details class="mb-2" ${s === MPU.cursos.semestreActual ? 'open' : ''}>
      <summary class="cursor-pointer font-bold">Semestre ${s}</summary>
      <ul class="mt-2 pl-4 list-disc">${MPU.cursos.lista.filter((c) => c.semestre === s).map((c) => `<li>${MPU.esc(c.nombre)} · ${c.creditos} créditos</li>`).join('')}</ul></details>`).join('');
  } else {
    d.innerHTML = `<h2 class="text-h3 mb-2">${MPU.esc(p.programa)}</h2>
      <p>El detalle de cursos de este programa está disponible en el syllabus oficial de
      <a href="https://miportalu.unab.edu.co/modulos/calidad/guias2.php" target="_blank" rel="noopener noreferrer" class="font-bold text-unab-text underline">MiPortalU<span class="sr-only"> (abre en otra pestaña)</span></a>.</p>`;
  }
  d.classList.remove('hidden');
  d.focus();
});

// Pestañas
function tab(id) {
  const prog = id === 'programa';
  $('vista-programa').classList.toggle('hidden', !prog);
  $('vista-socio').classList.toggle('hidden', prog);
  $('tab-programa').setAttribute('aria-selected', String(prog));
  $('tab-socio').setAttribute('aria-selected', String(!prog));
  $('tab-programa').className = 'btn ' + (prog ? 'btn-primary' : 'btn-secondary');
  $('tab-socio').className = 'btn ' + (prog ? 'btn-secondary' : 'btn-primary');
}
document.querySelectorAll('[data-tab]').forEach((b) => b.addEventListener('click', () => tab(b.dataset.tab)));
$('socio').innerHTML = S.socio.map((c) => `<tr><td style="white-space:normal">${MPU.esc(c.nombre)}</td><td>${c.creditos}</td></tr>`).join('');
pintar();
