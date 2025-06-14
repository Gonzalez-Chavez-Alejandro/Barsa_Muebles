// Leer carrito guardado en localStorage o iniciar vacío
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Obtener referencias DOM del carrito
const carritoSection = document.getElementById("carrito");
const listaCarrito = document.getElementById("lista-carrito");
const totalPrecio = document.getElementById("total-precio");
const btnVaciar = document.getElementById("vaciar-carrito");
const btnCerrar = document.getElementById("cerrar-carrito");
const btnEncargar = document.getElementById("btn-encargar");
const btnAbrirCarrito = document.querySelector(".btn-carrito");

// Guardar carrito en localStorage
function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Abrir/cerrar carrito
function toggleMenu() {
  if (carritoSection.style.display === "none" || carritoSection.style.display === "") {
    carritoSection.style.display = "block";
    actualizarCarritoUI();
  } else {
    carritoSection.style.display = "none";
  }
}

// Agregar producto al carrito
function agregarAlCarrito() {
  if (!window.producto) {
    alert("Producto no cargado aún");
    return;
  }

  const index = carrito.findIndex(item => item.id === window.producto.id);
  if (index !== -1) {
    carrito[index].cantidad++;
  } else {
    const precioNum = Number(
      parseFloat(window.producto.precioOferta) > 0
        ? parseFloat(window.producto.precioOferta)
        : parseFloat(window.producto.precio)
    );
    carrito.push({
      id: window.producto.id,
      nombre: window.producto.nombre,
      precio: isNaN(precioNum) ? 0 : precioNum,
      cantidad: 1,
      imagen: (window.producto.nombreimagenes?.split(",")[0] || "").trim()
    });
  }

  guardarCarrito();
  actualizarCarritoUI();
}

// Actualizar interfaz carrito
function actualizarCarritoUI() {
  listaCarrito.innerHTML = "";

  if (carrito.length === 0) {
    listaCarrito.innerHTML = "<p>Tu carrito está vacío.</p>";
    totalPrecio.textContent = "0.00";
    return;
  }

  let total = 0;
  let precioCero = false;

  carrito.forEach((item, index) => {
    const divProducto = document.createElement("div");
    divProducto.classList.add("producto-carrito");
    divProducto.style.display = "flex";
    divProducto.style.justifyContent = "space-between";
    divProducto.style.alignItems = "center";
    divProducto.style.marginBottom = "10px";

    const img = document.createElement("img");
    img.src = item.imagen || "https://dummyimage.com/80x80/cccccc/969696&text=Sin+imagen";
    img.alt = item.nombre;
    img.style.width = "50px";
    img.style.height = "50px";
    img.style.objectFit = "cover";
    img.style.marginRight = "10px";

    const infoDiv = document.createElement("div");
    infoDiv.style.flexGrow = "1";

    const nombre = document.createElement("strong");
    nombre.textContent = item.nombre;

    // Etiqueta "Cantidad:"
    const labelCantidad = document.createElement("span");
    labelCantidad.textContent = "Cantidad:";
    labelCantidad.style.marginRight = "8px";

    // Contenedor horizontal para botones y número
    const cantidadControls = document.createElement("div");
    cantidadControls.style.display = "inline-flex";
    cantidadControls.style.alignItems = "center";

    const btnRestar = document.createElement("button");
    btnRestar.textContent = "−";
    btnRestar.style.margin = "0 5px";
    btnRestar.addEventListener("click", () => {
      item.cantidad--;
      if (item.cantidad <= 0) {
        carrito.splice(index, 1);
      }
      guardarCarrito();
      actualizarCarritoUI();
    });

    const spanCantidad = document.createElement("span");
    spanCantidad.textContent = item.cantidad;
    spanCantidad.style.margin = "0 5px";

    const btnSumar = document.createElement("button");
    btnSumar.textContent = "+";
    btnSumar.style.margin = "0 5px";
    btnSumar.addEventListener("click", () => {
      item.cantidad++;
      guardarCarrito();
      actualizarCarritoUI();
    });

    // Construir la línea de cantidad
    cantidadControls.appendChild(btnRestar);
    cantidadControls.appendChild(spanCantidad);
    cantidadControls.appendChild(btnSumar);

    infoDiv.appendChild(nombre);
    infoDiv.appendChild(document.createElement("br"));
    infoDiv.appendChild(labelCantidad);
    infoDiv.appendChild(cantidadControls);

    const precioDiv = document.createElement("div");
    const precioNum = Number(item.precio);
    const cantidadNum = Number(item.cantidad);
    let subtotal = 0;
    if (!isNaN(precioNum) && !isNaN(cantidadNum)) {
      subtotal = precioNum * cantidadNum;
    }

    // Si algún producto tiene precio 0
    if (precioNum === 0) {
      precioCero = true;
    }

    precioDiv.textContent = `$${subtotal.toFixed(2)}`;
    total += subtotal;

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "X";
    btnEliminar.style.marginLeft = "10px";
    btnEliminar.style.cursor = "pointer";
    btnEliminar.addEventListener("click", () => {
      carrito.splice(index, 1);
      guardarCarrito();
      actualizarCarritoUI();
    });

    divProducto.appendChild(img);
    divProducto.appendChild(infoDiv);
    divProducto.appendChild(precioDiv);
    divProducto.appendChild(btnEliminar);

    listaCarrito.appendChild(divProducto);
  });

  totalPrecio.textContent = precioCero ? "Presione encargar y contáctese con la empresa" : `$${total.toFixed(2)}`;
}

// Vaciar carrito
btnVaciar.addEventListener("click", () => {
  carrito = [];
  guardarCarrito();
  actualizarCarritoUI();
});

// Cerrar carrito
btnCerrar.addEventListener("click", () => {
  carritoSection.style.display = "none";
});

// Botón "Agregar al carrito" desde detalle
document.getElementById("agregar-carrito-detalle")?.addEventListener("click", agregarAlCarrito);

// Inicializar carrito al cargar
actualizarCarritoUI();
