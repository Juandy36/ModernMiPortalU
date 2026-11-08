// Pagos de ejemplo: cupones, multas, cronograma de fechas de pago y mecanismos de financiación.
window.MPU = window.MPU || {};
MPU.pagos = {
  medios: ['PSE (débito desde tu banco)', 'Tarjeta de crédito', 'Bancos aliados (efectivo o transferencia)', 'Flexi-UNAB', 'Cesantías'],

  // Conceptos por pagar (el estado "Pagado" se guarda en el navegador)
  conceptos: [
    { id: 'cup-202710', tipo: 'Cupón', concepto: 'Matrícula periodo 202710', valor: 4850000, vence: '2026-12-15' },
    { id: 'mul-bib', tipo: 'Multa', concepto: 'Multa de biblioteca (préstamo vencido)', valor: 8400, vence: '2026-11-30' },
    { id: 'cer-notas', tipo: 'Certificado', concepto: 'Certificado de notas (pago de certificados)', valor: 22000, vence: '2026-11-20' },
  ],

  // Cronograma de fechas de pago de matrícula, estudiantes continuos (ejemplo)
  cronograma: [
    { fecha: '2026-12-15', concepto: 'Pago ordinario', nota: 'Sin recargo' },
    { fecha: '2027-01-12', concepto: 'Pago extraordinario', nota: 'Recargo del 5 %' },
    { fecha: '2027-01-26', concepto: 'Último día de pago', nota: 'Recargo del 10 %. Después se cancela la inscripción de cursos.' },
  ],

  financiacion: [
    { nombre: 'Flexi-UNAB', desc: 'Financia tu matrícula en cuotas directamente con la universidad.' },
    { nombre: 'ICETEX', desc: 'Crédito educativo para pregrado y posgrado, con opciones de renovación.' },
    { nombre: 'Pago con cesantías', desc: 'Usa tus cesantías para pagar la matrícula con el fondo que corresponda.' },
    { nombre: 'Plan Horizontes', desc: 'Programa de apoyo con fechas de postulación propias.' },
  ],
};
