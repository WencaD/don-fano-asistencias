// Validación de acceso para empleados
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