console.log("CARGANDO DASHBOARD EMPLEADO...");

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (!token || !user || user.role !== "WORKER") {
    window.location.href = "/login.html";
}

// =====================
// DOM CORREGIDO SEGÚN TU HTML
// =====================
const saludoNombre = document.getElementById("saludoNombre");
const empEmail = document.getElementById("empEmail");
const empToday = document.getElementById("empToday");

const entradaHoy = document.getElementById("entradaHoy");
const salidaHoy = document.getElementById("salidaHoy");
const estadoHoy = document.getElementById("estadoHoy");

const tablaTurnos = document.getElementById("tablaTurnos");

// Resumen
const diasAsistidos = document.getElementById("diasAsistidos");
const minutosTarde = document.getElementById("minutosTarde");
const pagoEstimado = document.getElementById("pagoEstimado");

// Historial
const historialTabla = document.getElementById("historialTabla");

// Helpers
function safeSet(el, content) {
    if (el) el.innerHTML = content;
}
function safeAdd(el, html) {
    if (el) el.insertAdjacentHTML("beforeend", html);
}

// =====================
// MOSTRAR INFO DEL USUARIO
// =====================
safeSet(saludoNombre, user?.nombre || "");
safeSet(empEmail, user?.email || "");
safeSet(empToday, new Date().toLocaleDateString("es-PE"));

// =====================
// ESTADO DE HOY
// =====================
async function cargarEstadoHoy() {
    try {
        const res = await fetch(`/api/assistance/today/${user.workerId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        console.log("ESTADO HOY:", data);

        if (!data || !data.id) {
            safeSet(entradaHoy, "--");
            safeSet(salidaHoy, "--");
            safeSet(estadoHoy, "--");
            return;
        }

        safeSet(entradaHoy, data.hora_entrada || "--");
        safeSet(salidaHoy, data.hora_salida || "--");
        safeSet(estadoHoy, data.estado || "--");

    } catch (err) {
        console.error("Error cargarEstadoHoy:", err);
    }
}

// =====================
// TURNOS
// =====================
async function cargarTurnos() {
    try {
        const res = await fetch(`/api/shifts/worker/${user.workerId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        console.log("TURNOS:", data);

        safeSet(tablaTurnos, "");

        if (!data || data.length === 0) {
            safeAdd(tablaTurnos, `<tr><td colspan="3">No tienes turnos programados.</td></tr>`);
            return;
        }

        data.forEach(t => {
            safeAdd(
                tablaTurnos,
                `
                <tr>
                    <td>${t.fecha}</td>
                    <td>${t.hora_inicio}</td>
                    <td>${t.hora_fin}</td>
                </tr>
                `
            );
        });

    } catch (err) {
        console.error("Error cargarTurnos:", err);
    }
}

// =====================
// HISTORIAL Y RESUMEN
// =====================
async function cargarHistorialYResumen() {
    try {
        const res = await fetch(`/api/stats/${user.workerId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        console.log("STATS:", data);

        // Resumen
        safeSet(diasAsistidos, data.resumen?.dias_asistidos || 0);
        safeSet(minutosTarde, data.resumen?.total_minutos_tarde || 0);

        const totalPago = data.resumen?.total_pago || 0;
        safeSet(pagoEstimado, Number(totalPago).toFixed(2));

        // Historial
        safeSet(historialTabla, "");

        if (!data.asistencias || data.asistencias.length === 0) {
            safeAdd(historialTabla, `<tr><td colspan="3">Sin historial.</td></tr>`);
            return;
        }

        data.asistencias.forEach(a => {
            safeAdd(
                historialTabla,
                `
                <tr>
                    <td>${a.fecha}</td>
                    <td>${a.hora_entrada || "--"}</td>
                    <td>${a.estado || "--"}</td>
                </tr>
                `
            );
        });

    } catch (err) {
        console.error("Error cargarHistorialYResumen:", err);
    }
}

// =====================
// EJECUTAR
// =====================
cargarEstadoHoy();
cargarTurnos();
cargarHistorialYResumen();

// ======================================================
// 🔥 ESCANEAR QR – OPCIÓN 1 (Selector de cámaras)
// ======================================================

let scanner = null;

const btnMarcarAsistencia = document.getElementById("btnMarcarAsistencia");
if (btnMarcarAsistencia) {
    btnMarcarAsistencia.addEventListener("click", abrirQR);
}

function abrirQR() {
    const modal = document.getElementById("modalQR");
    modal.style.display = "flex";

    iniciarSelectorCamaras();
}

async function iniciarSelectorCamaras() {
    const qrBox = document.getElementById("qr-reader");
    qrBox.innerHTML = "Cargando cámaras...";

    try {
        const cameras = await Html5Qrcode.getCameras();

        if (!cameras.length) {
            qrBox.innerHTML = "<p>No se encontraron cámaras.</p>";
            return;
        }

        // Crear selector de cámaras
        const select = document.createElement("select");
        select.id = "cameraSelect";
        select.style.width = "100%";
        select.style.padding = "10px";
        select.style.marginBottom = "10px";

        cameras.forEach(cam => {
            const opt = document.createElement("option");
            opt.value = cam.id;
            opt.textContent = cam.label || "Cámara disponible";
            select.appendChild(opt);
        });

        qrBox.innerHTML = "";
        qrBox.appendChild(select);

        const camDiv = document.createElement("div");
        camDiv.id = "qr-cam-container";
        camDiv.style.width = "100%";
        qrBox.appendChild(camDiv);

        scanner = new Html5Qrcode("qr-cam-container");

        select.onchange = () => iniciarCamara(select.value);

        iniciarCamara(select.value);

    } catch (err) {
        console.error(err);
        qrBox.innerHTML = "<p>Error accediendo a cámara.</p>";
    }
}

async function iniciarCamara(cameraId) {
    try {
        if (scanner._isScanning) {
            await scanner.stop();
            await scanner.clear();
        }
    } catch {}

    scanner.start(
        cameraId,
        { fps: 10, qrbox: 250 },
        (decoded) => {
            registrarAsistencia(decoded);
            cerrarQR();
        },
        (err) => {}
    ).catch(err => {
        console.error("Error iniciando cámara:", err);
    });
}

function cerrarQR() {
    const modal = document.getElementById("modalQR");
    modal.style.display = "none";

    if (scanner) {
        scanner.stop().then(() => scanner.clear()).catch(() => {});
    }
}

async function registrarAsistencia(qr_token) {
    try {
        const res = await fetch("/api/assistance/mark", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ qr_token })
        });

        const data = await res.json();

        alert(data.message || "Marcado correctamente");

        cargarEstadoHoy();
        cargarHistorialYResumen();

    } catch (err) {
        alert("Error al registrar asistencia");
        console.error(err);
    }
}
