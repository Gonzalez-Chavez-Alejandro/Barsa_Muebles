
document.getElementById('registro-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const form = e.target;
  const data = {
    username: form.email.value,
    email: form.email.value,
    phoneUser: form.phoneUser.value,
    password: form.password.value,
    first_name: form.first_name.value,
    last_name: form.last_name.value
  };

  const confirmPassword = form.confirm_password.value;
  if (data.password !== confirmPassword) {
    alert("Las contraseñas no coinciden.");
    return;
  }

  try {
    const response = await fetch('/api/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      const registroData = await response.json();

      // Ahora login automático
      // Dentro del try después del registro exitoso
      const loginRes = await fetch('/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: data.email,  // ✅ usa 'username' en lugar de 'email'
          password: data.password
        })
      });

 
      if (loginRes.ok) {
        const tokens = await loginRes.json();
        localStorage.setItem('accessToken', tokens.access);
        localStorage.setItem('refreshToken', tokens.refresh);

        alert("Usuario registrado y autenticado con éxito.");
        window.location.reload(); // recargar para que se actualice el menú
      } else {
        alert("Usuario registrado, pero fallo al iniciar sesión.");
      }
    }

  } catch (error) {
    alert("Error de red o servidor.");
    console.error(error);
  }
});

