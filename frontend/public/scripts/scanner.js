const token = localStorage.getItem("token");
const userRaw = localStorage.getItem("user");
let workerId = null;

try {
  const usuario = JSON.parse(userRaw);
  workerId = usuario.workerId;
  if (!token || !workerId || usuario.role !== "WORKER") {
    throw new Error("Sesión inválida.");
  }
} catch (e) {
  localStorage.clear();
  window.location.href = "../login.html";
}

const resultDiv = document.getElementById("result");
const html5QrCode = new Html5Qrcode("reader");

async function onScanSuccess(decodedText, decodedResult) {
  html5QrCode.stop().catch(err => console.error("Error deteniendo el escáner:", err));

  resultDiv.textContent = "Código detectado. Marcando asistencia...";
  resultDiv.style.color = '#ff7b00';

  try {
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
      if (res.status === 401 || res.status === 403) {
        localStorage.clear();
        window.location.href = "../login.html";
        return;
      }
      throw new Error(data.error || "Fallo de servidor al marcar.");
    }

    resultDiv.textContent = (data.message || "Asistencia marcada correctamente.");
    resultDiv.style.color = 'green';

    setTimeout(() => {
        window.location.href = "empleado-dashboard.html";
    }, 2000);

  } catch (err) {
    resultDiv.textContent = "Error: " + err.message;
    resultDiv.style.color = 'red';

    setTimeout(() => {
        window.location.href = "scanner.html";
    }, 3000);
  }
}

async function startScanner() {
  try {
      const config = {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          facingMode: "environment"
      };

      resultDiv.textContent = "Intentando iniciar la cámara...";
      resultDiv.style.color = 'blue';

      await html5QrCode.start(
          { facingMode: "environment" },
          config,
          onScanSuccess,
          (errorMessage) => {}
      );

      resultDiv.textContent = "Cámara iniciada. Apunta al QR.";

  } catch (error) {
      let errorMessage = "Error al acceder a la cámara. ";
      if (error.message.includes("Permission denied")) {
           errorMessage += "Debe conceder permiso de cámara.";
      } else if (window.location.protocol === "http:" && window.location.hostname !== "localhost") {
           errorMessage += "Bloqueado por protocolo HTTP. Pruebe con HTTPS o localhost.";
      } else {
           errorMessage += "Verifique los permisos en la configuración del navegador.";
      }

      resultDiv.textContent = "Error: " + errorMessage;
      resultDiv.style.color = 'red';
      console.error("Error iniciando el escáner:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(startScanner, 500);
});
