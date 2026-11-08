// Pagos y fechas: conceptos por pagar, pago en línea simulado, comprobantes y cronograma.
const $ = (id) => document.getElementById(id);
const P = MPU.pagos;
const fechaDe = (iso) => MPU.fecha(new Date(iso + 'T00:00:00'));
const dinero = (n) => '$' + n.toLocaleString('es-CO');
const pagados = () => MPU.storage.get('pagos:pagados', []);
const estaPagado = (id) => pagados().some((p) => p.id === id);
const hoy = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };

function aviso(msg) {
  const el = $('aviso');
  el.textContent = msg;
  el.className = 'px-3 py-2 rounded-md font-semibold';
  el.style.background = '#E3F4EA';
  el.style.color = '#1B5E38';
}

function estado(c) {
  if (estaPagado(c.id)) return MPU.badge('Pagado');
  return c.vence < hoy() ? '<span class="badge badge-danger">Vencido</span>' : MPU.badge('Pendiente');
}

function pintar() {
  const pendientes = P.conceptos.filter((c) => !estaPagado(c.id));
  $('total').textContent = dinero(pendientes.reduce((t, c) => t + c.valor, 0));

  $('conceptos').innerHTML = P.conceptos.map((c) => `<tr>
    <td>${MPU.esc(c.concepto)}</td><td>${c.tipo}</td><td>${fechaDe(c.vence)}</td><td>${dinero(c.valor)}</td><td>${estado(c)}</td>
    <td class="whitespace-nowrap">
      <button type="button" data-cupon="${c.id}" class="font-bold text-unab-text hover:underline">Descargar cupón<span class="sr-only"> ${MPU.esc(c.concepto)}</span></button>
      ${estaPagado(c.id) ? '' : `<button type="button" data-pagar="${c.id}" class="btn btn-primary ml-2">Pagar<span class="sr-only"> ${MPU.esc(c.concepto)}</span></button>`}
    </td></tr>`).join('');

  const hist = pagados();
  $('sin-historial').classList.toggle('hidden', hist.length > 0);
  $('historial').innerHTML = hist.map((h) => {
    const c = P.conceptos.find((x) => x.id === h.id);
    return `<tr><td>${h.fecha}</td><td>${MPU.esc(c.concepto)}</td><td>${dinero(c.valor)}</td><td>${MPU.esc(h.medio)}</td>
      <td><button type="button" data-comprobante="${h.id}" class="font-bold text-unab-text hover:underline">Comprobante<span class="sr-only"> ${MPU.esc(c.concepto)}</span></button></td></tr>`;
  }).join('');
}

$('cronograma').innerHTML = P.cronograma.map((f) => `<tr><td>${fechaDe(f.fecha)}</td><td>${f.concepto}</td><td>${f.nota}</td></tr>`).join('');
$('financiacion').innerHTML = P.financiacion.map((f) => `<article class="card"><h3 class="text-h3">${f.nombre}</h3><p class="text-small mt-2">${f.desc}</p></article>`).join('');
$('pago-medio').innerHTML = P.medios.map((m) => `<option>${m}</option>`).join('');

// Documentos para descargar: solo el documento
function cuponHtml(c) {
  return `<h1 style="font-size: 24px; font-weight: 800; margin-bottom: 12px;">Cupón de pago</h1>
    <table><tbody>
      <tr><th>Concepto</th><td>${MPU.esc(c.concepto)}</td></tr>
      <tr><th>Estudiante</th><td>${MPU.esc(MPU.usuario.nombre)}</td></tr>
      <tr><th>Referencia</th><td>${c.id.toUpperCase()}</td></tr>
      <tr><th>Fecha límite</th><td>${fechaDe(c.vence)}</td></tr>
      <tr><th>Valor a pagar</th><td>${dinero(c.valor)}</td></tr>
    </tbody></table>`;
}
function comprobanteHtml(c, h) {
  return `<h1 style="font-size: 24px; font-weight: 800; margin-bottom: 12px;">Comprobante de pago</h1>
    <table><tbody>
      <tr><th>Concepto</th><td>${MPU.esc(c.concepto)}</td></tr>
      <tr><th>Estudiante</th><td>${MPU.esc(MPU.usuario.nombre)}</td></tr>
      <tr><th>Fecha de pago</th><td>${h.fecha}</td></tr>
      <tr><th>Medio</th><td>${MPU.esc(h.medio)}</td></tr>
      <tr><th>Valor</th><td>${dinero(c.valor)}</td></tr>
      <tr><th>Estado</th><td>Pagado</td></tr>
    </tbody></table>`;
}

const dlg = $('dlg-pago');
let pagando = null;
$('conceptos').addEventListener('click', (e) => {
  const cup = e.target.closest('[data-cupon]');
  const pag = e.target.closest('[data-pagar]');
  if (cup) { const c = P.conceptos.find((x) => x.id === cup.dataset.cupon); MPU.imprimir(`Cupón · ${c.concepto}`, cuponHtml(c)); }
  if (pag) {
    pagando = P.conceptos.find((x) => x.id === pag.dataset.pagar);
    $('pago-detalle').innerHTML = `<strong>${MPU.esc(pagando.concepto)}</strong><br>Valor: ${dinero(pagando.valor)}`;
    dlg.showModal();
  }
});
$('pago-cancelar').addEventListener('click', () => dlg.close());
$('pago-confirmar').addEventListener('click', () => {
  MPU.storage.set('pagos:pagados', [...pagados(), { id: pagando.id, medio: $('pago-medio').value, fecha: MPU.fecha() }]);
  dlg.close();
  aviso(`Pago registrado: ${pagando.concepto}. Puedes descargar tu comprobante en «Pagos realizados».`);
  pintar();
});
$('historial').addEventListener('click', (e) => {
  const b = e.target.closest('[data-comprobante]');
  if (!b) return;
  const c = P.conceptos.find((x) => x.id === b.dataset.comprobante);
  const h = pagados().find((x) => x.id === c.id);
  MPU.imprimir(`Comprobante · ${c.concepto}`, comprobanteHtml(c, h));
});

pintar();
