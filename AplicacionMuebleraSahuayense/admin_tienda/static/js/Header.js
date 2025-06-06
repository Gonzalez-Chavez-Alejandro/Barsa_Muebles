document.addEventListener("DOMContentLoaded", () => {
  const menu = document.getElementById("menu-usuario");
  const token = localStorage.getItem('accessToken');

  if (!menu) return;
    console.log("token",token)

  if (token) {
    fetch('/api/usuario/', {
      headers: { Authorization: `Bearer ${token}` }
    })
      //.then(res => res.json())
      .then(data => {
        console.log("data",data)
        menu.innerHTML = `
          <div class="user-info">
            <h1 class="user-greeting">Hola, ${data.first_name}</h1>
            <p class="email">${data.email}</p>
            <a href="/configuracion_usuario/" id="btn-configuracion-usuario">
              <i class="fas fa-cog"></i> Configuración
            </a>
            <button id="btn-cerrar-sesion">
              <i class="fas fa-sign-out-alt"></i> Cerrar sesión2
            </button>
          </div>
        `;
        document.getElementById("btn-cerrar-sesion").addEventListener("click", () => {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          location.reload();
        });
      })
      .catch(() => {
        renderLoginPrompt();
      });
  } else {
    renderLoginPrompt();
  }

  function renderLoginPrompt() {
    menu.innerHTML = `
      <a class="btn-identificarse" id="btnLogin" <a href="/login/">Identificarse</a>
      <div></div>
      <p class="texto-nuevo">¿Eres un cliente nuevo? <a href="/registro/">Empieza aquí.</a></p>
    `;
    const btnLogin = document.getElementById("btnLogin");
    if (btnLogin) {
      btnLogin.addEventListener("click", () => {
        //window.location.href = "/login/";
      });
    }
  }

  // Lógica del menú
  function toggleMenuUsuario() {
    const menu = document.getElementById("menu-usuario");
    if (!menu) return;
    menu.style.display = (menu.style.display === "block") ? "none" : "block";
  }
  window.toggleMenuUsuario = toggleMenuUsuario;

  window.addEventListener('click', function (e) {
    const usuario = document.querySelector('.usuario-container');
    const menu = document.getElementById("menu-usuario");
    if (!usuario || !menu) return;
    if (!usuario.contains(e.target) && !menu.contains(e.target)) {
      menu.style.display = "none";
    }
  });
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