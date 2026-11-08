// Horas libres: requisito de grado de la UNAB (42 h). Se suman asistiendo a actividades de
// Bienestar; no dependen del horario de clases. Datos de ejemplo.
window.MPU = window.MPU || {};
MPU.horasLibres = {
  meta: 42,

  // Actividades disponibles (cada una otorga `horas`).
  actividades: [
    { codigo: 'K3950', fecha: '2026-11-10', inicio: '14:00', fin: '18:00', modalidad: 'Presencial', nombre: 'Convivir es incluir', lugar: 'Auditorio menor, campus Jardín (foro, música, cortometrajes y cuentería)', horas: 4 },
    { codigo: 'K4017', fecha: '2026-11-11', inicio: '14:00', fin: '16:00', modalidad: 'Presencial', nombre: 'Miradas que incluyen', lugar: 'Salones D-21 y D-25, campus Jardín', horas: 2 },
    { codigo: 'K3948', fecha: '2026-11-12', inicio: '14:00', fin: '18:00', modalidad: 'Presencial', nombre: 'Elige estar bien', lugar: 'Entrada bloque D, campus Jardín', horas: 4 },
    { codigo: 'K6023', fecha: '2026-11-13', inicio: '13:00', fin: '14:00', modalidad: 'Virtual', nombre: 'Cómo evitar los errores más comunes', lugar: 'Sesión en línea', horas: 1 },
    { codigo: 'K6044', fecha: '2026-11-17', inicio: '16:00', fin: '18:00', modalidad: 'Presencial', nombre: 'Tu próxima parada, el inglés', lugar: 'Lugar por confirmar', horas: 2 },
    { codigo: 'K4961', fecha: '2026-11-19', inicio: '13:00', fin: '20:00', modalidad: 'Presencial', nombre: 'Casa del terror', lugar: 'Biblioteca, campus Jardín', horas: 4 },
    { codigo: 'K7001', fecha: '2026-11-24', inicio: '08:00', fin: '16:00', modalidad: 'Presencial', nombre: 'Elecciones UNAB · Votación', lugar: 'Puestos de votación del campus (votar otorga 4 horas libres)', horas: 4 },
  ],

  // Asistencias ya cumplidas en periodos anteriores (ejemplo).
  previas: [
    { codigo: 'K2210', fecha: '2026-09-15', modalidad: 'Virtual', nombre: 'Taller de hábitos de estudio', horas: 2 },
    { codigo: 'K2543', fecha: '2026-09-29', modalidad: 'Presencial', nombre: 'Feria de bienestar universitario', horas: 4 },
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
