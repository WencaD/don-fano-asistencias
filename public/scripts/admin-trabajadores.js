// public/scripts/admin-trabajadores.js

// --- Helper para llamadas a la API con token (Definición Única y Estándar) ---
async function apiRequest(url, options = {}) {
  // Gestión de trabajadores (crear, listar, eliminar)

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

  // Verifica si la respuesta fue OK (status 200-299)
  if (!res.ok) {
    // Si hay un error, intentamos obtener el mensaje detallado del backend
    const errorMessage = data.error || `Error en la petición (Status: ${res.status}).`;
    throw new Error(errorMessage);
  }
  return data;
}

// --- Cargar fecha ---
const todaySpan = document.getElementById("todayLabel");
if (todaySpan) {
  todaySpan.textContent = new Date().toLocaleDateString("es-PE", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// --- Cargar tabla de trabajadores (LISTAR) ---
async function cargarTablaTrabajadores() {
  const tbody = document.querySelector("#tablaTrabajadores");
  if (!tbody) return;

  tbody.innerHTML = `
    <tr>
      <td colspan="7" style="text-align:center;padding:12px;">Cargando...</td>
    </tr>
  `;

  try {
    // LLAMA AL BACKEND CON TOKEN: /api/workers/all
    const workers = await apiRequest("/api/workers/all");

    if (!workers || !workers.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center;padding:12px;">
            No hay trabajadores registrados
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = "";

    workers.forEach((w) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${w.id}</td>
        <td>${w.nombre}</td>
        <td>${w.dni}</td>
        <td>${w.correo}</td>
        <td>${w.area}</td>
        <td>${w.rol}</td>
        <td>
          <button class="btn-table btn-danger" data-id="${w.id}">
            Eliminar
          </button>
        </td>
      `;

      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Error al cargar la tabla:", err);
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center;padding:12px; color:red;">
          ${err.message || "Error cargando trabajadores. (Verifica tu login Admin)"}
        </td>
      </tr>
    `;
  }
}

// --- Registrar trabajador (CREAR) ---
const form = document.getElementById("formTrabajador");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const dni = document.getElementById("dni").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const area = document.getElementById("area").value;
    const rol = document.getElementById("rol").value; // 'Empleado' o 'Administrador'
    const salario_hora = parseFloat(
      document.getElementById("salario_hora").value || "0"
    );

    if (!nombre || !dni || !correo) {
      alert("Completa nombre, DNI y correo");
      return;
    }

    try {
      // LLAMA AL BACKEND CON TOKEN: /api/workers/create
      const result = await apiRequest("/api/workers/create", {
        method: "POST",
        body: JSON.stringify({
          nombre, dni, correo, area, rol, salario_hora,
        }),
      });

      alert(
        `¡Trabajador ${result.worker.nombre} creado correctamente!\n` + 
        `El usuario es el DNI: ${dni}\n` + 
        `La contraseña inicial es el DNI: ${dni}`
      );

      form.reset();
      cargarTablaTrabajadores();
    } catch (err) {
      console.error(err);
      alert(err.message || "Error creando trabajador. Revisa los datos o la conexión.");
    }
  });
}

// --- Eliminar trabajador (ELIMINAR) ---
document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".btn-table.btn-danger");
  if (!btn) return;

  const id = btn.getAttribute("data-id");
  if (!id) return;

  if (!confirm("¿Estás seguro de ELIMINAR este trabajador? Se borrará permanentemente.")) return;

  try {
    // LLAMA AL BACKEND CON TOKEN: /api/workers/:id (DELETE)
    await apiRequest(`/api/workers/${id}`, { method: "DELETE" });
    alert("Trabajador eliminado correctamente.");
    cargarTablaTrabajadores();
  } catch (err) {
    console.error(err);
    alert(err.message || "Error eliminando trabajador.");
  }
});

// --- Inicializar ---
document.addEventListener("DOMContentLoaded", cargarTablaTrabajadores);