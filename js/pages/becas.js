// Becas y promedio (Wireframe 7, funcionalidad 6).
const B = MPU.beca;

document.getElementById('prom-actual').textContent = MPU.nota(B.promedioActual);
document.getElementById('prom-minimo').textContent = MPU.nota(B.minimoRequerido);
document.getElementById('prom-anterior').textContent = MPU.nota(B.semestreAnterior);

// Comparación con el semestre anterior
const cambio = Math.round((B.promedioActual - B.semestreAnterior) * 10) / 10;
document.getElementById('tendencia').textContent =
  cambio > 0 ? `Subiste ${MPU.nota(cambio)} este semestre` : cambio < 0 ? `Bajaste ${MPU.nota(-cambio)} este semestre` : 'Igual que el semestre anterior';

// Barra de rendimiento
document.getElementById('barra-relleno').style.width = `${B.rendimiento}%`;
document.getElementById('barra').setAttribute('aria-valuenow', B.rendimiento);

// Mensaje: ¿mantiene la beca?
const margen = Math.round((B.promedioActual - B.minimoRequerido) * 10) / 10;
const msg = document.getElementById('mensaje-beca');
if (margen > 0) {
  msg.innerHTML = `<strong>${B.rendimiento} %</strong> · Estás ${MPU.nota(margen)} por encima del promedio mínimo para mantener tu beca.`;
} else if (margen === 0) {
  msg.innerHTML = `<strong>${B.rendimiento} %</strong> · Estás justo en el promedio mínimo. <span class="text-unab-text font-semibold">Cuida tus próximas notas.</span>`;
} else {
  msg.innerHTML = `<strong>${B.rendimiento} %</strong> · <span class="text-danger font-semibold">Estás ${MPU.nota(-margen)} por debajo del mínimo para mantener tu beca.</span> Habla con tu secretaría.`;
}

// Tabla de notas. Las definitivas por debajo del mínimo de la beca se resaltan.
document.getElementById('notas').innerHTML = B.notas
  .map((n) => {
    const bajo = n.definitiva !== null && n.definitiva < B.minimoRequerido;
    return `<tr><td>${n.asignatura}</td><td>${MPU.nota(n.corte1)}</td><td>${MPU.nota(n.corte2)}</td><td>${MPU.nota(n.corte3)}</td>
      <td class="font-bold ${bajo ? 'text-danger' : ''}">${MPU.nota(n.definitiva)}</td></tr>`;
  })
  .join('');
