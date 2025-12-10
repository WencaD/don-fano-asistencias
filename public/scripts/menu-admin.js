// Validación de acceso para administradores

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