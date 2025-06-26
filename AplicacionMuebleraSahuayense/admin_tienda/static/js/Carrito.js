document.addEventListener("DOMContentLoaded", () => {
  const menu = document.getElementById("menu-usuario");
  const carritoContainer = document.getElementById("carrito");
  const listaCarrito = document.getElementById("lista-carrito");
  const totalPrecio = document.getElementById("total-precio");
  const btnVaciar = document.getElementById("vaciar-carrito");
  const btnCerrar = document.getElementById("cerrar-carrito");
  const btnEncargar = document.getElementById("btn-encargar");

  let usuarioActual = null;
  let carritoActual = null;
  const token = localStorage.getItem("accessToken");

  function renderLoginPrompt() {
    if (!menu) return;
    menu.innerHTML = `
      <a class="btn-identificarse" href="/login/">Identificarse</a>
      <div></div>
      <p class="texto-nuevo">¿Eres un cliente nuevo? <a href="/registro/">Empieza aquí.</a></p>
    `;
    carritoContainer?.style && (carritoContainer.style.display = "none");
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
    document.getElementById("btn-cerrar-sesion")?.addEventListener("click", () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      usuarioActual = null;
      carritoActual = null;
      renderLoginPrompt();
      window.location.href = '/login/';
    });
  }

  async function validarTokenYUsuario() {
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
      await cargarCarritoAPI();
    } catch (error) {
      console.warn("Error validando token:", error);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      usuarioActual = null;
      renderLoginPrompt();
      window.location.href = '/login/';
    }
  }
  
  async function cargarCarritoAPI() {
    if (!token) return;
    try {
      const res = await fetch("/encargos/obtener-carrito/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 204) {
        carritoActual = null;
        actualizarCarritoUIAPI();
        return;
      }
      if (!res.ok) throw new Error("Error al obtener el carrito");
      carritoActual = await res.json();
      actualizarCarritoUIAPI();
    } catch (error) {
      console.error("Error al cargar el carrito:", error);
      alert("Hubo un problema al cargar el carrito.");
    }
  }

  function actualizarCarritoUIAPI() {
    if (!listaCarrito || !totalPrecio) return;
    listaCarrito.innerHTML = "";

    const productos = carritoActual?.productos_encargados || [];
    if (!productos.length) {
      listaCarrito.innerHTML = "<p>Tu carrito está vacío.</p>";
      totalPrecio.textContent = "0.00";
      return;
    }

    let total = 0;
    let hayProductoSinCobrar = false;

    productos.forEach(({ producto, cantidad, precio_unitario }) => {
      const div = document.createElement("div");
      div.className = "producto-carrito";
      div.style = "display: flex; align-items: center; gap: 10px; margin-bottom: 10px;";

      const imagen = (producto.imageFurniture?.split(",")[0] || "https://via.placeholder.com/80").trim();
      const precio = parseFloat(precio_unitario);
      const precioTexto = precio > 0 ? `$${precio.toFixed(2)}` : "❌";
      const subtotal = precio > 0 ? `$${(precio * cantidad).toFixed(2)}` : "❌";

      if (precio <= 0) hayProductoSinCobrar = true;
      else total += precio * cantidad;

      div.innerHTML = `
        <img src="${imagen}" alt="${producto.nameFurniture}" style="width:50px; height:50px; object-fit:cover;" />
        <strong style="flex:1;">${producto.nameFurniture}</strong>
        <div style="display:flex; align-items:center; gap:5px;">
          <button class="btn-disminuir" data-producto-id="${producto.id}">-</button>
          <span class="cantidad-valor">${cantidad}</span>
          <button class="btn-aumentar" data-producto-id="${producto.id}">+</button>
        </div>
        <span>Precio: ${precioTexto}</span>
        
      `;
      listaCarrito.appendChild(div);
    });

    totalPrecio.textContent = hayProductoSinCobrar ? "⚠️ Hay muebles sin cobrar" : `$${total.toFixed(2)}`;
    totalPrecio.style.color = hayProductoSinCobrar ? "red" : "black";

    listaCarrito.querySelectorAll(".btn-aumentar").forEach(btn =>
      btn.addEventListener("click", async () => {
        const id = btn.dataset.productoId;
        const item = carritoActual.productos_encargados.find(pe => pe.producto.id == id);
        if (item) await cambiarCantidadProducto(id, item.cantidad + 1);
      })
    );

    listaCarrito.querySelectorAll(".btn-disminuir").forEach(btn =>
      btn.addEventListener("click", async () => {
        const id = btn.dataset.productoId;
        const item = carritoActual.productos_encargados.find(pe => pe.producto.id == id);
        if (!item) return;
        if (item.cantidad > 1) {
          await cambiarCantidadProducto(id, item.cantidad - 1);
        } else if (confirm("¿Eliminar este producto del carrito?")) {
          await eliminarProductoCarrito(id);
        }
      })
    );
  }

  async function cambiarCantidadProducto(productoId, nuevaCantidad) {
    if (!token || !carritoActual) return;
    try {
      const res = await fetch(`/encargos/actualizar-cantidad/${carritoActual.id}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ producto_id: productoId, cantidad: nuevaCantidad })
      });

      if (!res.ok) {
        const data = await res.json();
        alert("❌ Error al actualizar cantidad: " + (data.detail || JSON.stringify(data)));
        return;
      }

      carritoActual = await res.json();
      actualizarCarritoUIAPI();
    } catch (error) {
      alert("❌ Error inesperado al actualizar cantidad.");
    }
  }

  async function eliminarProductoCarrito(productoId) {
    await cambiarCantidadProducto(productoId, 0);
  }

  btnVaciar?.addEventListener("click", async () => {
    if (!carritoActual?.productos_encargados?.length) return;
    if (!confirm("¿Vaciar todo el carrito?")) return;
    try {
      await Promise.all(carritoActual.productos_encargados.map(pe =>
        eliminarProductoCarrito(pe.producto.id)
      ));
      alert("Carrito vaciado.");
    } catch {
      alert("Error vaciando carrito.");
    }
  });

  btnCerrar?.addEventListener("click", () => {
    carritoContainer?.style && (carritoContainer.style.display = "none");
  });

  btnEncargar?.addEventListener("click", async () => {
    if (!usuarioActual || !carritoActual?.productos_encargados?.length) {
      alert("No puedes encargar sin productos.");
      return;
    }

    try {
      const res = await fetch(`/encargos/procesar-pedido/${carritoActual.id}/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert("Error al procesar pedido: " + (errorData.detail || "Error desconocido"));
        return;
      }

      alert("✅ Pedido procesado con éxito.");
      carritoActual = null;
      actualizarCarritoUIAPI();
      window.location.href = "/configuracion_usuario/#mis-encargos";
    } catch {
      alert("Error inesperado al procesar pedido.");
    }
  });
 
  document.getElementById("agregar-carrito-detalle")?.addEventListener("click", () => {
    if (!window.producto?.id) {
      alert("⚠️ Producto no cargado aún.");
      return;
    }
    agregarAlCarritoAPI(window.producto, 1);
  });

  async function agregarAlCarritoAPI(producto, cantidad) {
  if (!token) return;

  const precio = parseFloat(producto.precioOferta) > 0
    ? parseFloat(producto.precioOferta)
    : parseFloat(producto.precio);

  try {
    // Si no hay carrito, crear uno
    if (!carritoActual?.id) {
      const res = await fetch("/encargos/crear/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ productos: [] })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "No se pudo crear el carrito");
      }

      // Intentamos leer carrito creado (puede que backend no devuelva id)
      carritoActual = await res.json();

      // Si no tiene id, forzamos una carga del carrito activo
      if (!carritoActual?.id) {
        const resCarrito = await fetch("/encargos/obtener-carrito/", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!resCarrito.ok) throw new Error("No se pudo obtener el carrito creado");
        carritoActual = await resCarrito.json();
      }
    }

    // Ahora sí agregamos producto
    const resAgregar = await fetch(`/encargos/agregar/${carritoActual.id}/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        producto_id: producto.id,
        cantidad,
        precio_unitario: precio
      })
    });

    if (!resAgregar.ok) {
      const err = await resAgregar.json();
      throw new Error(err.detail || JSON.stringify(err));
    }

    carritoActual = await resAgregar.json();
    actualizarCarritoUIAPI();
  } catch (error) {
    console.error("Error al agregar al carrito:", error);
    alert("❌ Ocurrió un error al agregar el producto.");
  }
}
  validarTokenYUsuario();
});

document.getElementById("btn-encargar")?.addEventListener("click", () => {
  carritoContainer.style.display = "block";
});

function VerficarSesion(){
  const token = localStorage.getItem("accessToken");
  token != null ? 0 : alert("Favor de iniciar sesion")
}