// public/scripts/admin-dashboard.js

async function apiRequest(url, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, 
      ...(options.headers || {}),
    },
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw new Error(data.error || "Error en la petición");
  }
  return data;
}
let chartTardanzas = null;
let chartMinutos = null;

// --- Helper para llamadas a la API con token (HACEMOS ESTE HELPER GLOBAL) ---
async function apiRequest(url, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, 
      ...(options.headers || {}),
    },
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw new Error(data.error || "Error en la petición");
  }
  return data;
}

// Cargar cards (ahora usa apiRequest)
async function cargarResumen() {
  try {
    const data = await apiRequest("/api/stats");

    document.getElementById("empleadosActivos").textContent = data.empleadosActivos;
    document.getElementById("entradasHoy").textContent = data.entradasHoy;
    document.getElementById("salidasHoy").textContent = data.salidasHoy;
    document.getElementById("totalTrabajadores").textContent = data.totalTrabajadores;
  } catch (err) {
    console.error("Error cargando resumen:", err);
  }
}

// Botones de filtro
function activarBotones() {
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      cargarPeriodo(btn.dataset.period);
    });
  });
}

// Cargar datos para gráficos (ahora usa apiRequest)
async function cargarPeriodo(period) {
  try {
    const data = await apiRequest(`/api/stats/period?period=${period}`);

    const labels = data.labels;
    const tardanzas = data.tardanzas;
    const minutos = data.minutosTarde;
    const faltas = data.faltas;

    // gráfico tardanza/faltas
    const ctx1 = document.getElementById("chartTardanzas");
    if (chartTardanzas) chartTardanzas.destroy();

    chartTardanzas = new Chart(ctx1, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Tardanzas",
            data: tardanzas,
            backgroundColor: "rgba(255, 100, 0, 0.8)",
          },
          {
            label: "Faltas",
            data: faltas,
            backgroundColor: "rgba(255, 0, 0, 0.7)",
          },
        ],
      },
      options: { responsive: true },
    });

    // gráfico minutos
    const ctx2 = document.getElementById("chartMinutos");
    if (chartMinutos) chartMinutos.destroy();

    chartMinutos = new Chart(ctx2, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Minutos tarde",
            borderColor: "orange",
            backgroundColor: "rgba(255,120,0,0.25)",
            fill: true,
            data: minutos,
          },
        ],
      },
    });
  } catch (err) {
    console.error("Error cargando periodo:", err);
  }
}


// ==============================================
// LÓGICA DE LA TABLA DE ESTADO EN TIEMPO REAL
// ==============================================
async function cargarTablaEstado() {
  const tbody = document.getElementById("tablaEstadoAsistencia").querySelector("tbody");
  tbody.innerHTML = `<tr><td colspan="4">Actualizando...</td></tr>`;

  try {
    // 1. Obtener TODOS los trabajadores
    const allUsers = await apiRequest("/api/users/all");
    const workers = allUsers.filter(u => u.Worker);
    
    // 2. Obtener las asistencias de HOY
    const todayAssistance = await apiRequest("/api/assistance/today");
    const assistanceMap = new Map();
    todayAssistance.forEach(a => {
      assistanceMap.set(a.workerId, a);
    });

    if (!workers.length) {
        tbody.innerHTML = `<tr><td colspan="4">No hay trabajadores registrados.</td></tr>`;
        return;
    }

    tbody.innerHTML = "";

    workers.forEach(u => {
      const w = u.Worker;
      const asistencia = assistanceMap.get(w.id);
      
      let estado;
      let entrada = "--";

      if (asistencia && asistencia.hora_entrada && !asistencia.hora_salida) {
        // Marcó entrada y no salida: TRABAJANDO o TARDANZA
        estado = asistencia.estado === 'Tardanza' ? `<span style="color:orange;font-weight:bold;">Tardanza</span>` : `<span style="color:green;font-weight:bold;">Trabajando</span>`;
        entrada = asistencia.hora_entrada;
      } else if (asistencia && asistencia.hora_salida) {
        // Marcó entrada y salida: COMPLETO
        estado = `<span style="color:blue;">Completo (${asistencia.estado})</span>`;
        entrada = asistencia.hora_entrada;
      } else {
        // NO hay registro de entrada: FALTA
        estado = `<span style="color:red;font-weight:bold;">FALTA</span>`;
      }

      const row = `
        <tr>
          <td>${w.nombre}</td>
          <td>${w.area}</td>
          <td>${entrada}</td>
          <td>${estado}</td>
        </tr>
      `;
      tbody.innerHTML += row;
    });

  } catch (err) {
    console.error("Error cargando estado:", err);
    tbody.innerHTML = `<tr><td colspan="4" style="color:red;">Error al cargar datos. Asegúrate de que el servidor esté activo.</td></tr>`;
  }
}


// --- Inicializar ---
document.addEventListener("DOMContentLoaded", () => {
  cargarResumen();
  cargarPeriodo("week");
  activarBotones();
  
  // Tabla de estado en tiempo real
  cargarTablaEstado();
  setInterval(cargarTablaEstado, 30000); // Refrescar cada 30 segundos
});