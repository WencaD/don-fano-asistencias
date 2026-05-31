const qr = new QRious({
  element: document.getElementById('qr-canvas'),
  size: 220,
  value: 'Inicializando...',
  background: '#ffffff',
  foreground: '#2d1b0e',
  level: 'H'
});

const codigoEl = document.getElementById('codigo');
const timerEl  = document.getElementById('timer');
const estadoEl = document.getElementById('estado');

async function actualizarQR() {
  try {
    const res = await fetch('/api/qr/current');
    if (!res.ok) throw new Error('Error al obtener código');

    const data = await res.json();
    const codigo = data.codigo;
    const expira = data.expira_en;

    qr.value = codigo;
    codigoEl.textContent = codigo;
    timerEl.textContent = 'Tiempo restante: ' + expira + ' s';

    if (expira <= 5) {
      estadoEl.textContent = '⚠️ El código está por cambiar...';
      estadoEl.style.cssText = 'color:#d97706;background:rgba(217,119,6,0.1);border:1px solid rgba(217,119,6,0.25)';
    } else {
      estadoEl.textContent = '✓ Código activo';
      estadoEl.style.cssText = 'color:#166534;background:rgba(22,163,74,0.1);border:1px solid rgba(22,163,74,0.25)';
    }
  } catch (err) {
    codigoEl.textContent = 'ERROR';
    timerEl.textContent = 'Sin conexión';
    estadoEl.textContent = 'Verifica que el servidor esté activo.';
    estadoEl.style.cssText = 'color:#c0392b;background:rgba(192,57,43,0.1);border:1px solid rgba(192,57,43,0.25)';
  }
}

setInterval(actualizarQR, 1000);
actualizarQR();
