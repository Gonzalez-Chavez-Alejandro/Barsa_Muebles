document.addEventListener("DOMContentLoaded", () => {
  // Carga carrito desde localStorage
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  // Elementos DOM
  const listaCarrito = document.getElementById("lista-carrito");
  const totalPrecio = document.getElementById("total-precio");
  const btnVaciar = document.getElementById("vaciar-carrito");
  const btnCerrar = document.getElementById("cerrar-carrito");
  const btnEncargar = document.getElementById("btn-encargar");
  const carritoContainer = document.getElementById("carrito");

  // Guardar carrito
  const guardarCarrito = () => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  };

  // Calcular total
  const calcularTotal = () => {
    return carrito.reduce((total, p) => total + p.precio * p.cantidad, 0);
  };

  // Actualizar UI carrito
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

  // Vaciar carrito
  const vaciarCarrito = () => {
    carrito = [];
    guardarCarrito();
    actualizarCarritoUI();
  };

  // Evento vaciar carrito
  btnVaciar.addEventListener("click", vaciarCarrito);

  // Evento cerrar carrito
  btnCerrar.addEventListener("click", () => {
    carritoContainer.style.display = "none";
  });

  // Evento encargar carrito
  btnEncargar.addEventListener("click", () => {
    const usuarioActual = JSON.parse(localStorage.getItem("usuarioLogueado"));

    if (!usuarioActual) {
      alert("Debes iniciar sesión para encargar productos.");
      return;
    }

    if (carrito.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    // Obtener encargos guardados o crear array vacío
    let encargos = JSON.parse(localStorage.getItem("encargos")) || [];

    // Crear objeto encargo con usuario y productos
    const nuevoEncargo = {
      id: `${Date.now()}-${generateUUID()}`,

      usuario: usuarioActual,
      productos: carrito,
      fecha: new Date().toISOString(),
      total: calcularTotal()
    };

    encargos.push(nuevoEncargo);

    // Guardar encargos
    localStorage.setItem("encargos", JSON.stringify(encargos));

    // Vaciar carrito y actualizar UI
    vaciarCarrito();

    alert("¡Tu encargo ha sido registrado exitosamente!");
  });

  // Inicializar UI carrito
  actualizarCarritoUI();
});
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
