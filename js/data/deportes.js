window.MPU = window.MPU || {};
// Datos de ejemplo. Los resultados reales los publicará Bienestar Universitario.
// ASCUN: torneo entre universidades. Interoscas: torneo interno entre facultades.
MPU.deportes = {
  torneos: ['ASCUN', 'Interoscas'],
  resultados: [
    { torneo: 'ASCUN', fecha: '18 oct', disciplina: 'Fútbol sala', encuentro: 'UNAB vs. por definir', resultado: '—' },
    { torneo: 'ASCUN', fecha: '11 oct', disciplina: 'Baloncesto', encuentro: 'UNAB vs. por definir', resultado: '—' },
    { torneo: 'ASCUN', fecha: '04 oct', disciplina: 'Voleibol', encuentro: 'UNAB vs. por definir', resultado: '—' },
    { torneo: 'Interoscas', fecha: '20 oct', disciplina: 'Fútbol sala', encuentro: 'Ingenierías vs. por definir', resultado: '—' },
    { torneo: 'Interoscas', fecha: '13 oct', disciplina: 'Baloncesto', encuentro: 'Ingenierías vs. por definir', resultado: '—' },
  ],
  proximos: [
    { torneo: 'ASCUN', fecha: '08 nov', disciplina: 'Fútbol sala', encuentro: 'UNAB vs. por definir' },
    { torneo: 'ASCUN', fecha: '15 nov', disciplina: 'Baloncesto', encuentro: 'UNAB vs. por definir' },
    { torneo: 'Interoscas', fecha: '10 nov', disciplina: 'Voleibol', encuentro: 'Ingenierías vs. por definir' },
  ],
  posiciones: {
    ASCUN: [
      { equipo: 'UNAB', pj: 5, g: 3, pts: 10 },
      { equipo: 'Equipo B', pj: 5, g: 2, pts: 8 },
      { equipo: 'Equipo C', pj: 5, g: 1, pts: 4 },
    ],
    Interoscas: [
      { equipo: 'Ingenierías', pj: 4, g: 3, pts: 9 },
      { equipo: 'Ciencias de la Salud', pj: 4, g: 2, pts: 6 },
      { equipo: 'Ciencias Económicas', pj: 4, g: 1, pts: 3 },
    ],
  },
};
