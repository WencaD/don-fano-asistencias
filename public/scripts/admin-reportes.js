// Lógica de reportes de asistencias

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
    const errorMessage = data.error || `Error ${res.status}: Fallo de conexión o servidor.`;
    throw new Error(errorMessage);
  }
  return data;
}

document.addEventListener("DOMContentLoaded", () => {
  cargarTrabajadoresSelect();
  // Asegúrate de que las columnas de Reportes se muestren correctamente
  const tableHeader = document.querySelector(".table thead tr");
  tableHeader.innerHTML = `
      <th>Fecha</th>
      <th>Trabajador</th>
      <th>Entrada</th>
      <th>Salida</th>
      <th>Estado</th>
      <th>Min. tarde</th>
      <th>Horas Trab.</th>
      <th>Pago Total</th>
  `;
});

async function cargarTrabajadoresSelect() {
  const sel = document.getElementById("workerReporte");
  
  try {
    const users = await apiRequest("/api/users/all"); // Usa apiRequest para TOKEN

    users.forEach((u) => {
      if (!u.Worker) return;
      const opt = document.createElement("option");
      opt.value = u.Worker.id;
      opt.textContent = u.Worker.nombre;
      sel.appendChild(opt);
    });
  } catch (err) {
    console.error("Error cargando trabajadores para select:", err.message);
  }
}

document.getElementById("formReportes").addEventListener("submit", async (e) => {
  e.preventDefault();

  const desde = document.getElementById("desde").value;
  const hasta = document.getElementById("hasta").value;
  const workerId = document.getElementById("workerReporte").value;

  const tbody = document.getElementById("tablaReportes");
  tbody.innerHTML = "<tr><td colspan='8'>Cargando...</td></tr>";

  try {
    const data = await apiRequest("/api/reportes", { // Usa apiRequest para TOKEN
      method: "POST",
      body: JSON.stringify({ desde, hasta, workerId }),
    });

    if (!data.length) {
      tbody.innerHTML = "<tr><td colspan='8'>Sin registros en este período.</td></tr>";
      return;
    }

    tbody.innerHTML = "";
    
    data.forEach((a) => {
      const row = `
        <tr>
          <td>${a.fecha}</td>
          <td>${a.Worker?.nombre || "-"}</td>
          <td>${a.hora_entrada || "-"}</td>
          <td>${a.hora_salida || "-"}</td>
          <td>${a.estado || "-"}</td>
          <td>${a.minutos_tarde || 0}</td>
          <td>${(a.horasTrabajadas || 0).toFixed(2)} h</td>
          <td>S/ ${(a.pagoDelDia || 0).toFixed(2)}</td>
        </tr>
      `;
      tbody.innerHTML += row;
    });
  } catch (err) {
    console.error("Error generando reportes:", err);
    tbody.innerHTML = `<tr><td colspan='8' style="color:red;">${err.message || "Error al cargar reportes. Revise el rango de fechas."}</td></tr>`;
  }
});