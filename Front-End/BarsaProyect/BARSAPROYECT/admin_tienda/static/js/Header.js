
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

// Inicializar datos en localStorage si no existen
['usuarios', 'correo'].forEach(key => {
    if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify(window[key]));
    }
});

  const usuarioActual = JSON.parse(localStorage.getItem('usuarioLogueado'));

  function actualizarMenuUsuario() {
    const menu = document.getElementById('menu-usuario');
    if (usuarioActual) {
      menu.innerHTML = `
       <div class="user-info">
        <h1 class="user-greeting">Hola, ${usuarioActual.nombre}</h1>
        <p class="email">${usuarioActual.correo}</p>
        <button id="btn-configuracion-usuario"><i class="fas fa-cog"></i>
         Configuración</button>
    </div>
    
    
    <button id="btn-cerrar-sesion"><i class="fas fa-sign-out-alt"></i>
    Cerrar sesión</button>
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



document.addEventListener('DOMContentLoaded', () => {
    const btnConfig = document.getElementById('btn-configuracion-usuario');
    if (btnConfig) {
      btnConfig.addEventListener('click', () => {
        window.location.href = urlConfiguracionUsuario;
      });
    }
  });