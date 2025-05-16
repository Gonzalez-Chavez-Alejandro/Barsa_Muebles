document.addEventListener("DOMContentLoaded", () => {
    if (typeof carrito === "undefined") {
        var carrito = [];
    }

    window.toggleMenu = function () {
        const carritoContainer = document.getElementById("carrito");
        carritoContainer.style.display =
            carritoContainer.style.display === "none" ? "block" : "none";
    };

    function agregarAlCarrito(producto) {
        carrito.push(producto);
        actualizarCarrito();
    }

    function vaciarCarrito() {
        carrito = [];
        actualizarCarrito();
    }

    function calcularTotal() {
        return carrito.reduce((total, producto) => total + producto.precio, 0);
    }

    function actualizarCarrito() {
        const lista = document.getElementById("lista-carrito");
        const total = document.getElementById("total-precio");

        lista.innerHTML = "";

        const resumen = {};

        carrito.forEach(producto => {
            if (resumen[producto.nombre]) {
                resumen[producto.nombre].cantidad += 1;
            } else {
                resumen[producto.nombre] = { ...producto, cantidad: 1 };
            }
        });

        Object.values(resumen).forEach(producto => {
            const card = document.createElement("div");
            card.style.border = "1px solid #ccc";
            card.style.borderRadius = "8px";
            card.style.padding = "10px";
            card.style.marginBottom = "10px";
            card.style.display = "flex";
            card.style.alignItems = "center";
            card.style.gap = "10px";

            const img = document.createElement("img");
            const imgUrl = producto.imagen
                ? producto.imagen.split(",")[0]
                : "https://via.placeholder.com/100";

            img.src = imgUrl;
            img.alt = producto.nombre;
            img.style.width = "80px";
            img.style.height = "80px";
            img.style.objectFit = "cover";

            const info = document.createElement("div");
            const nombre = document.createElement("p");
            nombre.textContent = producto.nombre;
            nombre.style.fontWeight = "bold";

            const precio = document.createElement("p");
            precio.textContent = `$${producto.precio.toFixed(2)} x ${producto.cantidad}`;

            const controlesDiv = document.createElement("div");
            controlesDiv.classList.add("carrito-botones");
            controlesDiv.style.display = "flex";
            controlesDiv.style.alignItems = "center";
            controlesDiv.style.gap = "5px";
            controlesDiv.style.marginTop = "5px";

            const btnMenos = document.createElement("button");
            btnMenos.textContent = "–";
            btnMenos.style.padding = "2px 6px";
            btnMenos.addEventListener("click", (e) => {
                e.stopPropagation();
                quitarUnoDelCarrito(producto.nombre);
            });

            const cantidad = document.createElement("span");
            cantidad.textContent = producto.cantidad;

            const btnMas = document.createElement("button");
            btnMas.textContent = "+";
            btnMas.style.padding = "2px 6px";
            btnMas.addEventListener("click", (e) => {
                e.stopPropagation();
                agregarAlCarrito(producto);
            });

            controlesDiv.appendChild(btnMenos);
            controlesDiv.appendChild(cantidad);
            controlesDiv.appendChild(btnMas);

            info.appendChild(nombre);
            info.appendChild(precio);
            info.appendChild(controlesDiv);

            card.appendChild(img);
            card.appendChild(info);
            lista.appendChild(card);
        });

        total.textContent = calcularTotal().toFixed(2);
    }

    function quitarUnoDelCarrito(nombreProducto) {
        const index = carrito.findIndex(p => p.nombre === nombreProducto);
        if (index !== -1) {
            carrito.splice(index, 1);
            actualizarCarrito();
        }
    }

    const btnAgregar = document.getElementById("agregar-carrito-detalle");
    const btnVaciar = document.getElementById("vaciar-carrito");
    const btnCerrar = document.getElementById("cerrar-carrito");
    const btnToggleCarrito = document.querySelector(".btn-carrito");

    btnAgregar.addEventListener("click", (e) => {
        e.stopPropagation();

        const nombre = document.getElementById("detalle-nombre").textContent.trim();
        let precioTexto = document.getElementById("detalle-precio").textContent.trim();
        let precio = parseFloat(precioTexto.replace("$", "").replace(",", ""));

        if (isNaN(precio) || precioTexto === "") {
            const originalTexto = document.getElementById("detalle-precio-original").textContent.trim();
            precio = parseFloat(originalTexto.replace("$", "").replace(",", ""));
        }

        let imagen = "";
        if (window.productos && Array.isArray(window.productos)) {
            const productoData = window.productos.find(p => p.nombre === nombre);
            imagen = productoData?.nombreimagenes || "";
        }

        if (nombre && !isNaN(precio)) {
            const producto = { nombre, precio, imagen };
            agregarAlCarrito(producto);

            document.getElementById("carrito").style.display = "block";
        } else {
            alert("Error al obtener los datos del producto.");
        }
    });

    btnVaciar.addEventListener("click", vaciarCarrito);

    btnCerrar.addEventListener("click", () => {
        document.getElementById("carrito").style.display = "none";
    });

    [btnAgregar, btnToggleCarrito].forEach(boton => {
        boton.addEventListener("click", (e) => e.stopPropagation());
    });

    document.addEventListener("click", (event) => {
        const carritoContainer = document.getElementById("carrito");

        if (
            carritoContainer.style.display === "block" &&
            !carritoContainer.contains(event.target) &&
            !btnAgregar.contains(event.target) &&
            !btnToggleCarrito.contains(event.target)
        ) {
            carritoContainer.style.display = "none";
        }
    });
});
