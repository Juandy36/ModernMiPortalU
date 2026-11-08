// Plan de estudios de ejemplo (Ingeniería de Sistemas). Estado: 'aprobado' | 'curso' | 'pendiente'.
window.MPU = window.MPU || {};
(function () {
  // [nombre, créditos, nota (solo aprobados)]
  const plan = {
    1: [['Cálculo diferencial', 3, 4.1], ['Programación I', 4, 4.4], ['Matemáticas discretas', 3, 3.9], ['Introducción a la ingeniería', 2, 4.5], ['Comunicación oral y escrita', 2, 4.2]],
    2: [['Cálculo integral', 3, 3.8], ['Programación II', 4, 4.3], ['Álgebra lineal', 3, 3.7], ['Física mecánica', 3, 3.5], ['Inglés I', 2, 4.6]],
    3: [['Cálculo vectorial', 3, 3.6], ['Estructuras de datos', 4, 4.0], ['Física electromagnética', 3, 3.4], ['Probabilidad y estadística', 3, 3.9], ['Inglés II', 2, 4.4]],
    4: [['Ecuaciones diferenciales', 3, 3.5], ['Análisis de algoritmos', 3, 3.8], ['Arquitectura de computadores', 3, 4.1], ['Ingeniería de software I', 3, 4.3], ['Inglés III', 2, 4.5]],
    5: [['Bases de datos', 3], ['Programación web', 3], ['Diseño de interfaces', 3], ['Sistemas operativos', 3], ['Redes de computadores', 3]],
    6: [['Ingeniería de software II', 3], ['Inteligencia artificial', 3], ['Seguridad informática', 3], ['Electiva profesional I', 3], ['Gestión de proyectos de TI', 3]],
    7: [['Computación en la nube', 3], ['Arquitectura de software', 3], ['Electiva profesional II', 3], ['Ética profesional', 2], ['Metodología de investigación', 3]],
    8: [['Proyecto de grado I', 3], ['Electiva profesional III', 3], ['Emprendimiento', 2], ['Electiva socio-humanística', 2], ['Auditoría de sistemas', 3]],
    9: [['Proyecto de grado II', 4], ['Electiva profesional IV', 3], ['Práctica profesional', 6]],
  };
  const semestreActual = 5;

  const cursos = [];
  Object.entries(plan).forEach(([sem, lista]) => {
    lista.forEach(([nombre, creditos, nota], i) => {
      const s = Number(sem);
      cursos.push({
        codigo: `IS${s}${i + 1}`,
        nombre, creditos, semestre: s,
        estado: s < semestreActual ? 'aprobado' : s === semestreActual ? 'curso' : 'pendiente',
        nota: s < semestreActual ? nota : null,
      });
    });
  });

  const sum = (a) => a.reduce((t, c) => t + c.creditos, 0);
  MPU.cursos = {
    programa: 'Ingeniería de Sistemas',
    periodoActual: '202660',
    periodoSiguiente: '202710',
    semestreActual,
    maxCreditos: 18, // tope de créditos por periodo (ejemplo)
    inicio: '2026-08-03',
    fin: '2026-11-28',
    lista: cursos,
    // Totales y promedio ponderado por créditos (solo cursos aprobados)
    resumen() {
      const aprobados = cursos.filter((c) => c.estado === 'aprobado');
      const pga = sum(aprobados) ? aprobados.reduce((t, c) => t + c.nota * c.creditos, 0) / sum(aprobados) : 0;
      return {
        creditosAprobados: sum(aprobados),
        creditosTotales: sum(cursos),
        creditosEnCurso: sum(cursos.filter((c) => c.estado === 'curso')),
        pga: Math.round(pga * 100) / 100,
      };
    },
  };
})();
