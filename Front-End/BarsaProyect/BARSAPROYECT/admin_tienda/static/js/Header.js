
function toggleMenuUsuario() {
    const menu = document.getElementById("menu-usuario");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}

window.addEventListener('click', function(e) {
    const usuario = document.querySelector('.usuario-container');
    const menu = document.getElementById("menu-usuario");
    if (!usuario.contains(e.target)) {
        menu.style.display = "none";
    }
});


document.addEventListener('DOMContentLoaded', function () {
    
  // Código para toggle-password
  document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', function () {
      const passwordInput = this.previousElementSibling;
      const icon = this.querySelector('i');

      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
      } else {
        passwordInput.type = 'password';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
      }
    });
  });

  // Código para usuarios en localStorage
  if (!localStorage.getItem('usuarios')) {
    localStorage.setItem('usuarios', JSON.stringify(window.usuarios));
  }

  const usuarioActual = JSON.parse(localStorage.getItem('usuarioLogueado'));

  function actualizarMenuUsuario() {
    const menu = document.getElementById('menu-usuario');
    if (usuarioActual) {
      menu.innerHTML = `
      <p>Hola, ${usuarioActual.nombre}</p>
      <button id="btn-cerrar-sesion">Cerrar sesión</button>
      `;
      document.getElementById('btn-cerrar-sesion').addEventListener('click', () => {
        localStorage.removeItem('usuarioLogueado');
        location.reload();
      });
    }
  }
  actualizarMenuUsuario();

  // Captura submit, asegurando que el formulario exista
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const correo = document.getElementById('email').value.trim();
      const contrasena = document.getElementById('password').value.trim();

      const usuarios = JSON.parse(localStorage.getItem('usuarios'));

      const usuarioEncontrado = usuarios.find(u => u.correo === correo && u.contrasena === contrasena);

      if (usuarioEncontrado) {
        localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioEncontrado));
        alert('Inicio de sesión exitoso');
        location.reload();
      } else {
        alert('Correo o contraseña incorrectos');
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const btnLogin = document.getElementById("btnLogin");
  if (btnLogin) {
    btnLogin.addEventListener("click", function () {
      const url = btnLogin.dataset.url;
      window.location.href = url;
    });
  }
});



