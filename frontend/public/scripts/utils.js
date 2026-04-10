// Utilidades generales del frontend
document.getElementById("toggleMenu").addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle("closed");
});

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.onclick = () => {
    localStorage.clear();
    window.location.href = "/login.html";
  };
}

export function validarSesion() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "../login.html";
    return false;
  }
  return true;
}
