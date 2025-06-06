document.getElementById('login-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/api/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,  // o username, según tu serializer
        password: password
      })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);
      window.location.href = "/administrador/";
    } else {
      alert("Error: " + (data.detail || "Credenciales inválidas"));
    }
  } catch (error) {
    console.error("Error en el login:", error);
    alert("Error de red o servidor.");
  }
});
