window.MPU = window.MPU || {};
MPU.beca = {
  promedioActual: 4.1,
  minimoRequerido: 3.8,
  semestreAnterior: 4.0,
  rendimiento: 82,
  notas: [
    { asignatura: 'Diseño de Interfaces', corte1: 4.2, corte2: 4.0, corte3: 4.1, definitiva: 4.1 },
    { asignatura: 'Programación Web', corte1: 4.5, corte2: 4.1, corte3: 4.3, definitiva: 4.3 },
    { asignatura: 'Bases de Datos', corte1: 3.6, corte2: 3.9, corte3: 3.8, definitiva: 3.8 },
  ],
};
// Formato colombiano: coma decimal
MPU.nota = (n) => n.toFixed(1).replace('.', ',');
