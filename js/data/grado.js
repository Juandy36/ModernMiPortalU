// Requisitos de grado (ejemplo). Reúne datos de cursos, horas libres, pagos y solicitudes.
// Requiere haber cargado antes: cursos.js, horas-libres.js y pagos.js.
window.MPU = window.MPU || {};
MPU.grado = {
  // avance: 0 a 1. estado: 'ok' | 'proceso' | 'pendiente'
  requisitos() {
    const c = MPU.cursos.resumen();
    const hl = MPU.horasLibres.resumen();
    const sinPagar = MPU.pagos.conceptos.length - MPU.storage.get('pagos:pagados', []).length;
    const solicitudGrado = MPU.storage.get('solicitudes:mias', []).find((s) => s.servicio === 'Solicitud de grado');
    const proyecto = MPU.cursos.lista.filter((x) => /^Proyecto de grado/.test(x.nombre));
    const proyAprobados = proyecto.filter((x) => x.estado === 'aprobado').length;

    const estado = (a) => (a >= 1 ? 'ok' : a > 0 ? 'proceso' : 'pendiente');
    const aCred = c.creditosAprobados / c.creditosTotales;
    const aHl = Math.min(1, hl.cumplidas / hl.meta);
    const aIng = 0.75; // ejemplo: tres de cuatro pasos del requisito de inglés
    const aPaz = sinPagar === 0 ? 1 : 0;
    const aProy = proyecto.length ? proyAprobados / proyecto.length : 0;
    const aSol = solicitudGrado ? (solicitudGrado.estado === 'Finalizada' ? 1 : 0.5) : 0;

    return [
      { id: 'creditos', nombre: 'Créditos del plan de estudios', avance: aCred, estado: estado(aCred),
        detalle: `${c.creditosAprobados} de ${c.creditosTotales} créditos aprobados`, href: 'cursos.html' },
      { id: 'hl', nombre: 'Horas libres', avance: aHl, estado: estado(aHl),
        detalle: `${hl.cumplidas} de ${hl.meta} horas`, href: 'horas-libres.html' },
      { id: 'ingles', nombre: 'Inglés (requisito de grado)', avance: aIng, estado: estado(aIng),
        detalle: 'Inglés I, II y III aprobados; falta certificar el nivel requerido (dato de ejemplo)', href: 'apoyo.html#lenguas' },
      { id: 'paz', nombre: 'Paz y salvo financiero', avance: aPaz, estado: estado(aPaz),
        detalle: sinPagar === 0 ? 'Estás al día con tus pagos' : `Tienes ${sinPagar} ${sinPagar === 1 ? 'pago pendiente' : 'pagos pendientes'}`, href: 'pagos.html' },
      { id: 'proyecto', nombre: 'Proyecto de grado', avance: aProy, estado: estado(aProy),
        detalle: `${proyAprobados} de ${proyecto.length} cursos de proyecto aprobados`, href: 'cursos.html' },
      { id: 'solicitud', nombre: 'Solicitud de grado', avance: aSol, estado: estado(aSol),
        detalle: solicitudGrado ? `Solicitud ${solicitudGrado.radicado}: ${solicitudGrado.estado}` : 'Aún no has iniciado la solicitud', href: 'solicitudes.html' },
    ];
  },
  // Porcentaje global: promedio del avance de todos los requisitos
  porcentaje() {
    const r = this.requisitos();
    return Math.round((r.reduce((t, x) => t + x.avance, 0) / r.length) * 100);
  },
};
