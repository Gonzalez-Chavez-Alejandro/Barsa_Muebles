document.addEventListener("DOMContentLoaded", () => {
  const menu = document.getElementById("menu-usuario");
  const carritoContainer = document.getElementById("carrito");

  // Variables carrito
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const listaCarrito = document.getElementById("lista-carrito");
  const totalPrecio = document.getElementById("total-precio");
  const btnVaciar = document.getElementById("vaciar-carrito");
  const btnCerrar = document.getElementById("cerrar-carrito");
  const btnEncargar = document.getElementById("btn-encargar");

  // Estado de usuario validado
  let usuarioActual = null;

  // --- Funciones para carrito ---
  const guardarCarrito = () => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  };

  const calcularTotal = () => {
    return carrito.reduce((total, p) => total + p.precio * p.cantidad, 0);
  };

  const actualizarCarritoUI = () => {
    listaCarrito.innerHTML = "";
    carrito.forEach((p) => {
      const card = document.createElement("div");
      card.className = "item-carrito";
      card.style.border = "1px solid #ccc";
      card.style.borderRadius = "8px";
      card.style.padding = "10px";
      card.style.marginBottom = "10px";
      card.style.display = "flex";
      card.style.alignItems = "center";
      card.style.gap = "10px";

      const img = document.createElement("img");
      const imgUrl = p.imagen ? p.imagen.split(",")[0] : "https://via.placeholder.com/100";
      img.src = imgUrl;
      img.alt = p.nombre;
      img.style.width = "80px";
      img.style.height = "80px";
      img.style.objectFit = "cover";

      const info = document.createElement("div");
      const nombre = document.createElement("p");
      nombre.textContent = p.nombre;
      nombre.style.fontWeight = "bold";

      const precio = document.createElement("p");
      precio.textContent = `$${p.precio.toFixed(2)} x ${p.cantidad}`;

      info.appendChild(nombre);
      info.appendChild(precio);

      card.appendChild(img);
      card.appendChild(info);

      listaCarrito.appendChild(card);
    });

    totalPrecio.textContent = calcularTotal().toFixed(2);
  };

  const vaciarCarrito = () => {
    carrito = [];
    guardarCarrito();
    actualizarCarritoUI();
  };

  // --- Funciones para menú usuario ---
  function renderLoginPrompt() {
    if (!menu) return;
    menu.innerHTML = `
      <a class="btn-identificarse" id="btnLogin" href="/login/">Identificarse</a>
      <div></div>
      <p class="texto-nuevo">¿Eres un cliente nuevo? <a href="/registro/">Empieza aquí.</a></p>
    `;
  }

  function renderUserMenu(data) {
    if (!menu) return;
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
      usuarioActual = null;
      renderLoginPrompt();
      vaciarCarrito();
      if(carritoContainer) carritoContainer.style.display = "none";
      window.location.href = '/login/';
    });
  }

  // --- Validar token y cargar usuario ---
  async function validarTokenYUsuario() {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      renderLoginPrompt();
      return;
    }
    try {
      const res = await fetch('/api/user-info/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Token inválido o expirado");
      const data = await res.json();
      usuarioActual = data;
      renderUserMenu(data);
      if(carritoContainer) carritoContainer.style.display = "block";
    } catch (error) {
      console.warn("Error validando token:", error);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      usuarioActual = null;
      renderLoginPrompt();
      if(carritoContainer) carritoContainer.style.display = "none";
    }
  }

  // --- Eventos ---
  btnVaciar?.addEventListener("click", vaciarCarrito);
  btnCerrar?.addEventListener("click", () => {
    if(carritoContainer) carritoContainer.style.display = "none";
  });

  btnEncargar?.addEventListener("click", () => {
    if (!usuarioActual) {
      alert("Debes iniciar sesión para encargar productos.");
      return;
    }

    if (carrito.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    let encargos = JSON.parse(localStorage.getItem("encargos")) || [];

    const nuevoEncargo = {
      id: `${Date.now()}-${generateUUID()}`,
      usuario: usuarioActual,
      productos: carrito,
      fecha: new Date().toISOString(),
      total: calcularTotal()
    };

    encargos.push(nuevoEncargo);

    localStorage.setItem("encargos", JSON.stringify(encargos));
    vaciarCarrito();
    alert("¡Tu encargo ha sido registrado exitosamente!");
  });

  // --- Inicialización ---
  validarTokenYUsuario();
  actualizarCarritoUI();

  // Opcional: toggle menú usuario, ocultar menú al hacer click fuera, etc.
  // ...

});

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
