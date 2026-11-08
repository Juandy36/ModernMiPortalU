// Bienestar Universitario: líneas de programas y datos de las Elecciones UNAB (de docs/informacion.md).
window.MPU = window.MPU || {};
MPU.bienestar = {
  lineas: [
    {
      id: 'potencia', nombre: 'Desarrollo humano', marca: 'Potencia U', correo: 'bienestar.potenciau@unab.edu.co',
      desc: 'Talleres para fortalecer tus habilidades personales, tu bienestar emocional y tu salud.',
      programas: [
        { id: 'p1', nombre: 'Power Skills Lab', modalidad: 'Presencial', horario: 'Martes 14:00 – 16:00', cupos: 20 },
        { id: 'p2', nombre: 'Co-Lab Leadership', modalidad: 'Presencial', horario: 'Miércoles 16:00 – 18:00', cupos: 18 },
        { id: 'p3', nombre: 'Equilibrio emocional Pro', modalidad: 'Presencial', horario: 'Jueves 12:00 – 14:00', cupos: 25 },
        { id: 'p4', nombre: 'Tensión Cero', modalidad: 'Presencial', horario: 'Lunes 12:00 – 13:00', cupos: 30 },
        { id: 'p5', nombre: 'Reset corporal', modalidad: 'Presencial', horario: 'Viernes 10:00 – 11:00', cupos: 0 },
        { id: 'p6', nombre: 'Flow (Yoga)', modalidad: 'Presencial', horario: 'Miércoles 07:00 – 08:00', cupos: 15 },
        { id: 'p7', nombre: 'Inteligencia emocional', modalidad: 'Virtual', horario: 'Martes 18:00 – 19:00', cupos: 40 },
        { id: 'p8', nombre: 'Habilidades sociales', modalidad: 'Virtual', horario: 'Jueves 18:00 – 19:00', cupos: 40 },
        { id: 'p9', nombre: 'Cocina saludable', modalidad: 'Virtual', horario: 'Sábado 09:00 – 11:00', cupos: 35 },
      ],
    },
    {
      id: 'crea', nombre: 'Cultura', marca: 'Crea U', correo: 'bienestar.creau@unab.edu.co',
      desc: 'Cursos culturales de 16 semanas que equivalen a 1 crédito.',
      programas: [
        { id: 'c1', nombre: 'Danzas', modalidad: 'Presencial', horario: 'Lunes 16:00 – 18:00', cupos: 22 },
        { id: 'c2', nombre: 'Tamboras', modalidad: 'Presencial', horario: 'Martes 16:00 – 18:00', cupos: 15 },
        { id: 'c3', nombre: 'Manualidades', modalidad: 'Presencial', horario: 'Miércoles 14:00 – 16:00', cupos: 20 },
        { id: 'c4', nombre: 'Teatro', modalidad: 'Presencial', horario: 'Jueves 16:00 – 18:00', cupos: 12 },
        { id: 'c5', nombre: 'Guitarra', modalidad: 'Presencial', horario: 'Viernes 14:00 – 16:00', cupos: 16 },
        { id: 'c6', nombre: 'Acrobacia en telas', modalidad: 'Presencial', horario: 'Sábado 08:00 – 10:00', cupos: 0 },
        { id: 'c7', nombre: 'Maquillaje artístico', modalidad: 'Presencial', horario: 'Lunes 14:00 – 16:00', cupos: 14 },
        { id: 'c8', nombre: 'Origami', modalidad: 'Presencial', horario: 'Martes 12:00 – 14:00', cupos: 20 },
        { id: 'c9', nombre: 'Estampado en tela', modalidad: 'Presencial', horario: 'Jueves 14:00 – 16:00', cupos: 18 },
        { id: 'c10', nombre: 'Cinestudio', modalidad: 'Virtual', horario: 'Miércoles 19:00 – 21:00', cupos: 50 },
      ],
    },
    {
      id: 'activa', nombre: 'Deportes', marca: 'Activa U', correo: 'bienestar.activau@unab.edu.co',
      desc: 'Disciplinas deportivas, selecciones y acondicionamiento físico.',
      programas: [
        { id: 'a1', nombre: 'Baloncesto', modalidad: 'Presencial', horario: 'Lunes y miércoles 17:00 – 19:00', cupos: 12 },
        { id: 'a2', nombre: 'Pádel', modalidad: 'Presencial', horario: 'Martes 18:00 – 20:00', cupos: 8 },
        { id: 'a3', nombre: 'Fútbol 11', modalidad: 'Presencial', horario: 'Jueves 17:00 – 19:00', cupos: 10 },
        { id: 'a4', nombre: 'Tenis de campo', modalidad: 'Presencial', horario: 'Viernes 16:00 – 18:00', cupos: 6 },
        { id: 'a5', nombre: 'Tenis de mesa', modalidad: 'Presencial', horario: 'Lunes 12:00 – 14:00', cupos: 10 },
        { id: 'a6', nombre: 'Futsala', modalidad: 'Presencial', horario: 'Miércoles 12:00 – 14:00', cupos: 0 },
        { id: 'a7', nombre: 'Taekwondo', modalidad: 'Presencial', horario: 'Martes y jueves 18:00 – 19:30', cupos: 14 },
        { id: 'a8', nombre: 'Voleibol', modalidad: 'Presencial', horario: 'Viernes 14:00 – 16:00', cupos: 12 },
        { id: 'a9', nombre: 'Squash', modalidad: 'Presencial', horario: 'Sábado 08:00 – 10:00', cupos: 4 },
        { id: 'a10', nombre: 'Ajedrez', modalidad: 'Presencial', horario: 'Jueves 12:00 – 14:00', cupos: 20 },
        { id: 'a11', nombre: 'Acondicionamiento físico', modalidad: 'Presencial', horario: 'Lunes a viernes 06:00 – 08:00', cupos: 30 },
      ],
    },
  ],

  // Contenido de Elecciones UNAB 2026 tomado de MiPortalU (07-nov-2026)
  elecciones: {
    que: 'Es el proceso de participación mediante el cual estudiantes y profesores eligen a quienes representarán sus intereses y perspectivas en diferentes organismos de dirección académica e institucional. Se realiza cada año.',
    organos: ['Comités Curriculares', 'Consejos de Facultad', 'Consejo Académico', 'Junta Directiva'],
    estimulo: 'Las personas de la comunidad estudiantil que ejerzan legítimamente su derecho al voto y lo acrediten reciben cuatro (4) horas libres de Bienestar Universitario.',
    estimuloProfesores: 'Los profesores de tiempo completo y medio tiempo que voten y lo acrediten tienen derecho a media jornada de descanso remunerado, dentro del semestre de las elecciones y previa concertación con su decano, director o coordinador.',
    requisitos: [
      'Ser estudiante activo de pregrado: estar matriculado en uno o varios cursos del periodo vigente.',
      'Para la Junta Directiva, el Consejo Académico o los consejos de facultad: haber aprobado como mínimo el 40 % de los créditos de un programa profesional o el 10 % de uno técnico o tecnológico.',
      'Para los Comités Curriculares de Programa: haber aprobado como mínimo el 30 % de los créditos de un programa profesional o el 10 % de uno técnico o tecnológico.',
      'Tener un promedio general acumulado igual o superior a 3,8.',
      'No haber recibido, por decisión en firme, una sanción por falta grave o gravísima.',
      'No tener vínculo laboral o contractual con la Universidad.',
      'No estar cursando los dos últimos semestres del programa.',
      'Acreditar la participación en los cursos o talleres de la Universidad sobre las funciones de la representación, la normativa y el liderazgo.',
    ],
    profesores: 'Los profesores interesados deben acreditar su condición de profesores de planta. La representación profesoral es ante el Consejo Académico, los consejos de facultad y los comités curriculares; la Junta Directiva no está incluida en esta convocatoria.',
    cronograma: [
      { etapa: 'Inscripción electrónica de listas', texto: '18 de agosto al 9 de octubre', fin: '2026-10-09' },
      { etapa: 'Modificación de las listas inscritas', texto: '10 de octubre', fin: '2026-10-10' },
      { etapa: 'Publicación de candidaturas que cumplen los requisitos', texto: '13 de octubre', fin: '2026-10-13' },
      { etapa: 'Periodo de campaña electoral', texto: '18 de agosto al 21 de octubre', fin: '2026-10-21' },
      { etapa: 'Diálogos con candidaturas', texto: '22 de octubre, de 10 a. m. a 12 m.', fin: '2026-10-22' },
      { etapa: 'Jornada electoral', texto: 'desde las 12:00 m. del 22 de octubre hasta las 5:00 p. m. del 26 de octubre', fin: '2026-10-26' },
      { etapa: 'Escrutinio', texto: 'inmediatamente después del cierre de la jornada electoral', fin: '2026-10-26' },
    ],
  },
};
