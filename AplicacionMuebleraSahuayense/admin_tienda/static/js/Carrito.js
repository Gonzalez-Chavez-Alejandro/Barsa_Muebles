let carritoActual = null;
const token = localStorage.getItem("accessToken");

async function cargarCarritoAPI() {
  if (!token) {
    alert("No estás autenticado.");
    return;
  }
  try {
    const res = await fetch("/encargos/mis-encargos/", {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("No autorizado");
    const encargos = await res.json();
    carritoActual = encargos.length ? encargos[0] : null;
    actualizarCarritoUIAPI();
  } catch (error) {
    console.error("Error al cargar el carrito:", error);
    alert("Hubo un problema al cargar el carrito.");
  }
}

function actualizarCarritoUIAPI() {
  const contenedor = document.getElementById("lista-carrito");
  contenedor.innerHTML = "";

  if (!carritoActual || !carritoActual.productos_encargados.length) {
    contenedor.innerHTML = "<p>Tu carrito está vacío.</p>";
    document.getElementById("total-precio").textContent = "0.00";
    return;
  }

  let total = 0;
  let hayProductoSinCobrar = false;

  carritoActual.productos_encargados.forEach(({ producto, cantidad, precio_unitario }) => {
    const div = document.createElement("div");
    div.className = "producto-carrito";
    div.style.display = "flex";
    div.style.alignItems = "center";
    div.style.gap = "10px";
    div.style.marginBottom = "10px";

    const imagenes = producto.imageFurniture ? producto.imageFurniture.split(",") : [];
    const imagen = imagenes.length ? imagenes[0].trim() : "https://via.placeholder.com/80";
    const precioNum = parseFloat(precio_unitario);

    let precioMostrarTexto = "";
    let subtotalTexto = "";
    if (precioNum > 0) {
      precioMostrarTexto = `$${precioNum.toFixed(2)}`;
      subtotalTexto = `$${(precioNum * cantidad).toFixed(2)}`;
      total += precioNum * cantidad;
    } else {
      precioMostrarTexto = "❌";
      subtotalTexto = "❌";
      hayProductoSinCobrar = true;
    }

    div.innerHTML = `
      <img src="${imagen}" alt="${producto.nameFurniture}" style="width:50px; height:50px; object-fit:cover;" />
      <strong style="flex:1;">${producto.nameFurniture}</strong>
      <div class="cantidad-control" style="display:flex; align-items:center; gap:5px;">
        <button class="btn-disminuir" data-producto-id="${producto.id}">-</button>
        <span class="cantidad-valor">${cantidad}</span>
        <button class="btn-aumentar" data-producto-id="${producto.id}">+</button>
      </div>
      <span>Precio: ${precioMostrarTexto}</span>
      <span>Subtotal: ${subtotalTexto}</span>
    `;
    contenedor.appendChild(div);
  });

  // Mostrar total o mensaje de productos sin cobrar
  const totalPrecioElem = document.getElementById("total-precio");
  if (hayProductoSinCobrar) {
    totalPrecioElem.textContent = "⚠️ Hay muebles que no han sido cobrados, pongase en contacto.";
    totalPrecioElem.style.color = "red";
  } else {
    totalPrecioElem.textContent = `$${total.toFixed(2)}`;
    totalPrecioElem.style.color = "black";
  }

  const botonesAumentar = contenedor.querySelectorAll(".btn-aumentar");
  botonesAumentar.forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-producto-id");
      const productoEncargado = carritoActual.productos_encargados.find(pe => pe.producto.id == id);
      if (productoEncargado) {
        await cambiarCantidadProducto(id, productoEncargado.cantidad + 1);
      }
    });
  });

  const botonesDisminuir = contenedor.querySelectorAll(".btn-disminuir");
  botonesDisminuir.forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-producto-id");
      const productoEncargado = carritoActual.productos_encargados.find(pe => pe.producto.id == id);
      if (productoEncargado && productoEncargado.cantidad > 1) {
        await cambiarCantidadProducto(id, productoEncargado.cantidad - 1);
      } else if (productoEncargado && productoEncargado.cantidad === 1) {
        if (confirm("¿Quieres eliminar este producto del carrito?")) {
          await eliminarProductoCarrito(id);
        }
      }
    });
  });
}

async function cambiarCantidadProducto(productoId, nuevaCantidad) {
  if (!token || !carritoActual) {
    alert("No estás autenticado o no hay carrito.");
    return;
  }

  try {
    const res = await fetch(`/encargos/actualizar-cantidad/${carritoActual.id}/`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        producto_id: productoId,
        cantidad: nuevaCantidad
      })
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Error al actualizar cantidad:", errorData);
      alert("❌ Error al actualizar cantidad: " + (errorData.detail || JSON.stringify(errorData)));
      return;
    }

    carritoActual = await res.json();
    actualizarCarritoUIAPI();
  } catch (error) {
    console.error("Error al actualizar cantidad:", error);
    alert("❌ Error inesperado al actualizar cantidad.");
  }
}

async function eliminarProductoCarrito(productoId) {
  if (!token || !carritoActual) {
    alert("No estás autenticado o no hay carrito.");
    return;
  }

  try {
    const res = await fetch(`/encargos/actualizar-cantidad/${carritoActual.id}/`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        producto_id: productoId,
        cantidad: 0
      })
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Error al eliminar producto:", errorData);
      alert("❌ Error al eliminar producto: " + (errorData.detail || JSON.stringify(errorData)));
      return;
    }

    carritoActual = await res.json();
    actualizarCarritoUIAPI();
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    alert("❌ Error inesperado al eliminar producto.");
  }
}

document.getElementById("agregar-carrito-detalle").addEventListener("click", () => {
  if (!window.producto) {
    alert("⚠️ Producto no cargado aún");
    return;
  }
  agregarAlCarritoAPI(window.producto, 1);
});

async function agregarAlCarritoAPI(producto, cantidad) {
  if (!token) {
    alert("No estás autenticado.");
    return;
  }

  const precio = parseFloat(producto.precioOferta) > 0
    ? parseFloat(producto.precioOferta)
    : parseFloat(producto.precio);

  try {
    if (!carritoActual) {
      const resCrear = await fetch("/encargos/crear/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ productos: [] })
      });
      if (!resCrear.ok) {
        const errorCrear = await resCrear.json();
        console.error("Error creando carrito:", errorCrear);
        throw new Error("❌ Error creando carrito.");
      }
      carritoActual = await resCrear.json();
    }

    const resAgregar = await fetch(`/encargos/agregar/${carritoActual.id}/`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        producto_id: producto.id,
        cantidad: cantidad,
        precio_unitario: precio
      })
    });

    if (!resAgregar.ok) {
      const errData = await resAgregar.json();
      console.error("Error al agregar producto:", errData);
      alert("❌ Error al agregar producto: " + (errData.detail || JSON.stringify(errData)));
      return;
    }

    carritoActual = await resAgregar.json();
    actualizarCarritoUIAPI();
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
    alert("❌ Ocurrió un error al agregar el producto al carrito.");
  }
}

cargarCarritoAPI();
