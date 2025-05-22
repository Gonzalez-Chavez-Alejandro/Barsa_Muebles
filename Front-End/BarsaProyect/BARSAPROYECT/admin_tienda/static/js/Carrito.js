
document.addEventListener("DOMContentLoaded", () => { 
   
    // Cargar carrito desde localStorage
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Elementos del DOM
    const carritoContainer = document.getElementById("carrito");
    const listaCarrito = document.getElementById("lista-carrito");
    const totalPrecio = document.getElementById("total-precio");
    const btnVaciar = document.getElementById("vaciar-carrito");
    const btnCerrar = document.getElementById("cerrar-carrito");
    const btnAgregar = document.getElementById("agregar-carrito-detalle");
    const btnToggleCarrito = document.querySelector(".btn-carrito");

    // Guardar en localStorage
    const guardarCarrito = () => {
        localStorage.setItem("carrito", JSON.stringify(carrito));
    };

    // Calcular total
    const calcularTotal = () => {
        return carrito.reduce((total, p) => total + (p.precio * p.cantidad), 0);
    };

    // Agregar producto
    const agregarAlCarrito = (producto) => {
        const existente = carrito.find(p => p.nombre === producto.nombre);
        if (existente) {
            existente.cantidad += 1;
        } else {
            carrito.push({ ...producto, cantidad: 1 });
        }
        guardarCarrito();
        actualizarCarritoUI();
    };

    // Quitar uno
    const quitarUnoDelCarrito = (nombreProducto) => {
        const index = carrito.findIndex(p => p.nombre === nombreProducto);
        if (index !== -1) {
            if (carrito[index].cantidad > 1) {
                carrito[index].cantidad -= 1;
            } else {
                carrito.splice(index, 1);
            }
            guardarCarrito();
            actualizarCarritoUI();
        }
    };

    // Vaciar carrito
    const vaciarCarrito = () => {
        carrito = [];
        guardarCarrito();
        actualizarCarritoUI();
    };

    // Actualizar UI
    const actualizarCarritoUI = () => {
        listaCarrito.innerHTML = "";
        const resumen = {};

        carrito.forEach(p => {
            if (resumen[p.nombre]) {
                resumen[p.nombre].cantidad += p.cantidad;
            } else {
                resumen[p.nombre] = { ...p };
            }
        });

        Object.values(resumen).forEach(p => {
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

            const controles = document.createElement("div");
            controles.style.display = "flex";
            controles.style.gap = "5px";

            const btnMenos = document.createElement("button");
            btnMenos.textContent = "–";
            btnMenos.classList.add("btn-control");
            btnMenos.addEventListener("click", (e) => {
                e.stopPropagation();
                quitarUnoDelCarrito(p.nombre);
            });

            const spanCantidad = document.createElement("span");
            spanCantidad.textContent = p.cantidad;
            spanCantidad.classList.add("cantidad");

            const btnMas = document.createElement("button");
            btnMas.textContent = "+";
            btnMas.classList.add("btn-control");
            btnMas.addEventListener("click", (e) => {
                e.stopPropagation();
                agregarAlCarrito(p);
            });

            controles.appendChild(btnMenos);
            controles.appendChild(spanCantidad);
            controles.appendChild(btnMas);

            info.appendChild(nombre);
            info.appendChild(precio);
            info.appendChild(controles);

            card.appendChild(img);
            card.appendChild(info);
            listaCarrito.appendChild(card);
        });

        totalPrecio.textContent = calcularTotal().toFixed(2);
    };

    // Agregar desde detalle
    if (btnAgregar) {
        btnAgregar.addEventListener("click", (e) => {
            e.stopPropagation();
            const nombreElem = document.getElementById("detalle-nombre");
            const precioElem = document.getElementById("detalle-precio");
            const precioOriginalElem = document.getElementById("detalle-precio-original");

            if (!nombreElem || !precioElem || !precioOriginalElem) {
                alert("Faltan elementos del producto.");
                return;
            }

            const nombre = nombreElem.textContent.trim();
            let precioTexto = precioElem.textContent.trim();
            let precio = parseFloat(precioTexto.replace(/[^0-9.]/g, ""));

            if (isNaN(precio) || precioTexto === "") {
                const originalTexto = precioOriginalElem.textContent.trim();
                precio = parseFloat(originalTexto.replace(/[^0-9.]/g, ""));
            }

            let imagen = "";
            if (window.productos && Array.isArray(window.productos)) {
                const prod = window.productos.find(p => p.nombre === nombre);
                imagen = prod?.nombreimagenes || "";
            }

            if (nombre && !isNaN(precio)) {
                const producto = { nombre, precio, imagen };
                agregarAlCarrito(producto);
                carritoContainer.style.display = "block";
            } else {
                alert("Datos inválidos del producto.");
            }
        });
    }

    // Botón vaciar
    if (btnVaciar) {
        btnVaciar.addEventListener("click", vaciarCarrito);
    }

    // Botón cerrar
    if (btnCerrar) {
        btnCerrar.addEventListener("click", () => {
            carritoContainer.style.display = "none";
        });
    }

    // Toggle con botón carrito
    if (btnToggleCarrito) {
        btnToggleCarrito.addEventListener("click", (e) => {
            e.stopPropagation();
            carritoContainer.style.display = carritoContainer.style.display === "block" ? "none" : "block";
        });
    }

    // Evitar cierre del carrito al hacer clic dentro
    carritoContainer.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    // Cerrar si se hace clic fuera
    document.addEventListener("click", (e) => {
        if (
            !carritoContainer.contains(e.target) && 
            !btnToggleCarrito.contains(e.target) &&
            carritoContainer.style.display === "block"
        ) {
            carritoContainer.style.display = "none";
        }
    });

    // Cargar al inicio
    actualizarCarritoUI();
});

