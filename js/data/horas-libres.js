// Horas libres: requisito de grado de la UNAB (42 h). Se suman asistiendo a actividades de
// Bienestar; no dependen del horario de clases. Datos de ejemplo.
window.MPU = window.MPU || {};
MPU.horasLibres = {
  meta: 42,

  // Actividades disponibles (cada una otorga `horas`).
  // Actividades publicadas en MiPortalU (07-nov-2026). Las horas que otorgan se calculan con la duración.
  actividades: [
    { codigo: 'K6023', fecha: '2026-11-03', inicio: '13:00', fin: '14:00', modalidad: 'Virtual', nombre: 'Cómo evitar los errores más comunes', lugar: 'Sesión en línea', horas: 1 },
    { codigo: 'K6044', fecha: '2026-11-03', inicio: '16:00', fin: '18:00', modalidad: 'Presencial', nombre: 'Tu próxima parada, el inglés', lugar: 'Lugar por confirmar', horas: 2 },
    { codigo: 'K6046', fecha: '2026-11-04', inicio: '15:00', fin: '19:00', modalidad: 'Presencial', nombre: 'Fitness challenge', lugar: 'Lugar por confirmar', horas: 4 },
    { codigo: 'K6024', fecha: '2026-11-04', inicio: '13:00', fin: '14:00', modalidad: 'Virtual', nombre: 'Territorio diverso', lugar: 'Sesión en línea', horas: 1 },
    { codigo: 'K6025', fecha: '2026-11-05', inicio: '13:00', fin: '14:00', modalidad: 'Virtual', nombre: 'Mi Navidad interior: los adornos de mi año', lugar: 'Sesión en línea', horas: 1 },
    { codigo: 'K6026', fecha: '2026-11-09', inicio: '13:00', fin: '14:00', modalidad: 'Virtual', nombre: 'IA: ¿tu mejor aliada o tu mayor competencia en el mundo profesional?', lugar: 'Sesión en línea', horas: 1 },
    { codigo: 'K6029', fecha: '2026-11-11', inicio: '13:00', fin: '14:00', modalidad: 'Virtual', nombre: 'Conéctate con SIBU', lugar: 'Sesión en línea', horas: 1 },
    { codigo: 'K6032', fecha: '2026-11-12', inicio: '13:00', fin: '14:00', modalidad: 'Virtual', nombre: 'Que el cierre del semestre no te coja por sorpresa', lugar: 'Sesión en línea', horas: 1 },
    { codigo: 'K6036', fecha: '2026-11-17', inicio: '13:00', fin: '14:00', modalidad: 'Virtual', nombre: '¿Deuda mala? Ya veremos', lugar: 'Sesión en línea', horas: 1 },
    { codigo: 'K6037', fecha: '2026-11-18', inicio: '13:00', fin: '14:00', modalidad: 'Virtual', nombre: 'Historias que transforman', lugar: 'Sesión en línea', horas: 1 },
    { codigo: 'K6039', fecha: '2026-11-25', inicio: '13:00', fin: '14:00', modalidad: 'Virtual', nombre: 'Escuchar, comprender y cuidar', lugar: 'Sesión en línea', horas: 1 },
    { codigo: 'K6040', fecha: '2026-11-26', inicio: '13:00', fin: '14:00', modalidad: 'Virtual', nombre: 'Tu voz construye', lugar: 'Sesión en línea', horas: 1 },
  ],

  // Asistencias ya cumplidas en periodos anteriores (ejemplo).
  previas: [
    { codigo: 'K2210', fecha: '2026-09-15', modalidad: 'Virtual', nombre: 'Taller de hábitos de estudio', horas: 2 },
    { codigo: 'K2543', fecha: '2026-09-29', modalidad: 'Presencial', nombre: 'Feria de bienestar universitario', horas: 4 },
    { codigo: 'K4900', fecha: '2026-10-23', modalidad: 'Presencial', nombre: 'Elecciones UNAB · Votación', horas: 4 },
    { codigo: 'K2876', fecha: '2026-10-08', modalidad: 'Presencial', nombre: 'Torneo relámpago de integración', horas: 4 },
  ],
};

// Registros del estudiante en este navegador: [{ codigo, estado: 'qr' | 'asistio' }]
MPU.horasLibres.registros = () => MPU.storage.get('horaslibres:registros', []);

// Historial (previas + registros) y totales. Solo cuentan las asistencias confirmadas.
MPU.horasLibres.resumen = function () {
  const H = MPU.horasLibres;
  const nuevas = H.registros()
    .map((r) => ({ ...r, act: H.actividades.find((a) => a.codigo === r.codigo) }))
    .filter((r) => r.act);
  const cumplidas = H.previas.reduce((t, p) => t + p.horas, 0)
    + nuevas.filter((r) => r.estado === 'asistio').reduce((t, r) => t + r.act.horas, 0);
  return {
    cumplidas,
    meta: H.meta,
    faltan: Math.max(0, H.meta - cumplidas),
    pct: Math.min(100, Math.round((cumplidas / H.meta) * 100)),
    nuevas,
  };
};
