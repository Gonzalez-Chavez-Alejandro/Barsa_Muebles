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

      if (errorData.username) {
        errorUsername.style.display = 'block';
        errorUsername.textContent = errorData.username.join(' ');
      } 
      
      if (errorData.password) {
        errorPassword.style.display = 'block';
        errorPassword.textContent = errorData.password.join(' ');
      }
      
      // Por si hay algún error genérico inesperado
      if (!errorData.username && !errorData.password) {
        errorUsername.style.display = 'block';
        errorUsername.textContent = 'Credenciales inválidas, intenta de nuevo.';
      }

      return;
    }

    // Si el login es exitoso, continúa con la lógica normal...

  } catch (error) {
    console.error('Error en el login:', error);

    errorUsername.style.display = 'block';
    errorUsername.textContent = 'Error de conexión o servidor. Intenta más tarde.';
  }
});
