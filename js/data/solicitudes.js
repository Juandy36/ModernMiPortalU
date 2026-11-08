// Catálogo de servicios del CESAF (Centro de Soluciones Académicas y Financieras).
// `href`: el servicio ya existe como página del rediseño (se abre en lugar de crear una solicitud).
window.MPU = window.MPU || {};
MPU.solicitudes = {
  categorias: [
    {
      id: 'academico', nombre: 'Académico', grupos: [
        { nombre: 'Certificados y constancias', servicios: [
          { nombre: 'Descargar certificado de notas (pregrado)', href: 'calificaciones.html', desc: 'Descarga el certificado con los cursos aprobados y tu promedio.' },
          { nombre: 'Solicitud de certificados (SIS)', desc: 'Solicita certificados de estudio, de matrícula y de conducta.' },
        ] },
        { nombre: 'Novedades académicas', servicios: [
          { nombre: 'Reconocimiento de cursos', desc: 'Solicita que se reconozcan cursos aprobados en otra institución o programa.' },
        ] },
        { nombre: 'Prácticas formativas', servicios: [
          { nombre: 'Formulario practicantes', desc: 'Registra tus datos para iniciar el proceso de práctica.' },
          { nombre: 'Mis prácticas académicas', desc: 'Consulta el estado de tus prácticas académicas.' },
          { nombre: 'Prácticas profesionales', desc: 'Solicita la práctica profesional de tu programa.' },
        ] },
      ],
    },
    {
      id: 'financiero', nombre: 'Financiero', grupos: [
        { nombre: 'Beneficios económicos', servicios: [
          { nombre: 'Solicitud becas y descuentos', href: 'becas.html', desc: 'Consulta tu beca y tu promedio, y las fechas de postulación.' },
        ] },
        { nombre: 'Certificados y constancias', servicios: [
          { nombre: 'Certificado de becas', desc: 'Trámite para solicitar un certificado de las becas que tienes.' },
          { nombre: 'Créditos proyectados (pregrado)', desc: 'Trámite para solicitar un certificado con el valor proyectado de tus créditos.' },
          { nombre: 'Créditos proyectados (posgrado, 1 y 2 semestres)', desc: 'Certificado con el valor proyectado de créditos de posgrado.' },
          { nombre: 'Créditos proyectados ICETEX (pregrado)', desc: 'Certificado con el valor proyectado para tu crédito ICETEX de pregrado.' },
          { nombre: 'Créditos proyectados ICETEX (posgrado)', desc: 'Certificado con el valor proyectado para tu crédito ICETEX de posgrado.' },
          { nombre: 'Declaración de renta', desc: 'Certificado de pagos para tu declaración de renta.' },
          { nombre: 'Paz y salvo financiero', desc: 'Trámite para solicitar el certificado que acredita estar al día con la universidad.' },
          { nombre: 'Planes de financiación (Flexis / Horizontes)', desc: 'Certificado de tu plan de financiación.' },
          { nombre: 'Valor adeudado', desc: 'Consulta el valor que tienes pendiente por pagar.' },
          { nombre: 'Valor adeudado derechos de grado', desc: 'Consulta el valor pendiente por derechos de grado.' },
          { nombre: 'Valor cancelado', desc: 'Certificado de lo que has pagado en el periodo.' },
          { nombre: 'Valor matrícula', desc: 'Certificado con el valor de tu matrícula.' },
        ] },
        { nombre: 'Facturación', servicios: [
          { nombre: 'Facturación a terceros', desc: 'Solicita que la factura de tu matrícula se emita a nombre de un tercero.' },
        ] },
        { nombre: 'Pagos y recaudos', servicios: [
          { nombre: 'Multa biblioteca', desc: 'Consulta y paga multas de la biblioteca.' },
          { nombre: 'Pago de certificados', desc: 'Paga el valor de los certificados que solicitaste.' },
          { nombre: 'Pago de servicios académicos', desc: 'Paga cupones y servicios académicos.' },
        ] },
        { nombre: 'Saldos y devoluciones', servicios: [
          { nombre: 'Devolución de saldo a favor', desc: 'Solicita la devolución de un saldo a favor.' },
          { nombre: 'Retiro de retenciones financieras', desc: 'Solicita retirar una retención financiera.' },
          { nombre: 'Traslado de saldo a favor', desc: 'Solicita trasladar tu saldo a favor a otro periodo.' },
        ] },
      ],
    },
    {
      id: 'perfil', nombre: 'Perfil estudiantil', grupos: [
        { nombre: 'Datos del estudiante', servicios: [
          { nombre: 'Actualización de datos', href: 'perfil.html', desc: 'Actualiza tu nombre, programa y contraseña.' },
          { nombre: 'Actualización de EPS', desc: 'Informa tu EPS actual para mantener tu afiliación al día.' },
        ] },
      ],
    },
    {
      id: 'tramites', nombre: 'Trámites', grupos: [
        { nombre: 'Gestión', servicios: [
          { nombre: 'Competencias Digitales', desc: 'Consulta el estado de tus competencias digitales y la guía de cátedra.' },
          { nombre: 'Consultar turnos de inscripción', href: 'turnos.html', desc: 'Consulta la fecha y hora asignadas para inscribir tus cursos.' },
          { nombre: 'Cursos de inglés', desc: 'Consulta la información relacionada con tus cursos de inglés.' },
          { nombre: 'Cursos inscritos', href: 'cursos.html', desc: 'Consulta los cursos inscritos en tu periodo, con duración y fechas.' },
          { nombre: 'Proyección de cursos', href: 'cursos.html#proyeccion', desc: 'Consulta tu avance curricular y proyecta la inscripción del próximo periodo.' },
          { nombre: 'Renovación créditos Icetex', desc: 'Gestiona la renovación de tu crédito educativo con Icetex.' },
          { nombre: 'Selección de cursos Menores', desc: 'Elige los cursos de una ruta de aprendizaje de un Menor.' },
          { nombre: 'Solicitud de grado', desc: 'Consulta el cronograma, las modalidades de grado y los requisitos para iniciar el trámite.' },
          { nombre: 'Solicitud Plan Horizontes', desc: 'Conoce el Programa Horizontes y sus fechas de postulación.' },
          { nombre: 'Soporte para el proceso de grado', desc: 'Registra una solicitud de soporte relacionada con tu proceso de grado.' },
        ] },
      ],
    },
  ],
};
