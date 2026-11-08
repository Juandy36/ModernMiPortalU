// Beca y promedio. Los promedios y las notas salen de los datos de Calificaciones (js/data/cursos.js),
// que debe cargarse antes: así Becas, Calificaciones y Perfil siempre muestran las mismas cifras.
window.MPU = window.MPU || {};
(function () {
  const C = MPU.cursos;
  const r1 = (n) => Math.round(n * 10) / 10;
  MPU.beca = {
    minimoRequerido: 3.8,
    rendimiento: 82, // porcentaje de rendimiento (dato del sistema académico)
    promedioActual: r1(C.resumen().pga), // promedio acumulado (PGA)
    semestreAnterior: r1(C.promedioSemestre(C.semestreActual - 1)),
    // Cursos del periodo actual: cortes calificados y promedio de lo calificado hasta hoy
    notas: C.lista.filter((c) => c.estado === 'curso').map((c) => {
      const a = C.avanceCortes(c);
      return {
        asignatura: c.nombre,
        corte1: c.cortes[0], corte2: c.cortes[1], corte3: c.cortes[2],
        definitiva: a.pesoCalif ? r1(a.acum / a.pesoCalif) : null,
      };
    }),
  };
})();

// Formato colombiano: coma decimal (— si aún no hay nota)
MPU.nota = (n) => (n === null || n === undefined ? '—' : n.toFixed(1).replace('.', ','));
