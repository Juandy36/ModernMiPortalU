window.MPU = window.MPU || {};

// Horario semanal de ejemplo. El estado solo aplica al día en curso (lunes).
MPU.horarioSemana = {
  Lun: [
    { hora: '07:00 – 09:00', asignatura: 'Diseño de Interfaces', salon: 'Bloque B · 302', docente: 'Julián Santoyo', estado: 'Iniciada', detalle: '07:04' },
    { hora: '09:00 – 11:00', asignatura: 'Programación Web', salon: 'Bloque C · 105', docente: 'Por asignar', estado: 'Por iniciar' },
    { hora: '14:00 – 16:00', asignatura: 'Bases de Datos', salon: 'Bloque A · 201', docente: 'Por asignar', estado: 'Cancelada' },
  ],
  Mar: [
    { hora: '08:00 – 10:00', asignatura: 'Bases de Datos', salon: 'Bloque A · 201', docente: 'Por asignar', estado: 'Por iniciar' },
    { hora: '13:00 – 15:00', asignatura: 'Programación Web', salon: 'Bloque C · 105', docente: 'Por asignar', estado: 'Por iniciar' },
  ],
  Mié: [
    { hora: '07:00 – 09:00', asignatura: 'Diseño de Interfaces', salon: 'Bloque B · 302', docente: 'Julián Santoyo', estado: 'Por iniciar' },
    { hora: '15:00 – 17:00', asignatura: 'Bases de Datos', salon: 'Bloque A · 201', docente: 'Por asignar', estado: 'Por iniciar' },
  ],
  Jue: [
    { hora: '09:00 – 11:00', asignatura: 'Programación Web', salon: 'Bloque C · 105', docente: 'Por asignar', estado: 'Por iniciar' },
    { hora: '14:00 – 16:00', asignatura: 'Diseño de Interfaces', salon: 'Bloque B · 302', docente: 'Julián Santoyo', estado: 'Por iniciar' },
  ],
  Vie: [
    { hora: '10:00 – 12:00', asignatura: 'Bases de Datos', salon: 'Bloque A · 201', docente: 'Por asignar', estado: 'Por iniciar' },
  ],
  Sáb: [],
};

// Horario del día en curso (lo usa la pantalla de inicio).
MPU.horario = MPU.horarioSemana.Lun;

// Horas libres por semana: huecos entre clases del mismo día.
MPU.horasLibresSemana = function () {
  const aMin = (t) => { const [h, m] = t.trim().split(':').map(Number); return h * 60 + m; };
  let libres = 0;
  for (const clases of Object.values(MPU.horarioSemana)) {
    const rangos = clases.map((c) => c.hora.split('–').map(aMin)).sort((a, b) => a[0] - b[0]);
    for (let i = 1; i < rangos.length; i++) libres += Math.max(0, rangos[i][0] - rangos[i - 1][1]);
  }
  return libres / 60;
};
