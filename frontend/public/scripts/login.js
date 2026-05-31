// ── Toggle visibilidad contraseña ──────────────────
const toggleBtn   = document.getElementById('togglePassword');
const passInput   = document.getElementById('password');

toggleBtn.addEventListener('click', () => {
  const isPass = passInput.type === 'password';
  passInput.type = isPass ? 'text' : 'password';
  toggleBtn.innerHTML = isPass
    ? '<i class="fas fa-eye-slash"></i>'
    : '<i class="fas fa-eye"></i>';
});

// ── Recordar sesión ────────────────────────────────
const rememberMe  = document.getElementById('rememberMe');
const usernameIn  = document.getElementById('username');
const saved = localStorage.getItem('df_saved_user');
if (saved) {
  usernameIn.value = saved;
  rememberMe.checked = true;
}

// ── Login ──────────────────────────────────────────
const form        = document.getElementById('loginForm');
const errorText   = document.getElementById('errorText');
const btnLogin    = document.getElementById('btnLogin');
const spinner     = document.getElementById('loginSpinner');
const btnText     = document.getElementById('btnLoginText');
const btnArrow    = document.getElementById('btnArrow');

function setLoading(loading) {
  btnLogin.disabled    = loading;
  spinner.style.display  = loading ? 'block' : 'none';
  btnText.textContent    = loading ? 'Iniciando...' : 'Ingresar al Sistema';
  btnArrow.style.display = loading ? 'none' : 'inline';
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorText.textContent = '';

  const username = usernameIn.value.trim();
  const password = passInput.value.trim();

  if (!username || !password) {
    errorText.textContent = 'Por favor completa todos los campos.';
    return;
  }

  setLoading(true);

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!res.ok) {
      errorText.textContent = data.error || 'Credenciales incorrectas. Intenta de nuevo.';
      setLoading(false);
      return;
    }

    // Guardar sesión
    localStorage.setItem('token', data.token);
    localStorage.setItem('role',  data.role);
    localStorage.setItem('user',  JSON.stringify(data.user));

    if (rememberMe.checked) {
      localStorage.setItem('df_saved_user', username);
    } else {
      localStorage.removeItem('df_saved_user');
    }

    // Redirigir según rol
    if (data.role === 'ADMIN') {
      window.location.href = '/admin/admin-dashboard.html';
    } else if (data.role === 'WORKER') {
      window.location.href = '/empleado/empleado-dashboard.html';
    } else {
      errorText.textContent = 'Rol de usuario no reconocido.';
      setLoading(false);
    }

  } catch (err) {
    console.error('Login error:', err);
    errorText.textContent = 'Error de conexión con el servidor. Intenta de nuevo.';
    setLoading(false);
  }
});

// ── Olvidé contraseña ──────────────────────────────
document.getElementById('forgotLink').addEventListener('click', (e) => {
  e.preventDefault();
  alert('Contacta al administrador del sistema para restablecer tu contraseña.\n\nAdmin: admin@donfano.com');
});
