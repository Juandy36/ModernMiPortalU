window.MPU = window.MPU || {};
MPU.beca = {
  minimoRequerido: 3.8,
  semestreAnterior: 4.0,
  rendimiento: 82, // porcentaje de rendimiento (dato del sistema académico)
  notas: [
    { asignatura: 'Diseño de Interfaces', corte1: 4.2, corte2: 4.0, corte3: 4.1, definitiva: 4.1 },
    { asignatura: 'Programación Web', corte1: 4.5, corte2: 4.1, corte3: 4.3, definitiva: 4.3 },
    { asignatura: 'Bases de Datos', corte1: 3.6, corte2: 3.9, corte3: 3.8, definitiva: 3.8 },
  ],
};
// Promedio actual = promedio de las definitivas (sin créditos, porque no los tenemos).
MPU.beca.promedioActual =
  Math.round((MPU.beca.notas.reduce((s, n) => s + n.definitiva, 0) / MPU.beca.notas.length) * 10) / 10;

// Formato colombiano: coma decimal
MPU.nota = (n) => n.toFixed(1).replace('.', ',');
