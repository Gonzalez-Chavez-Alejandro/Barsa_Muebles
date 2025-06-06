const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const loginData = {
    username: document.getElementById('email').value,
    password: document.getElementById('password').value
  };

  try {
    // Paso 1: Hacer login para obtener tokens
    const response = await fetch('http://127.0.0.1:8000/api/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error en el login:', errorData);
      return;
    }

    const data = await response.json();
    console.log('Login exitoso:', data);

    // Guarda tokens (access, refresh) en localStorage o donde quieras
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);

    // Paso 2: Consultar endpoint que devuelve info del usuario
    const userResponse = await fetch('http://127.0.0.1:8000/api/user-info/', {
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

    const userInfo = await userResponse.json();
    console.log('Info usuario:', userInfo);

    // Paso 3: Redirigir según si es superusuario
    if (userInfo.is_superuser) {
      window.location.href = '/ruta-para-superusuarios';
    } else {
      window.location.href = '/ruta-para-usuarios-normales';
    }

  } catch (error) {
    console.error('Error en el login:', error);
  }
});
