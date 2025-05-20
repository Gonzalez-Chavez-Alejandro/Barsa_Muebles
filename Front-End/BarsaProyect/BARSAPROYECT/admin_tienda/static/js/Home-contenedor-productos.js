let productos = window.productos || [];
let categorias = window.categorias || [];

let categoriaSeleccionada = "all";

function renderTarjetas(lista = productos) {
    const contenedor = document.getElementById("contenedor-productos");
    contenedor.innerHTML = "";

    if (lista.length === 0) {
        contenedor.innerHTML = "<p>No se encontraron productos.</p>";
        return;
    }

    lista.forEach(p => {
        const div = document.createElement("div");
        div.className = "tarjeta-producto";

        const imagen = (p.nombreimagenes?.split(",")[0] || "https://via.placeholder.com/300x180").trim();
        const precio = p.oferta ? `<span class="oferta">$${p.precioOferta}</span> <del>$${p.precio}</del>` : `$${p.precio}`;

        div.innerHTML = `
              <img src="${imagen}" alt="${p.nombre}">
              <div class="contenido">
                <div class="nombre">${p.nombre}</div>
                <div class="descripcion">${p.descripcion}</div>
                <div class="precio">${precio}</div>
                <button onclick="agregarAlCarrito(${p.id})">Agregar al carrito</button>
              </div>
            `;

        contenedor.appendChild(div);
    });
}

function renderCategorias() {
    const listaCat = document.getElementById("lista-categorias");

    categorias.forEach(cat => {
        const li = document.createElement("li");
        li.textContent = cat.nombre;
        li.dataset.id = cat.id;
        li.onclick = () => {
            categoriaSeleccionada = cat.id;
            document.querySelectorAll("#lista-categorias li").forEach(el => el.classList.remove("categoria-activa"));
            li.classList.add("categoria-activa");
            aplicarFiltros();
        };
        listaCat.appendChild(li);
    });
}

function aplicarFiltros() {
    const termino = document.getElementById("buscador").value.toLowerCase();

    let lista = productos.filter(p => {
        const coincideBusqueda =
            p.nombre.toLowerCase().includes(termino) ||
            p.descripcion.toLowerCase().includes(termino);

        const coincideCategoria = categoriaSeleccionada === "all" || p.categoriaId == categoriaSeleccionada;

        return coincideBusqueda && coincideCategoria;
    });

    renderTarjetas(lista);
}

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
    renderCategorias();
    renderTarjetas();

    document.getElementById("buscador").addEventListener("input", aplicarFiltros);
    document.querySelector("[data-id='all']").onclick = () => {
        categoriaSeleccionada = "all";
        document.querySelectorAll("#lista-categorias li").forEach(el => el.classList.remove("categoria-activa"));
        document.querySelector("[data-id='all']").classList.add("categoria-activa");
        aplicarFiltros();
    };
});









function renderTarjetas(lista = productos) {
    
    const contenedor = document.getElementById("contenedor-productos");
    contenedor.innerHTML = "";

    if (lista.length === 0) {
        contenedor.innerHTML = "<p>No se encontraron productos.</p>";
        return;
    }

    lista.forEach(p => {
        const div = document.createElement("div");
        div.className = "tarjeta-producto";

        const imagen = (p.nombreimagenes?.split(",")[0] || p.imagen || "https://via.placeholder.com/300x180").trim();

        let precioHTML = "";
        let descuento = 0;
        let ahorro = 0;

        if (p.oferta) {
            precioHTML = `<span class="oferta">$${p.precioOferta}</span> <del>$${p.precio}</del>`;
            descuento = Math.round(((p.precio - p.precioOferta) / p.precio) * 100);
            ahorro = p.precio - p.precioOferta;
        } else {
            precioHTML = `<span class="oferta">$${p.precio}</span>`;
        }

        div.innerHTML = `
            ${descuento > 0 ? `<div class="descuento">${descuento}%</div>` : ''}
            <img src="${imagen}" alt="${p.nombre}">
            <div class="contenido">
                <h2 class="nombre">${p.nombre}</h2>
                <p class="descripcion">${p.descripcion}</p>
                <div class="precio">${precioHTML}</div>
                <div class="ahorro-boton">
                    ${descuento > 0 ? `<div class="ahorro">Ahorras $${ahorro}</div>` : ''}
                    <button onclick="verDetalle(${p.id})">Ver Producto</button>
                </div>
            </div>
        `;

        contenedor.appendChild(div);
    });
}











function verDetalle(id) {
    const prod = productos.find(p => p.id === id);
    if (!prod) return;

    const imagen = (prod.nombreimagenes?.split(",")[0] || prod.imagen || "https://via.placeholder.com/300").trim();
    detalleImagen.src = imagen;
    detalleNombre.textContent = prod.nombre;
    detalleDescripcion.textContent = prod.descripcion;
    detallePrecio.textContent = `$${prod.precio}`;
    detallePrecioOriginal.textContent = `$${prod.precioOriginal}`;

    // Oculta la lista principal y muestra el detalle
    document.querySelector(".contenido-principal").style.display = "none";
    
    detalleSeccion.classList.add("activo");  

    const overlay = document.getElementById("overlay-detalle");

window.verDetalle = function(id) {
  const prod = productos.find(p => p.id === id);
  if (!prod) return;

  // Código existente para rellenar detalle...

  // Mostrar overlay y detalle
  overlay.style.display = "block";
  detalleSeccion.classList.add("activo");
  detalleSeccion.style.display = "block";

  // Evitar scroll del body
  document.body.classList.add("no-scroll");
};

// Agregar evento para botón regresar o para cerrar detalle
btnRegresar.addEventListener("click", () => {
  detalleSeccion.classList.remove("activo");
  detalleSeccion.style.display = "none";
  overlay.style.display = "none";

  // Mostrar contenido principal
  document.querySelector(".contenido-principal").style.display = "block";

  // Restaurar scroll y selección
  document.body.classList.remove("no-scroll");
});

// También puedes permitir cerrar clickeando en el overlay
overlay.addEventListener("click", () => {
  btnRegresar.click();
});

    
}








document.addEventListener("DOMContentLoaded", () => {
    const detalleSeccion = document.getElementById("detalle-producto");
    const detalleNombre = document.getElementById("detalle-nombre");
    const detalleDescripcion = document.getElementById("detalle-descripcion");
    const detallePrecio = document.getElementById("detalle-precio");
    const detallePrecioOriginal = document.getElementById("detalle-precio-original");
    const detalleImagen = document.getElementById("imagen-grande");
    const detalleAhorro = document.getElementById("detalle-ahorro");
    const detallePorcentaje = document.getElementById("detalle-porcentaje");
    const btnRegresar = document.getElementById("btn-regresar");

    // Función para ver los detalles del producto
    window.verDetalle = function (id) {
        const prod = productos.find(p => p.id === id);
        if (!prod) return;

        // Limpiar miniaturas
        document.querySelector(".miniaturas").innerHTML = "";

        // Obtener imágenes
        const imagenes = prod.nombreimagenes?.split(",") || [];

        // Mostrar imagen principal
        if (imagenes.length > 0) {
            detalleImagen.src = imagenes[0].trim();
            detalleImagen.alt = prod.nombre;

            // Crear miniaturas
            imagenes.forEach((imagen, index) => {
                const miniatura = document.createElement("img");
                miniatura.src = imagen.trim();
                miniatura.alt = `${prod.nombre} miniatura ${index + 1}`;

                if (index === 0) miniatura.classList.add("activa");

                miniatura.addEventListener("click", () => {
                    detalleImagen.src = imagen.trim();

                    document.querySelectorAll(".miniaturas img").forEach(img => {
                        img.classList.remove("activa");
                    });

                    miniatura.classList.add("activa");
                });

                document.querySelector(".miniaturas").appendChild(miniatura);
            });
        }

        // Mostrar datos básicos
        detalleNombre.textContent = prod.nombre || "No disponible";
        detalleDescripcion.textContent = prod.descripcion || "Descripción no disponible";
        detallePrecio.textContent = `$${prod.precio || '0.00'}`;

        // Mostrar precio original y descuento solo si hay una oferta real
       // Mostrar precio actual (oferta si existe) y original tachado si aplica
if (prod.precioOferta && prod.precioOferta < prod.precio) {
    // Oferta activa
    detallePrecio.textContent = `$${prod.precioOferta}`; // Precio con descuento en azul
    detallePrecioOriginal.textContent = `$${prod.precio}`; // Precio original tachado
    detallePrecioOriginal.style.display = "inline";

    const ahorro = prod.precio - prod.precioOferta;
    detalleAhorro.textContent = `Ahorras $${ahorro.toFixed(2)}`;
    detalleAhorro.style.display = "inline";

    const porcentajeDescuento = (ahorro / prod.precio) * 100;
    const porcentajeRedondeado = Math.round(porcentajeDescuento);
    detallePorcentaje.textContent = `(${porcentajeRedondeado}%)`;
    detallePorcentaje.style.display = "inline";
} else {
    // Sin oferta
    detallePrecio.textContent = `$${prod.precio || '0.00'}`; // Precio normal
    detallePrecioOriginal.textContent = "";
    detallePrecioOriginal.style.display = "none";

    detalleAhorro.textContent = "";
    detalleAhorro.style.display = "none";

    detallePorcentaje.textContent = "";
    detallePorcentaje.style.display = "none";
}


        // Mostrar vista detalle
        document.querySelector(".contenido-principal").style.display = "none";
       
        detalleSeccion.classList.add("activo");
        detalleSeccion.style.display = "block";
    };

    // Renderiza productos al cargar
    renderTarjetas();
});










const modal = document.getElementById("modal-zoom");
const modalImg = document.getElementById("imagen-zoom");
const imgGrande = document.getElementById("imagen-grande");
const cerrar = document.querySelector(".cerrar");

imgGrande.addEventListener("click", () => {
    modalImg.src = imgGrande.src;
    modalImg.alt = imgGrande.alt;
    modal.style.display = "flex"; // ← usar correctamente la variable
});

cerrar.addEventListener("click", () => {
    modal.style.display = "none";
});

modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});












document.addEventListener("DOMContentLoaded", () => {
  renderCategorias();
  renderTarjetas();

  const params = new URLSearchParams(window.location.search);
  const categoriaParam = params.get("categoria");

  if (categoriaParam) {
    categoriaSeleccionada = categoriaParam;

    document.querySelectorAll("#lista-categorias li").forEach(el => {
      el.classList.remove("categoria-activa");
      if (el.dataset.id === categoriaParam) {
        el.classList.add("categoria-activa");
      }
    });

    aplicarFiltros();
  }

  document.getElementById("buscador").addEventListener("input", aplicarFiltros);
});
