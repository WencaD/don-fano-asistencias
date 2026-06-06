// Control de acceso para trabajadores/empleados
if (!localStorage.getItem("token") || localStorage.getItem("role") !== "WORKER") {
  const isInEmpleado = window.location.pathname.includes("/empleado/");
  window.location.href = isInEmpleado ? "../login.html" : "login.html";
}
