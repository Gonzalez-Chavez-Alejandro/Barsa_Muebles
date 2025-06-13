document.addEventListener("DOMContentLoaded", () => {
  const menu = document.getElementById("menu-usuario");

  if (!menu) return;

  try {
    const token = localStorage.getItem('accessToken');
    console.log("token en localStorage:", token);

    if (token) {
      fetch('/api/user-info/', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        console.log("Respuesta /api/user-info/ status:", res.status);
        if (!res.ok) throw new Error('No autorizado');
        return res.json();
      })
      .then(data => {
        console.log("Datos usuario:", data);
        menu.innerHTML = `
          <div class="user-info">
            <h1 class="user-greeting">Hola, ${data.username}</h1>
            <p class="email">${data.email}</p>
            <a href="/configuracion_usuario/" id="btn-configuracion-usuario">
              <i class="fas fa-cog"></i> Configuración
            </a>
            <button id="btn-cerrar-sesion">
              <i class="fas fa-sign-out-alt"></i> Cerrar sesión
            </button>
          </div>
        `;

        document.getElementById("btn-cerrar-sesion").addEventListener("click", () => {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = '/login/';
        });
      })
      .catch((err) => {
        console.warn("Error al obtener info usuario:", err);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        renderLoginPrompt();
      });
    } else {
      renderLoginPrompt();
    }

    function renderLoginPrompt() {
      menu.innerHTML = `
        <a class="btn-identificarse" id="btnLogin" href="/login/">Identificarse</a>
        <div></div>
        <p class="texto-nuevo">¿Eres un cliente nuevo? <a href="/registro/">Empieza aquí.</a></p>
      `;
    }

    // Toggle menú
    function toggleMenuUsuario() {
      menu.style.display = (menu.style.display === "block") ? "none" : "block";
    }
    window.toggleMenuUsuario = toggleMenuUsuario;

    // Ocultar menú si se hace clic fuera
    window.addEventListener('click', function (e) {
      const usuarioBtn = document.querySelector('.usuario-container');
      if (!usuarioBtn || !menu) return;
      if (!usuarioBtn.contains(e.target) && !menu.contains(e.target)) {
        menu.style.display = "none";
      }
    });

  } catch (error) {
    console.error("Error con localStorage u otro problema:", error);
  }
});

/*************************************************************/
                  /* Validacion del Token */
/*************************************************************/

function checkAuthRedirect() {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    window.location.href = '/'; // Página principal o login
  }
}




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