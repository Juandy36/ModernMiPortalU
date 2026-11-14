// Panel de administración: crear estudiantes y listar usuarios (la API valida que seas administrador).
(function () {
  const $ = (id) => document.getElementById(id);
  const u = MPU.usuario;

  if (!u || u.rol !== 'Administrador') {
    $('contenido').innerHTML = `<div class="card max-w-xl"><h1 class="text-h2">Acceso restringido</h1>
      <p class="mt-2">Esta sección es solo para la administración del portal.</p>
      <a href="../index.html" class="btn btn-primary mt-4">Volver al inicio</a></div>`;
    return;
  }

  let usuarios = [];
  const error = $('error');
  const mostrarError = (msg) => { error.textContent = msg; error.classList.toggle('hidden', !msg); };

  // Contraseña aleatoria que cumple la política (sin caracteres ambiguos).
  function generarClave() {
    const grupos = ['ABCDEFGHJKLMNPQRSTUVWXYZ', 'abcdefghijkmnpqrstuvwxyz', '23456789'];
    const todos = grupos.join('');
    const azar = (n) => { const a = new Uint32Array(1); crypto.getRandomValues(a); return a[0] % n; };
    const c = grupos.map((g) => g[azar(g.length)]);
    while (c.length < 12) c.push(todos[azar(todos.length)]);
    for (let i = c.length - 1; i > 0; i--) { const j = azar(i + 1); [c[i], c[j]] = [c[j], c[i]]; }
    return c.join('');
  }
  $('btn-generar').addEventListener('click', () => { $('a-clave').value = generarClave(); $('a-clave').focus(); });

  function pintarLista() {
    const q = MPU.plano($('a-buscar').value).trim();
    const vistos = usuarios.filter((x) => !q || MPU.plano(`${x.codigo} ${x.usuario} ${x.nombre} ${x.programa}`).includes(q));
    $('total').textContent = `(${vistos.length}${q ? ' de ' + usuarios.length : ''})`;
    $('tabla').hidden = !vistos.length;
    $('lista-estado').textContent = vistos.length ? '' : (q ? 'Ningún usuario coincide con la búsqueda.' : 'Aún no hay usuarios.');
    $('filas').innerHTML = vistos.map((x) => `<tr>
      <td class="font-mono">${MPU.esc(x.codigo || '—')}</td><td>${MPU.esc(x.usuario)}</td>
      <td>${MPU.esc(x.nombre)}</td><td>${MPU.esc(x.programa)}</td><td>${MPU.esc(x.rol)}</td></tr>`).join('');
  }
  $('a-buscar').addEventListener('input', pintarLista);

  async function cargar() {
    try {
      const r = await fetch('/api/usuarios');
      const cuerpo = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(cuerpo.error || 'No se pudo cargar la lista.');
      usuarios = cuerpo.usuarios;
      pintarLista();
    } catch (e) {
      $('lista-estado').textContent = e instanceof TypeError ? 'No hay conexión con el servidor.' : e.message;
    }
  }

  $('form-crear').addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = e.target;
    const boton = f.querySelector('button[type=submit]');
    mostrarError('');
    $('resultado').hidden = true;
    if (!f.nombre.value.trim() || !f.usuario.value.trim() || !f.clave.value) return mostrarError('Completa nombre, usuario y contraseña inicial.');
    boton.disabled = true;
    try {
      const r = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: f.nombre.value, usuario: f.usuario.value, programa: f.programa.value, clave: f.clave.value }),
      });
      const cuerpo = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(cuerpo.error || 'No se pudo crear el usuario.');
      $('r-codigo').textContent = cuerpo.codigo;
      $('r-usuario').textContent = cuerpo.usuario;
      $('r-clave').textContent = f.clave.value;
      $('copiado').textContent = '';
      $('resultado').hidden = false;
      f.reset();
      await cargar();
    } catch (err) {
      mostrarError(err instanceof TypeError ? 'No hay conexión con el servidor.' : err.message);
    } finally {
      boton.disabled = false;
    }
  });

  $('btn-copiar').addEventListener('click', async () => {
    const texto = `Código: ${$('r-codigo').textContent}\nUsuario: ${$('r-usuario').textContent}\nContraseña inicial: ${$('r-clave').textContent}`;
    try { await navigator.clipboard.writeText(texto); $('copiado').textContent = 'Copiado'; }
    catch { $('copiado').textContent = 'No se pudo copiar; selecciónalo a mano.'; }
  });

  cargar();
})();
