
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
        window.location.href = '/';
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
  


























/*************************************************************/
/*********************** Foother *****************************/


 window.addEventListener("DOMContentLoaded", () => {
  const stored = localStorage.getItem('footerData');
  if (!stored) return;

  const data = JSON.parse(stored);

  // 📧 Email
  const emailSpan = document.getElementById("dynamic-email");
  if (emailSpan && data.email) {
    emailSpan.textContent = data.email;
  }

  // ☎️ Teléfonos
  const phoneList = document.getElementById("dynamic-phones");
  if (phoneList && data.phones) {
    phoneList.innerHTML = '';
    data.phones.forEach(phone => {
      if (phone) {
        const li = document.createElement("li");
        li.textContent = phone;
        phoneList.appendChild(li);
      }
    });
  }

  // 📍 Ubicaciones
  const locationList = document.getElementById("dynamic-locations");
  if (locationList && data.locations) {
    locationList.innerHTML = '';
    data.locations.forEach(loc => {
      if (loc) {
        const li = document.createElement("li");
        li.textContent = loc;
        locationList.appendChild(li);
      }
    });
  }

  // 🌐 Redes Sociales
  const socialContainer = document.getElementById("dynamic-social");
  if (socialContainer && data.socials) {
    socialContainer.innerHTML = '';
    
    Object.entries(data.socials).forEach(([platform, url]) => {
      if (url) {
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';

        let iconClass;
        switch(platform.toLowerCase()) {
          case 'whatsapp':
            iconClass = 'fab fa-whatsapp';
            break;
          case 'email':
            iconClass = 'fas fa-envelope';
            break;
          default:
            iconClass = `fab fa-${platform.toLowerCase()}`;
        }

        a.innerHTML = `<i class="${iconClass}"></i>`;
        socialContainer.appendChild(a);
      }
    });
  }
});