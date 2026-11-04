// Membresía del parqueadero (Wireframe 8, funcionalidad 8). El pago es simulado.
const P = MPU.parqueadero;
const pagos = () => MPU.storage.get('parqueadero:pagos', []);
const renovada = () => pagos().length > 0;
const historial = () => [...pagos(), ...P.historial];

document.getElementById('tipo').innerHTML = Object.keys(P.tarifas).map((t) => `<option>${t}</option>`).join('');
document.getElementById('vehiculo').textContent = `Vehículo registrado: ${P.vehiculo} (ejemplo)`;

function pintar() {
  const ok = renovada();
  document.getElementById('estado-membresia').innerHTML = ok
    ? MPU.badge('Pagado') + ' <strong>Membresía vigente</strong>'
    : `<span class="badge badge-pending">Vence en ${P.diasRestantes} días</span>`;
  document.getElementById('vencimiento').textContent = `Vencimiento: ${ok ? P.nuevoVencimiento : P.vencimiento}`;
  document.getElementById('mes-renovar').textContent = ok ? 'No hay meses pendientes' : P.mesARenovar;
  document.getElementById('tipo').disabled = ok;
  document.getElementById('linea-valor').classList.toggle('hidden', ok);
  const btn = document.getElementById('pagar');
  btn.disabled = ok;
  btn.textContent = ok ? 'Membresía renovada' : 'Pagar y renovar';
  document.getElementById('valor').textContent = MPU.pesos(P.tarifas[document.getElementById('tipo').value]);

  document.getElementById('historial').innerHTML = historial()
    .map((h, i) => `<tr><td>${h.fecha}</td><td>${h.mes}</td><td>${MPU.pesos(h.valor)}</td><td>${MPU.badge(h.estado)}</td>
      <td><button type="button" data-comprobante="${i}" class="font-bold text-unab-dark hover:underline">Descargar PDF</button></td></tr>`)
    .join('');
}

document.getElementById('tipo').addEventListener('change', pintar);

document.getElementById('pagar').addEventListener('click', () => {
  const tipo = document.getElementById('tipo').value;
  MPU.storage.set('parqueadero:pagos', [
    { fecha: MPU.fecha(), mes: P.mesARenovar.split(' ')[0], estado: 'Pagado', valor: P.tarifas[tipo], tipo },
  ]);
  const ok = document.getElementById('ok-pago');
  ok.textContent = `Listo: membresía renovada hasta el ${P.nuevoVencimiento}.`;
  ok.classList.remove('hidden');
  pintar();
});

// Comprobante: se imprime solo ese bloque (el navegador permite "Guardar como PDF").
document.getElementById('historial').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-comprobante]');
  if (!btn) return;
  const h = historial()[Number(btn.dataset.comprobante)];
  document.getElementById('comprobante').innerHTML = `
    <h1 class="text-h2">Comprobante de pago · Parqueadero UNAB</h1>
    <p class="mt-4">Fecha de pago: ${h.fecha}</p>
    <p>Mes: ${h.mes}</p>
    <p>Vehículo: ${P.vehiculo}</p>
    <p>Valor: ${MPU.pesos(h.valor)}</p>
    <p>Estado: ${h.estado}</p>
    <p class="mt-6 text-small">Documento de ejemplo generado por Modern MiPortalU.</p>`;
  document.body.classList.add('imprimiendo');
  window.print();
  document.body.classList.remove('imprimiendo');
});

pintar();
