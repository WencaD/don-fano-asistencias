// Autenticación - Maneja el login de usuarios
// Valida credenciales y redirige según el rol (ADMIN o WORKER)

document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorText = document.getElementById("errorText");

    errorText.textContent = "";

    try {
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();
        console.log("LOGIN RESPONSE:", data);

        if (!res.ok) {
            errorText.textContent = data.error || "Error al iniciar sesión";
            return;
        }

        // Guardar datos de sesión en localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirigir según el rol del usuario
        if (data.role === "ADMIN") {
            window.location.href = "/admin/admin-dashboard.html";
        } else if (data.role === "WORKER") {
            window.location.href = "/empleado/empleado-dashboard.html";
        } else {
            errorText.textContent = "Rol no válido";
        }

    } catch (err) {
        console.error("LOGIN ERROR:", err);
        errorText.textContent = "Error en conexión con servidor";
    }
});
