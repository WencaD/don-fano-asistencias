// Control de acceso para administradores
if (!localStorage.getItem("token") || localStorage.getItem("role") !== "ADMIN") {
  const isInAdmin = window.location.pathname.includes("/admin/");
  window.location.href = isInAdmin ? "../login.html" : "login.html";
}
