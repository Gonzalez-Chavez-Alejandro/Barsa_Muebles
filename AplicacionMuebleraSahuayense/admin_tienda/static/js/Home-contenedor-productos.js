let productos = [];
let categorias = [];
let categoriaSeleccionada = "all";

document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Cargar productos desde la API
        const responseProductos = await fetch("/productos/publicos/");
        const dataProductos = await responseProductos.json();

        productos = dataProductos.map(p => {
            const imagenes = p.imageFurniture ? p.imageFurniture.split(",") : [];
            return {
                id: p.id,
                nombre: p.nameFurniture,
                descripcion: p.descriptionFurniture,
                precio: p.priceFurniture,
                precioOferta: p.PrecioOferta,
                descuento: p.porcentajeDescuento,
                nombreimagenes: p.imageFurniture,
                imagen: imagenes[0] || "https://via.placeholder.com/300x180",
                oferta: p.porcentajeDescuento > 0,
                categoriaId: p.categoryID[0] || null,
                categoriasNombres: p.categorias_nombres,
            };
        });

        // Cargar categorías desde la API
        const responseCategorias = await fetch("/categorias/publicas/");
        const dataCategorias = await responseCategorias.json();

        categorias = dataCategorias.map(c => ({
            id: c.id,
            nombre: c.nameCategory
        }));

        renderCategorias();
        renderTarjetas();

    } catch (error) {
        console.error("Error al cargar productos o categorías:", error);
        document.getElementById("contenedor-productos").innerHTML = "<p>Error al cargar productos.</p>";
    }

    // Activar filtro por búsqueda
    document.getElementById("buscador").addEventListener("input", aplicarFiltros);

    // Botón "todas las categorías"
    const botonTodas = document.querySelector("[data-id='all']");
    if (botonTodas) {
        botonTodas.onclick = () => {
            categoriaSeleccionada = "all";
            document.querySelectorAll("#lista-categorias li").forEach(el => el.classList.remove("categoria-activa"));
            botonTodas.classList.add("categoria-activa");
            aplicarFiltros();
        };
    }
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
        const precio = Number(p.precio);
        const precioOferta = Number(p.precioOferta);
        const precioInvalido = isNaN(precio) || precio <= 0;

        let precioHTML = "";
        let descuento = 0;
        let ahorro = 0;

        if (p.oferta && !isNaN(precioOferta) && precioOferta > 0) {
            precioHTML = `<span class="oferta">$${precioOferta}</span> <del>$${precio}</del>`;
            descuento = Math.round(((precio - precioOferta) / precio) * 100);
            ahorro = precio - precioOferta;
        } else if (precioInvalido) {
            precioHTML = `<span class="contactar">Póngase en contacto</span>`;
        } else {
            precioHTML = `<span class="oferta">$${precio}</span>`;
        }

        div.innerHTML = `
            ${descuento > 0 ? `<div class="descuento">${descuento}%</div>` : ''}
            <img src="${imagen}" alt="${p.nombre}">
            <div class="contenido">
                <h2 class="nombre">${p.nombre}</h2>
                <p class="descripcion">${p.descripcion}</p>
                <div class="precio">${precioHTML}</div>
                <div class="ahorro-boton">
                    ${descuento > 0 ? `<div class="ahorro">Ahorras $${ahorro.toFixed(2)}</div>` : ''}
                    
                    <button class="btn-carrito" onclick="enviarpagina(${p.id})">Ver Producto</button>
                </div>
            </div>
        `;

        contenedor.appendChild(div);
    });
}

function renderCategorias() {
    const listaCat = document.getElementById("lista-categorias");
    if (!listaCat) return;

    listaCat.innerHTML = "";

    // Agregar opción "Todas"
    const liAll = document.createElement("li");
    liAll.textContent = "Todas";
    liAll.dataset.id = "all";
    liAll.classList.add("categoria-activa");
    listaCat.appendChild(liAll);

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

    const lista = productos.filter(p => {
        const coincideBusqueda =
            p.nombre.toLowerCase().includes(termino) ||
            p.descripcion.toLowerCase().includes(termino);

        const coincideCategoria = categoriaSeleccionada === "all" || p.categoriaId == categoriaSeleccionada;

        return coincideBusqueda && coincideCategoria;
    });

    renderTarjetas(lista);
}

function enviarpagina(id) {
    const producto = productos.find(p => p.id === id);
    if (producto) {
        localStorage.setItem("producto_seleccionado", JSON.stringify(producto));
        window.location.href = `/productos_vista/?producto_id=${id}`;
    }
}

/*

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

        const precio = Number(p.precio);
        const precioOferta = Number(p.precioOferta);
        const precioInvalido = isNaN(precio) || precio <= 0;

        if (p.oferta && !isNaN(precioOferta) && precioOferta > 0) {
            precioHTML = `<span class="oferta">$${precioOferta}</span> <del>$${precio}</del>`;
            descuento = Math.round(((precio - precioOferta) / precio) * 100);
            ahorro = precio - precioOferta;
        } else if (precioInvalido) {
            precioHTML = `<span class="contactar">Pongase en contacto</span>`;
        } else {
            precioHTML = `<span class="oferta">$${precio}</span>`;
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
                    <button class="btn-carrito" onclick="enviarpagina(${p.id})">Ver producto</button>
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

    window.verDetalle = function (id) {
        const prod = productos.find(p => p.id === id);
        if (!prod) return;
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
 
const detalleSeccion = document.getElementById("detalle-producto");
const detalleNombre = document.getElementById("detalle-nombre");
const detalleDescripcion = document.getElementById("detalle-descripcion");
const detallePrecio = document.getElementById("detalle-precio");
const detallePrecioOriginal = document.getElementById("detalle-precio-original");
const detalleImagen = document.getElementById("imagen-grande");
const detalleAhorro = document.getElementById("detalle-ahorro");
const detallePorcentaje = document.getElementById("detalle-porcentaje");
const btnRegresar = document.getElementById("btn-regresar");

document.addEventListener("DOMContentLoaded", () => {


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



*/

















