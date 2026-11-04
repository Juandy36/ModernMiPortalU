// Persistencia simple en localStorage. Todo con try/catch: puede estar bloqueado o vacío.
window.MPU = window.MPU || {};

MPU.storage = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem('mpu:' + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem('mpu:' + key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
};

// Fecha con el formato de la guía de estilo: «21 oct 2026» (o «21 oct» sin año).
MPU.fecha = function (d = new Date(), conAnio = true) {
  const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  return `${String(d.getDate()).padStart(2, '0')} ${meses[d.getMonth()]}${conAnio ? ' ' + d.getFullYear() : ''}`;
};

// Escapa texto escrito por el usuario antes de meterlo en innerHTML.
MPU.esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Insignia de estado reutilizable: MPU.badge('Iniciada') -> HTML
MPU.badge = function (text) {
  // "Por iniciar" también contiene "inici": solo es verde si EMPIEZA por "Iniciada".
  const kind = /^(iniciad|aprobad|pagad|inscrit)/i.test(text) ? 'ok' : /^(cancelad|rechazad)/i.test(text) ? 'danger' : 'pending';
  return `<span class="badge badge-${kind}">${text}</span>`;
};
