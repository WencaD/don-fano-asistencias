// public/scripts/admin-turnos.js

// --- Helper para llamadas a la API con token ---
async function apiRequest(url, options = {}) {
  // Gestión de turnos de trabajo

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
    const errorMessage = data.error || `Error ${res.status}: Fallo de conexión o servidor.`;
    throw new Error(errorMessage);
  }
  return data;
}

document.addEventListener("DOMContentLoaded", () => {
  cargarTrabajadoresSelect();
});

// Cargar trabajadores en el select
async function cargarTrabajadoresSelect() {
  const select = document.getElementById("workerId");

  try {
    const users = await apiRequest("/api/users/all");
    
    // === SOLUCIÓN FINAL: LIMPIAR Y AÑADIR OPCIÓN POR DEFECTO ===
    select.innerHTML = ''; 
    select.innerHTML = '<option value="">-- Seleccionar Trabajador --</option>';

    users.forEach((u) => {
      if (u.Worker) { // Solo si tiene data de Worker
        const w = u.Worker;
        const option = document.createElement("option");
        option.value = w.id; // ID del Worker
        option.textContent = `${w.nombre} (${w.area})`;
        select.appendChild(option);
      }
    });
    
    cargarTurnos(); 

  } catch (err) {
    console.error("Error cargando trabajadores:", err.message);
    select.innerHTML = '<option>Error al cargar trabajadores</option>';
    cargarTurnos(); 
  }
}

// Registrar turno
document.getElementById("formTurno").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    workerId: document.getElementById("workerId").value,
    fecha: document.getElementById("fechaTurno").value,
    hora_inicio: document.getElementById("horaInicio").value,
    hora_fin: document.getElementById("horaFin").value,
  };

  if (!data.workerId) {
      alert("Debes seleccionar un trabajador.");
      return;
  }

  try {
    const r = await apiRequest("/api/shifts/create", { 
      method: "POST",
      body: JSON.stringify(data),
    });
    alert(r.message || "Turno registrado");
    document.getElementById("formTurno").reset();
    cargarTurnos();
  } catch (err) {
    alert(err.message || "Error al registrar turno");
  }
});

async function cargarTurnos() {
  const tbody = document.getElementById("tablaTurnos");
  tbody.innerHTML = `<tr><td colspan="5">Cargando...</td></tr>`;

  try {
    const turnos = await apiRequest("/api/shifts"); 
    tbody.innerHTML = "";

    if (turnos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5">No hay turnos registrados.</td></tr>`;
        return;
    }

    turnos.forEach((t) => {
      const row = `
        <tr>
          <td>${t.Worker ? t.Worker.nombre : 'N/A'}</td>
          <td>${t.fecha}</td>
          <td>${t.hora_inicio}</td>
          <td>${t.hora_fin}</td>
          <td><button class="delete-btn btn-danger" data-id="${t.id}">Eliminar</button></td>
        </tr>
      `;
      tbody.innerHTML += row;
    });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        if (!confirm("¿Seguro que desea eliminar este turno?")) return;

        try {
          await apiRequest(`/api/shifts/${id}`, { method: "DELETE" });
          cargarTurnos();
        } catch (err) {
          alert(err.message || "Error eliminando turno");
        }
      });
    });
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="5" style="color:red;">${err.message || "Error al cargar turnos."}</td></tr>`;
  }
}