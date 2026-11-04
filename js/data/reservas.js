window.MPU = window.MPU || {};
MPU.reservas = {
  espacios: ['Cancha múltiple', 'Cancha de fútbol', 'Piscina', 'Gimnasio', 'Cancha de tenis'],
  franjas: ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00'],
};

// Franjas ocupadas "por otros": pseudoaleatorio pero estable para cada espacio y día.
MPU.reservas.ocupada = function (espacio, fechaISO, franja) {
  const s = espacio + fechaISO + franja;
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % 10 < 3; // ~30 % ocupadas
};
