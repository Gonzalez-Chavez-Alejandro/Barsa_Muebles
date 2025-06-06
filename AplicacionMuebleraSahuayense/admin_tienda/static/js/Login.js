const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const loginData = {
    username: document.getElementById('email').value,
    password: document.getElementById('password').value
  };

  try {
    const response = await fetch('http://127.0.0.1:8000/api/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error en el login:', errorData);
      return;
    }

    const data = await response.json();
    console.log('Login exitoso:', data);
    // Aquí guardas tokens, rediriges, etc.

  } catch (error) {
    console.error('Error en el login:', error);
  }
});
