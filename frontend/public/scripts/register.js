// Registro de nuevos establecimientos
// Valida datos y crea la cuenta

document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Obtener valores del formulario
  const businessName = document.getElementById('businessName')?.value.trim();
  const businessAlias = document.getElementById('businessAlias')?.value.trim().toLowerCase();
  const businessEmail = document.getElementById('businessEmail')?.value.trim();
  const businessPhone = document.getElementById('businessPhone')?.value.trim();
  const firstName = document.getElementById('firstName')?.value.trim();
  const lastName = document.getElementById('lastName')?.value.trim();
  const email = document.getElementById('email')?.value.trim();
  const password = document.getElementById('password')?.value;
  const passwordConfirm = document.getElementById('passwordConfirm')?.value;
  const terms = document.getElementById('terms')?.checked;
  
  const errorText = document.getElementById('errorText');
  const successText = document.getElementById('successText');
  const submitBtn = document.querySelector('.btn-login');

  // Limpiar mensajes previos
  if (errorText) errorText.textContent = '';
  if (successText) successText.textContent = '';

  // Validaciones
  if (!businessName || !businessAlias || !businessEmail || !firstName || !lastName || !email || !password) {
    showError('Por favor completa todos los campos', errorText);
    return;
  }

  if (businessAlias.length < 3) {
    showError('El alias debe tener al menos 3 caracteres', errorText);
    return;
  }

  if (!/^[a-zA-Z0-9_]+$/.test(businessAlias)) {
    showError('El alias solo puede contener letras, números y guiones', errorText);
    return;
  }

  if (password.length < 8) {
    showError('La contraseña debe tener al menos 8 caracteres', errorText);
    return;
  }

  if (password !== passwordConfirm) {
    showError('Las contraseñas no coinciden', errorText);
    return;
  }

  if (!terms) {
    showError('Debes aceptar los términos y condiciones', errorText);
    return;
  }

  // Deshabilitar botón mientras se envía
  if (submitBtn) submitBtn.disabled = true;

  try {
    // Hacer petición al backend
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        organizationName: businessName,
        organizationAlias: businessAlias,
        contactEmail: businessEmail,
        phone: businessPhone,
        adminName: firstName + ' ' + lastName,
        adminEmail: email,
        adminPassword: password,
        plan: 'standard',
        country: 'PY',
        city: 'Asuncion',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error en el registro');
    }

    // Registro exitoso
    if (successText) {
      successText.textContent = '✓ Cuenta creada exitosamente. Redirigiendo...';
    }

    // Guardar token y datos del usuario
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('organization', JSON.stringify(data.organization));
    }

    // Redirigir al dashboard después de 1.5 segundos
    setTimeout(() => {
      const userRole = data.user?.role || 'empleado';
      if (userRole === 'admin') {
        window.location.href = '/admin/admin-dashboard.html';
      } else {
        window.location.href = '/empleado/empleado-dashboard.html';
      }
    }, 1500);

  } catch (error) {
    console.error('Error:', error);
    showError(error.message || 'Error al registrar. Intenta de nuevo.', errorText);
  } finally {
    if (submitBtn) submitBtn.disabled = false;
  }
});

// Función para mostrar errores
function showError(message, element) {
  if (element) {
    element.textContent = message;
    element.style.display = 'block';
  }
}

// Toggle password visibility
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

if (togglePassword && passwordInput) {
  togglePassword.addEventListener('click', function() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
  });
}

// Validación en tiempo real del alias
const aliasInput = document.getElementById('businessAlias');
if (aliasInput) {
  aliasInput.addEventListener('change', function() {
    this.value = this.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
  });
}
