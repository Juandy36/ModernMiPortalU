window.MPU = window.MPU || {};
MPU.turnos = {
  actual: 'Turno 2',
  opciones: ['Turno 1', 'Turno 2', 'Turno 3', 'Turno 4'],
  // Solicitudes de ejemplo (las nuevas se guardan en localStorage)
  solicitudes: [
    { fecha: '21 oct 2026', turno: 'Turno 1', estado: 'En revisión' },
    { fecha: '14 oct 2026', turno: 'Turno 1', estado: 'Aprobada' },
    { fecha: '02 sep 2026', turno: 'Turno 3', estado: 'Rechazada' },
  ],
};
