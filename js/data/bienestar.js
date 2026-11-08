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

  elecciones: {
    que: 'Las Elecciones UNAB son el proceso en el que estudiantes eligen a sus representantes en los órganos de gobierno de la universidad.',
    organos: ['Comités curriculares', 'Consejos de facultad', 'Consejo académico', 'Junta directiva'],
    estimulo: 'Los estudiantes que votan reciben 4 horas libres, que se suman a tu requisito de grado.',
    requisitos: ['Promedio general acumulado (PGA) mínimo de 3,8.', 'Haber aprobado entre el 30 % y el 40 % de los créditos del programa, según el órgano.'],
    cronograma: [
      { etapa: 'Inscripción de candidatos', inicio: '2026-08-18', fin: '2026-10-09' },
      { etapa: 'Jornada electoral', inicio: '2026-10-22', fin: '2026-10-26' },
    ],
  },
};
