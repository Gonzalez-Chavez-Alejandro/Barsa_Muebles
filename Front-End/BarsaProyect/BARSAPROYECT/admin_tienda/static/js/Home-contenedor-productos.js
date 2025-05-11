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
        const precio = p.oferta
            ? `<span class="oferta">$${p.precioOferta}</span> <del>$${p.precio}</del>`
            : `<span class="oferta">$${p.precio}</span> <span class="tachado">$${p.precioOriginal}</span>`;

        div.innerHTML = `
            <img src="${imagen}" alt="${p.nombre}">
            <div class="contenido">
                <div class="nombre">${p.nombre}</div>
                <div class="descripcion">${p.descripcion}</div>
                <div class="precio">${precio}</div>
                <button onclick="verDetalle(${p.id})">Ver más</button>
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
}










document.addEventListener("DOMContentLoaded", () => {
    const contenedorProductos = document.getElementById("contenedor-productos");
    const detalleSeccion = document.getElementById("detalle-producto");
    const btnRegresar = document.getElementById("btn-regresar");

    // Elementos de detalle
    const detalleImagenes = document.getElementById("detalle-imagenes");
    const detalleNombre = document.getElementById("detalle-nombre");
    const detalleDescripcion = document.getElementById("detalle-descripcion");
    const detallePrecio = document.getElementById("detalle-precio");
    const detallePrecioOriginal = document.getElementById("detalle-precio-original");

    window.verDetalle = function (id) {
        const prod = productos.find(p => p.id === id);
        if (!prod) return;

        // Limpiar las galerías
        document.querySelector(".miniaturas").innerHTML = "";

        // Obtener todas las imágenes del producto
        const imagenes = prod.nombreimagenes?.split(",") || [];

        // Si hay imágenes, mostrar la primera como principal
        if (imagenes.length > 0) {
            const imagenPrincipal = document.getElementById("imagen-grande");
            imagenPrincipal.src = imagenes[0].trim();
            imagenPrincipal.alt = prod.nombre;

            // Crear miniaturas para todas las imágenes
            imagenes.forEach((imagen, index) => {
                const miniatura = document.createElement("img");
                miniatura.src = imagen.trim();
                miniatura.alt = prod.nombre + " miniatura " + (index + 1);

                // Marcar la primera miniatura como activa
                if (index === 0) {
                    miniatura.classList.add("activa");
                }

                // Agregar evento para cambiar la imagen principal al hacer clic
                miniatura.addEventListener("click", () => {
                    imagenPrincipal.src = imagen.trim();

                    // Remover clase activa de todas las miniaturas
                    document.querySelectorAll(".miniaturas img").forEach(img => {
                        img.classList.remove("activa");
                    });

                    // Agregar clase activa a la miniatura clickeada
                    miniatura.classList.add("activa");
                });

                document.querySelector(".miniaturas").appendChild(miniatura);
            });
        }

        // Actualizar la información del producto
        detalleNombre.textContent = prod.nombre;
        detalleDescripcion.textContent = prod.descripcion;
        detallePrecio.textContent = `$${prod.precio}`;
        detallePrecioOriginal.textContent = `$${prod.precioOferta || prod.precio}`;

        // Mostrar la sección de detalle
        document.querySelector(".contenido-principal").style.display = "none";
        detalleSeccion.classList.add("activo");
    };

    btnRegresar.addEventListener("click", () => {
        detalleSeccion.classList.remove("activo");
        document.querySelector(".contenido-principal").style.display = "block";
    });

    // Llamar a renderTarjetas() aquí si quieres cargar productos
    renderTarjetas();
});










