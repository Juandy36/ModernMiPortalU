window.MPU = window.MPU || {};
MPU.parqueadero = {
  vencimiento: '26 oct 2026',
  diasRestantes: 5,
  vehiculo: 'ABC123',
  mesARenovar: 'Noviembre 2026',
  nuevoVencimiento: '26 nov 2026',
  // Valores de ejemplo: el wireframe dice que dependen del tipo de vehículo.
  tarifas: { Carro: 95000, Moto: 45000 },
  historial: [
    { fecha: '26 sep 2026', mes: 'Octubre', estado: 'Pagado', valor: 95000 },
    { fecha: '26 ago 2026', mes: 'Septiembre', estado: 'Pagado', valor: 95000 },
  ],
};
MPU.pesos = (n) => '$' + n.toLocaleString('es-CO');
