// Variables globales y verificación de sesión
// Dashboard del empleado con escaneo QR y visualización de asistencias

const token = localStorage.getItem("token");
const userRaw = localStorage.getItem("user");
const modalQR = document.getElementById("modalQR");
const qrReaderDiv = document.getElementById("qr-reader");

// Elementos del modal: creamos un párrafo para mensajes de estado
let html5QrCode = null; // Se inicializará al abrir el modal
const resultDisplay = document.createElement('p');
resultDisplay.style.cssText = 'margin-top: 10px; font-weight: bold;';
if (qrReaderDiv && qrReaderDiv.parentNode) {
    qrReaderDiv.parentNode.insertBefore(resultDisplay, qrReaderDiv.nextSibling);
}

let workerId = null;
let userData = null;

try {
    userData = JSON.parse(userRaw);
    workerId = userData.workerId;
    
    // Verificación básica del token y rol
    if (!token || !workerId || userData.role !== "WORKER") {
        throw new Error("Sesión inválida.");
    }
} catch (e) {
    // Redirigir al login si falla la verificación
    localStorage.clear();
    window.location.href = "../login.html";
}


// Funciones de utilidad y lógica del modal QR

// Formatea hora a HH:MM
function formatTime(timeValue) { 
    if (!timeValue) {
        return '--';
    }
    
    if (typeof timeValue === 'string' && timeValue.match(/^\d{2}:\d{2}:\d{2}/)) {
        return timeValue.slice(0, 5); 
    }
    
    try {
        const date = new Date(timeValue);
        if (!isNaN(date.getTime())) { 
            return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        }
    } catch (e) {}
    
    return '--';
}

// Detiene el escáner y cierra el modal
function cerrarQR() {
    modalQR.style.display = 'none';
    if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(err => console.error("Error deteniendo el escáner:", err));
    }
}

// Se ejecuta al escanear un código QR con éxito
async function onScanSuccess(decodedText, decodedResult) {
    // Detener el escáner y cerrar el modal al tener éxito
    cerrarQR(); 

    // Mostrar mensaje de espera en el dashboard
    const estadoHoyEl = document.getElementById('estadoHoy');
    estadoHoyEl.textContent = "Código detectado. Marcando asistencia...";
    estadoHoyEl.style.color = '#ff7b00'; 

    try {
        // Petición al servidor para marcar asistencia
        const res = await fetch("/api/qr/mark", { 
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            }, 
            body: JSON.stringify({
                workerId: workerId,
                codigo: decodedText.trim()
            })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || "Fallo de servidor al marcar.");
        }

        estadoHoyEl.textContent = "✅ " + (data.message || "Asistencia marcada correctamente.");
        estadoHoyEl.style.color = 'green';
        
        fetchDashboardData();    } catch (err) {
        estadoHoyEl.textContent = "❌ ERROR: " + err.message;
        estadoHoyEl.style.color = 'red';
        console.error("Error en onScanSuccess:", err);
    }
}

// Inicia el escáner con el modo de cámara especificado
async function startScanner(mode) {
    if (!html5QrCode) {
        html5QrCode = new Html5Qrcode("qr-reader");
    }

    if (html5QrCode.isScanning) {
        await html5QrCode.stop().catch(err => console.error("Error deteniendo el escáner:", err));
    }
    
    const config = { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
    };
    
    const cameraConstraint = { facingMode: mode }; 

    resultDisplay.textContent = `Intentando iniciar cámara (${mode === 'environment' ? 'Trasera' : 'Frontal'})...`;
    resultDisplay.style.color = 'blue';

    try {
        await html5QrCode.start(
            cameraConstraint, 
            config,
            onScanSuccess, 
            (errorMessage) => { /* Ignorar fallos de lectura */ }
        );
        
        resultDisplay.textContent = "Cámara iniciada. Apunta al QR.";
        resultDisplay.style.color = 'green';

    } catch (error) {
        let errorMessage = "Error al acceder a la cámara. ";
        
        if (error.message.includes("Permission denied")) {
             errorMessage += "Debe conceder permiso de cámara. Revise la configuración del navegador.";
        } else if (window.location.protocol === "http:" && window.location.hostname !== "localhost") {
             errorMessage += "Bloqueado por protocolo HTTP. Pruebe con HTTPS (ej. ngrok) o localhost.";
        } else {
             errorMessage += "No se pudo iniciar la cámara. Pruebe con la otra opción.";
        }

        resultDisplay.textContent = "❌ " + errorMessage;
        resultDisplay.style.color = 'red';
        console.error("Error iniciando el escáner:", error);
    }
}


// Lógica del dashboard (datos y eventos)

// Carga los datos del dashboard del empleado
async function fetchDashboardData() {
    // 1. Mostrar datos básicos
    document.getElementById('saludoNombre').textContent = userData.nombre.split(' ')[0];
    document.getElementById('empEmail').textContent = userData.email;
    document.getElementById('empToday').textContent = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // Referencias a elementos del DOM
    const entradaHoyEl = document.getElementById('entradaHoy');
    const salidaHoyEl = document.getElementById('salidaHoy');
    const estadoHoyEl = document.getElementById('estadoHoy');
    const diasAsistidosEl = document.getElementById('diasAsistidos');
    const minutosTardeEl = document.getElementById('minutosTarde');
    const pagoEstimadoEl = document.getElementById('pagoEstimado');
    const tablaTurnosBody = document.getElementById('tablaTurnos');
    const historialTablaBody = document.getElementById('historialTabla');

    // Inicializar estados
    entradaHoyEl.textContent = '--';
    salidaHoyEl.textContent = '--';
    estadoHoyEl.textContent = 'Cargando datos...';
    estadoHoyEl.style.color = 'gray';
    tablaTurnosBody.innerHTML = '<tr><td colspan="3">Cargando...</td></tr>';
    historialTablaBody.innerHTML = '<tr><td colspan="3">Cargando...</td></tr>';

    try {
        const res = await fetch(`/api/stats/worker/${workerId}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || "Fallo al cargar los datos del dashboard.");
        }

        // Estado de hoy
        if (data.todayAssistance) {
            const a = data.todayAssistance;
            
            entradaHoyEl.textContent = formatTime(a.hora_entrada);
            salidaHoyEl.textContent = formatTime(a.hora_salida);
            
            if (a.hora_entrada && a.hora_salida) {
                 estadoHoyEl.textContent = 'Jornada completa. ¡Bien hecho!';
                 estadoHoyEl.style.color = 'green';
            } else if (a.hora_entrada) {
                 estadoHoyEl.textContent = `En curso: Entrada marcada como ${a.estado}.`;
                 estadoHoyEl.style.color = a.estado === 'Tardanza' ? '#ff7b00' : 'green';
            } else {
                 estadoHoyEl.textContent = 'Esperando marcación de entrada.';
                 estadoHoyEl.style.color = 'gray';
            }
        } else {
            estadoHoyEl.textContent = 'Esperando marcación de entrada.';
            estadoHoyEl.style.color = 'gray';
        }

        // Resumen mensual
        const stats = data.monthlyStats;
        diasAsistidosEl.textContent = stats.diasAsistidos || 0;
        minutosTardeEl.textContent = stats.minutosTarde || 0;
        pagoEstimadoEl.textContent = (stats.pagoEstimado || 0).toFixed(2); 

        // Próximos turnos
        tablaTurnosBody.innerHTML = '';
        if (data.nextShifts && data.nextShifts.length > 0) {
            data.nextShifts.forEach(shift => {
                const row = tablaTurnosBody.insertRow();
                const fecha = new Date(shift.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
                row.insertCell().textContent = fecha;
                row.insertCell().textContent = shift.hora_inicio.slice(0, 5); // HH:MM
                row.insertCell().textContent = shift.hora_fin.slice(0, 5); // HH:MM
            });
        } else {
            tablaTurnosBody.innerHTML = '<tr><td colspan="3">No hay turnos próximos programados.</td></tr>';
        }

        // Historial
        historialTablaBody.innerHTML = '';
        if (data.history && data.history.length > 0) {
            data.history.forEach(a => {
                const row = historialTablaBody.insertRow();
                // CORRECCIÓN: Agregamos el año para evitar "Invalid Date" en la hora de entrada
                const fecha = new Date(a.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
                const entrada = a.hora_entrada ? formatTime(a.hora_entrada) : '--';
                
                let estadoText = 'Falta';
                let color = 'red';

                if (a.hora_entrada) {
                    const esTardanza = a.estado === 'Tardanza' && (a.minutos_tarde > 0);
                    
                    if (a.hora_salida) {
                        estadoText = esTardanza ? `Completa (${a.minutos_tarde}m Tarde)` : 'Completa';
                        color = esTardanza ? '#ff7b00' : 'green';
                    } else {
                        estadoText = esTardanza ? `Pendiente (${a.minutos_tarde}m Tarde)` : 'Pendiente';
                        color = esTardanza ? '#ff7b00' : 'gray';
                    }
                }

                row.insertCell().textContent = fecha;
                row.insertCell().textContent = entrada;
                
                const estadoCell = row.insertCell();
                estadoCell.textContent = estadoText;
                estadoCell.style.color = color;
            });
        } else {
            historialTablaBody.innerHTML = '<tr><td colspan="3">No hay historial de asistencia.</td></tr>';
        }

    } catch (err) {
        console.error("Error al cargar datos:", err);
        estadoHoyEl.textContent = '❌ Error al cargar los datos: ' + err.message;
        estadoHoyEl.style.color = 'red';
        tablaTurnosBody.innerHTML = '<tr><td colspan="3">Error al cargar.</td></tr>';
        historialTablaBody.innerHTML = '<tr><td colspan="3">Error al cargar.</td></tr>';
    }
}


// Inicio de la aplicación y event listeners
document.addEventListener("DOMContentLoaded", () => {
    window.cerrarQR = cerrarQR; 
    
    fetchDashboardData();

    // 1. Botón principal para abrir el modal
    document.getElementById('btnMarcarAsistencia').addEventListener('click', () => {
        modalQR.style.display = 'flex';
        // Iniciar la cámara trasera ('environment') por defecto
        setTimeout(() => startScanner('environment'), 200); 
    });

    // 2. Botón "Trasera" dentro del modal
    document.getElementById('cam-back').addEventListener('click', () => startScanner('environment'));
    
    // 3. Botón "Frontal" dentro del modal
    document.getElementById('cam-front').addEventListener('click', () => startScanner('user'));
});