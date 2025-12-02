// public/scripts/menu-admin.js

// PROTECCIÓN ADMIN
// Verifica el token Y que el rol almacenado sea el correcto.
if (!localStorage.getItem("token") || localStorage.getItem("role") !== "ADMIN") { 
  window.location.href = "../login.html";
}

const logoutBtnAdmin = document.getElementById("btnLogout");
if (logoutBtnAdmin) {
  logoutBtnAdmin.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "../login.html";
  });
}