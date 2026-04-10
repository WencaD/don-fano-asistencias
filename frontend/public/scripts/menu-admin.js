// Validación de acceso y utilidades para administradores

// Verificar acceso
if (!localStorage.getItem("token") || localStorage.getItem("role") !== "ADMIN") {
  const isInAdmin = window.location.pathname.includes("/admin/");
  window.location.href = isInAdmin ? "../login.html" : "login.html";
}

// Botón de cerrar sesión
const logoutBtnAdmin = document.getElementById("btnLogout");
if (logoutBtnAdmin) {
  logoutBtnAdmin.addEventListener("click", () => {
    localStorage.clear();
    const isInAdmin = window.location.pathname.includes("/admin/");
    window.location.href = isInAdmin ? "../login.html" : "login.html";
  });
}

// ===== Sistema global de notificaciones Toast =====
function showToast(message, type = "info", duration = 3500) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }

  const icons = {
    success: "fas fa-check-circle",
    error:   "fas fa-times-circle",
    warning: "fas fa-exclamation-triangle",
    info:    "fas fa-info-circle"
  };

  const colors = {
    success: "#16a34a",
    error:   "#dc2626",
    warning: "#d97706",
    info:    "#0284c7"
  };

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i class="${icons[type] || icons.info}" style="color:${colors[type]};font-size:16px;flex-shrink:0"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "toastOut 0.35s ease forwards";
    setTimeout(() => toast.remove(), 350);
  }, duration);
}

// ===== Mobile Sidebar Toggle =====
document.addEventListener("DOMContentLoaded", () => {
    const mobileToggle = document.createElement("button");
    mobileToggle.className = "mobile-toggle";
    mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
    document.body.appendChild(mobileToggle);

    const overlay = document.createElement("div");
    overlay.className = "sidebar-overlay";
    document.body.appendChild(overlay);

    const sidebar = document.querySelector(".sidebar");

    mobileToggle.addEventListener("click", () => {
        sidebar.classList.toggle("active");
        overlay.classList.toggle("active");
        mobileToggle.innerHTML = sidebar.classList.contains("active") 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });

    overlay.addEventListener("click", () => {
        sidebar.classList.remove("active");
        overlay.classList.remove("active");
        mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Exponer globalmente
window.showToast = showToast;