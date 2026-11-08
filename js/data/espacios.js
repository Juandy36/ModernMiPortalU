// Aulas y equipos de ejemplo. La ocupación es pseudoaleatoria pero estable para cada espacio y día.
window.MPU = window.MPU || {};
MPU.espacios = {
  franjas: ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00'], // cada una dura 2 h
  // Campus y cantidad de bloques como en MiPortalU (07-nov-2026)
  campus: [
    { id: 'central', nombre: 'Campus Central', bloques: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'] },
    { id: 'csu', nombre: 'CSU', bloques: ['1', '2', '3'] },
    { id: 'bosque', nombre: 'Campus El Bosque', bloques: ['J', 'K', 'L'] },
    { id: 'casona', nombre: 'La Casona', bloques: ['M'] },
  ],
  tipos: ['Salones', 'Laboratorios', 'Salas de informática', 'Auditorios'],

  // Espacios de un bloque: códigos como "B-101"
  deBloque(campusId, bloque) {
    const base = { Salones: ['101', '102', '201', '202'], Laboratorios: ['L01', 'L02'], 'Salas de informática': ['S01', 'S02'], Auditorios: ['AUD'] };
    return this.tipos.flatMap((tipo) => base[tipo].map((n) => ({
      codigo: `${bloque}-${n}`, tipo, campus: campusId,
      capacidad: tipo === 'Auditorios' ? 120 : tipo === 'Salones' ? 35 : 24,
    })));
  },

  ocupada(espacio, fechaISO, franja) {
    const s = espacio.codigo + espacio.campus + fechaISO + franja;
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return h % 10 < 4; // ~40 % ocupadas
  },

  // 'Disponible' (ninguna franja ocupada), 'Reservado' (casi todas) o 'Parcial'
  estado(espacio, fechaISO) {
    const n = this.franjas.filter((f) => this.ocupada(espacio, fechaISO, f)).length;
    return n === 0 ? 'Disponible' : n >= this.franjas.length - 1 ? 'Reservado' : 'Parcial';
  },

  sedesEquipos: [
    { id: 'jardin', nombre: 'El Jardín' },
    { id: 'bosque', nombre: 'El Bosque' },
    { id: 'csu', nombre: 'CSU' },
    { id: 'caldas', nombre: 'Instituto Caldas' },
    { id: 'estacion', nombre: 'Estación 42' },
    { id: 'casona', nombre: 'La Casona' },
  ],
  equipos: ['Video beam', 'Portátil', 'Cámara de video', 'Micrófono inalámbrico', 'Parlante portátil'],
};
