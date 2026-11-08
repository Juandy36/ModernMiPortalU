// Apoyo académico y syllabus (datos de docs/informacion.md; fechas y cupos de ejemplo).
window.MPU = window.MPU || {};
MPU.apoyo = {
  exito: {
    mentoria: { correo: 'mentoria_ingenieria@unab.edu.co', desc: 'Acompañamiento de un mentor de tu facultad para organizar tu plan de estudio y resolver dudas del semestre.' },
    monitoria: { pgaMinimo: 4.0, desc: 'Los monitores apoyan cursos de su programa. Requisito: promedio general acumulado (PGA) de 4,0 o más.' },
    talleres: [
      { id: 't1', nombre: 'Técnicas de estudio y gestión del tiempo', fecha: '2026-11-12', hora: '12:00 – 14:00', cupos: 25 },
      { id: 't2', nombre: 'Preparación de exámenes finales', fecha: '2026-11-18', hora: '14:00 – 16:00', cupos: 30 },
      { id: 't3', nombre: 'Cálculo: repaso para el examen final', fecha: '2026-11-20', hora: '10:00 – 12:00', cupos: 0 },
      { id: 't4', nombre: 'Escritura académica y citación', fecha: '2026-11-25', hora: '16:00 – 18:00', cupos: 20 },
    ],
    parciales: ['Cálculo diferencial', 'Programación I', 'Física mecánica', 'Estructuras de datos', 'Bases de datos'],
  },

  lenguas: {
    idiomas: [
      { nombre: 'Inglés', nota: 'Es requisito de grado.' },
      { nombre: 'Francés', nota: 'Cursos por niveles.' },
      { nombre: 'Portugués', nota: 'Cursos por niveles.' },
      { nombre: 'Alemán', nota: 'Cursos por niveles.' },
    ],
    extras: ['Club de conversación con hablantes nativos', 'Homologación del High School Diploma'],
    pruebas: ['TOEFL iBT', 'IELTS', 'APTIS', 'CELPE-BRAS'],
    contacto: 'Teléfono 607 643 61 11 ext. 2146 / 2242 · Campus CSU, 3.er piso.',
  },

  competencias: {
    horasPorCurso: 32,
    cursosParaInsignia: 3,
    ruta: [
      { nivel: 'Interacción digital', cursos: ['Interacción digital'] },
      { nivel: 'Analítica y contenido digital', cursos: ['Narrativas digitales', 'Visualización de datos', 'Identidad digital'] },
      { nivel: 'Tecnologías transformativas', cursos: ['IA y creatividad generativa', 'Legislación y ética digital', 'Bienestar digital'] },
    ],
    aprobados: ['Interacción digital'], // ejemplo
  },

  internacional: [
    { id: 'intercambio', nombre: 'Intercambio académico', pga: 3.5, detalle: 'Cursa hasta el 50 % de tu programa en otra universidad. Para países no hispanohablantes se pide inglés B2. Convocatorias: ago–oct (1.er semestre) y mar–may (2.º semestre).' },
    { id: 'virtual', nombre: 'Intercambio virtual', pga: 3.5, detalle: 'Hasta el 50 % del programa cursado en línea con una universidad aliada.' },
    { id: 'delfin', nombre: 'Programa Delfín (investigación de verano)', pga: 3.8, detalle: 'Estancia de investigación de verano. Requiere haber aprobado el 30 % del programa.' },
    { id: 'rotaciones', nombre: 'Rotaciones médicas / internado', pga: 3.8, detalle: 'Solo para Medicina.' },
    { id: 'insignia', nombre: 'Insignia digital intercultural', pga: 0, detalle: 'Niveles Navegante (60 puntos) y Embajador (100 puntos). Contacto: asistente-ori@unab.edu.co.' },
  ],

  // Listado de programas para consultar syllabus
  syllabus: {
    programas: [
      { facultad: 'Ingenierías', nivel: 'Pregrado profesional', modalidad: 'Presencial', programa: 'Ingeniería de Sistemas', plan: true },
      { facultad: 'Ingenierías', nivel: 'Pregrado profesional', modalidad: 'Presencial', programa: 'Ingeniería Biomédica' },
      { facultad: 'Ingenierías', nivel: 'Pregrado profesional', modalidad: 'Presencial', programa: 'Ingeniería Financiera' },
      { facultad: 'Ingenierías', nivel: 'Maestrías', modalidad: 'Presencial', programa: 'Maestría en Software Libre' },
      { facultad: 'Ciencias de la Salud', nivel: 'Pregrado profesional', modalidad: 'Presencial', programa: 'Medicina' },
      { facultad: 'Ciencias de la Salud', nivel: 'Pregrado profesional', modalidad: 'Presencial', programa: 'Enfermería' },
      { facultad: 'Ciencias de la Salud', nivel: 'Especialización', modalidad: 'Presencial', programa: 'Especialización en Anestesiología' },
      { facultad: 'Ciencias Económicas', nivel: 'Pregrado profesional', modalidad: 'Presencial', programa: 'Administración de Empresas' },
      { facultad: 'Ciencias Económicas', nivel: 'Pregrado profesional', modalidad: 'A distancia virtual', programa: 'Contaduría Pública' },
      { facultad: 'Comunicación y Artes', nivel: 'Pregrado profesional', modalidad: 'Presencial', programa: 'Comunicación Social' },
      { facultad: 'Derecho', nivel: 'Pregrado profesional', modalidad: 'Presencial', programa: 'Derecho' },
      { facultad: 'Educación', nivel: 'Tecnología', modalidad: 'Dual', programa: 'Tecnología en Gestión Empresarial' },
    ],
    socio: [
      { nombre: 'Cátedra UNAB', creditos: 2 },
      { nombre: 'Ética y ciudadanía', creditos: 2 },
      { nombre: 'Pensamiento crítico', creditos: 2 },
      { nombre: 'Arte y cultura contemporánea', creditos: 2 },
    ],
  },
};
