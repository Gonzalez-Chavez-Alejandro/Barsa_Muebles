const loginForm = document.getElementById('login-form');
const errorUsername = document.getElementById('error-username');
const errorPassword = document.getElementById('error-password');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Limpiar mensajes de error
  errorUsername.style.display = 'none';
  errorUsername.textContent = '';
  errorPassword.style.display = 'none';
  errorPassword.textContent = '';

  const loginData = {
    username: document.getElementById('email').value,
    password: document.getElementById('password').value
  };

  try {
    const response = await fetch('/api/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error en el login:', errorData);

      if (errorData.detail) {
        // Aquí decides si el error es de usuario o contraseña según el texto
        const msg = errorData.detail.toLowerCase();

        if (msg.includes('usuario') || msg.includes('no encontrado')) {
          errorUsername.style.display = 'block';
          errorUsername.textContent = errorData.detail;
        } else if (msg.includes('contraseña') || msg.includes('password')) {
          errorPassword.style.display = 'block';
          errorPassword.textContent = errorData.detail;
        } else if (msg.includes('cuenta inactiva')) {
          // También podría ir en username o en password, según prefieras
          errorUsername.style.display = 'block';
          errorUsername.textContent = errorData.detail;
        } else {
          // Error genérico que no se puede categorizar
          errorUsername.style.display = 'block';
          errorUsername.textContent = errorData.detail;
        }
      } else if (errorData.username) {
        errorUsername.style.display = 'block';
        errorUsername.textContent = errorData.username.join(' ');
      } else if (errorData.password) {
        errorPassword.style.display = 'block';
        errorPassword.textContent = errorData.password.join(' ');
      } else {
        errorUsername.style.display = 'block';
        errorUsername.textContent = 'Credenciales inválidas, intenta de nuevo.';
      }

      return;
    }

    const data = await response.json();
    console.log('Login exitoso:', data);

    // Guarda tokens
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);

    // Obtener info del usuario
    const userResponse = await fetch('/api/user-info/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${data.access}`,
        'Content-Type': 'application/json'
      }
    });

    if (!userResponse.ok) {
      console.error('No se pudo obtener info del usuario');
      return;
    }

    localStorage.setItem('accessToken', data.access);
    localStorage.setItem('refreshToken', data.refresh);

    const userInfo = await userResponse.json();
    console.log('Info usuario:', userInfo);

    // Redirigir según rol
    if (userInfo.is_superuser) {
      window.location.href = '/administrador';
    } else {
      window.location.href = '/configuracion_usuario';
    }

  } catch (error) {
    console.error('Error en el login:', error);

    errorUsername.style.display = 'block';
    errorUsername.textContent = 'Error de conexión o servidor. Intenta más tarde.';
  }
});
