// public/scripts/login.js

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

        // 🔥 GUARDAR TODO BIEN
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("user", JSON.stringify(data.user));

        console.log("GUARDADO EN LOCALSTORAGE:", {
            token: data.token,
            role: data.role,
            user: data.user
        });

        // 🔥 REDIRECCIÓN PERFECTA
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
