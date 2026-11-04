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

// Insignia de estado reutilizable: MPU.badge('Iniciada') -> HTML
MPU.badge = function (text) {
  const kind = /inici|aprob|pagad/i.test(text) ? 'ok' : /cancel|rechaz/i.test(text) ? 'danger' : 'pending';
  return `<span class="badge badge-${kind}">${text}</span>`;
};
