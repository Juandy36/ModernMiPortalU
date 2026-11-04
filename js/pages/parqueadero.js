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
      <td><button type="button" data-comprobante="${i}" class="font-bold text-unab-text hover:underline">Descargar PDF</button></td></tr>`)
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
  MPU.imprimir(
    `Comprobante de pago · Parqueadero ${h.mes}`,
    `<table>
      <tbody>
        <tr><th>Fecha de pago</th><td>${h.fecha}</td></tr>
        <tr><th>Mes</th><td>${h.mes}</td></tr>
        <tr><th>Vehículo</th><td>${P.vehiculo}${h.tipo ? ' · ' + h.tipo : ''}</td></tr>
        <tr><th>Valor</th><td>${MPU.pesos(h.valor)}</td></tr>
        <tr><th>Estado</th><td>${h.estado}</td></tr>
      </tbody>
    </table>`
  );
});

pintar();
