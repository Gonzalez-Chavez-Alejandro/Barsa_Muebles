document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('registro-form');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Recolectar campos
    const firstName = document.getElementById('nombre').value.trim();
    const edad = parseInt(document.getElementById('edad').value.trim());
    const email = document.getElementById('correo').value.trim();
    const password = document.getElementById('contrasena').value;
    const confirmPassword = document.getElementById('confirmar_contrasena').value;
    const phoneUser = document.getElementById('telefono').value.trim();
    const terminos = document.getElementById('terminos').checked;

    // Validaciones
    if (!terminos) {
      alert('Debes aceptar los términos y condiciones.');
      return;
    }

    if (password !== confirmPassword) {
      document.getElementById('confirmar-error').style.display = 'block';
      return;
    } else {
      document.getElementById('confirmar-error').style.display = 'none';
    }

    if (password.length < 8) {
      document.getElementById('contrasena-error').style.display = 'block';
      return;
    } else {
      document.getElementById('contrasena-error').style.display = 'none';
    }

    if (isNaN(edad) || edad < 1 || edad > 120) {
      document.getElementById('edad-error').style.display = 'block';
      return;
    } else {
      document.getElementById('edad-error').style.display = 'none';
    }

    // Preparar datos para API
    const username = firstName;  // <--- CAMBIO AQUÍ
    const payload = {
      username: username,
      email: email,
      password: password,
      phoneUser: phoneUser,
      ageUser: edad
    };

    // Registrar usuario
    fetch('/api/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => { throw err; });
        }
        return res.json();
      })
      .then(data => {
        // Registro exitoso, login automático
        return fetch('/api/login/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username,
            password: password
          })
        });
      })
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => { throw err; });
        }
        return res.json();
      })
      .then(authData => {
        localStorage.setItem('accessToken', authData.access);
        localStorage.setItem('refreshToken', authData.refresh);
        alert('Registro e inicio de sesión exitoso');
        window.location.href = '/';
      })
      .catch(err => {
        console.error('Error:', err);
        alert('Ocurrió un error durante el registro o login. Intenta de nuevo.');
      });
  });

  // Obtener token CSRF para Django
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
});
