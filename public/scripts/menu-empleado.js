// public/scripts/menu-empleado.js

// === CORRECCIÓN CLAVE: El rol debe ser "WORKER" ===
if (!localStorage.getItem("token") || localStorage.getItem("role") !== "WORKER") {
  window.location.href = "../login.html";
}

const logoutBtn = document.getElementById("btnLogout");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "../login.html";
  });
}