// Variables globales
let ordenAscendentep = true;
let productosFiltradosGlobal = [];
let productosPorPagina = 5;
let paginaActualProductos = 1;
let productoEditando = null;
let productoAEliminar = null;

// Función para cargar el submenú de categorías
function cargarSubmenuCategorias() {
    const submenu = document.getElementById('submenu-categorias');
    submenu.innerHTML = '';

    categorias.forEach(categoria => {
        const li = document.createElement('li');
        li.classList.add('submenu-item');
        li.innerHTML = `
            <a href="#" onclick="mostrarProductosCategoria(${categoria.id}, '${categoria.nombre}')">
                ${categoria.nombre}
            </a>`;
        submenu.appendChild(li);
    });
}

// Mostrar productos por categoría
function mostrarProductosCategoria(idCategoria, nombreCategoria) {
    document.getElementById('categoria-titulo').textContent = nombreCategoria;
    const productosCategoria = productos.filter(p => p.categoriaId === idCategoria);
    productosFiltradosGlobal = [...productosCategoria];
    llenarTablaProductos(productosCategoria);
    paginaActualProductos = 1;
    llenarTablaProductosLLeno(productosCategoria);
}

// Ordenar por nombre
function ordenarPorNombre() {
    ordenAscendentep = !ordenAscendentep;
    productosFiltradosGlobal.sort((a, b) => ordenAscendentep ? 
        a.nombre.localeCompare(b.nombre) : 
        b.nombre.localeCompare(a.nombre));
    llenarTablaProductosLLeno();
}

// Llenar tabla de productos destacados con paginación
function llenarTablaProductosLLeno(lista = productosFiltradosGlobal) {
    const tbody = document.getElementById("tablaProductosDestacados");
    tbody.innerHTML = "";

    const totalPaginas = Math.ceil(lista.length / productosPorPagina);
    const inicio = (paginaActualProductos - 1) * productosPorPagina;
    const fin = inicio + productosPorPagina;
    const productosPagina = lista.slice(inicio, fin);

    productosPagina.forEach(producto => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${producto.id}</td>
            <td>${producto.nombre}</td>
            <td>${producto.descripcion}</td>
            <td>$${producto.precio.toFixed(2)}</td>
            <td>${producto.oferta ? 'Sí' : 'No'}</td>
            <td>${producto.oferta ? `$${producto.precioOferta.toFixed(2)}` : '-'}</td>
            <td>${producto.carpeta}</td>
            <td class="td-centrado">
                <textarea readonly class="form-control">${
                    Array.isArray(producto.nombreimagenes) ? 
                    producto.nombreimagenes.join(', ') : 
                    producto.nombreimagenes
                }</textarea>
            </td>
            <td>
                <button class="edit-btn-producto" onclick="editarProducto(${producto.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn-producto" onclick="abrirModalEliminarProducto(${producto.id})">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>`;
        tbody.appendChild(fila);
    });

    document.getElementById("paginaActualProductosLleno").textContent = `Página ${paginaActualProductos}`;
    document.getElementById("totalPaginasProductosLleno").textContent = `de ${totalPaginas}`;
}

// Llenar tabla de productos regular
function llenarTablaProductos(listaProductos = productos) {
    const tabla = document.getElementById('tablaProductos');
    tabla.innerHTML = '';

    listaProductos.forEach((producto) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="td-centrado">${producto.id}</td>
            <td>${producto.nombre}</td>
            <td>${producto.descripcion}</td>
            <td class="td-centrado">$${producto.precio.toFixed(2)}</td>
            <td class="td-centrado">${producto.oferta ? 'Sí' : 'No'}</td>
            <td class="td-centrado">${producto.oferta ? `$${producto.precioOferta.toFixed(2)}` : '-'}</td>
            <td>${producto.carpeta}</td>
            <td class="td-centrado">
                <textarea readonly class="form-control">${
                    Array.isArray(producto.nombreimagenes) ? 
                    producto.nombreimagenes.join(', ') : 
                    producto.nombreimagenes
                }</textarea>
            </td>
            <td class="td-centrado">
                <button class="edit-btn-producto" onclick="editarProducto(${producto.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn-producto" onclick="abrirModalEliminarProducto(${producto.id})">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>`;
        tabla.appendChild(tr);
    });
}

// Paginación
function cambiarPaginaProductosLleno(direccion) {
    const totalPaginas = Math.ceil(productosFiltradosGlobal.length / productosPorPagina);
    paginaActualProductos += direccion;
    
    if (paginaActualProductos < 1) paginaActualProductos = 1;
    if (paginaActualProductos > totalPaginas) paginaActualProductos = totalPaginas;
    
    llenarTablaProductosLLeno();
}

// Cambiar cantidad de productos por página
function cambiarCantidadProductos() {
    const selector = document.getElementById("selectorCantidadProductos");
    productosPorPagina = parseInt(selector.value);
    paginaActualProductos = 1;
    llenarTablaProductosLLeno();
}

// Filtros y búsqueda
function buscarProductos() {
    const busqueda = document.getElementById('buscadorProducto').value.toLowerCase();
    productosFiltradosGlobal = productos.filter(producto => 
        producto.nombre.toLowerCase().includes(busqueda) ||
        producto.descripcion.toLowerCase().includes(busqueda)
    );
    llenarTablaProductos(productosFiltradosGlobal);
    llenarTablaProductosLLeno();
}

function buscarProductosDestacados() {
    const busqueda = document.getElementById('buscadorProductoDestacados').value.toLowerCase();
    productosFiltradosGlobal = productos.filter(producto => 
        producto.nombre.toLowerCase().includes(busqueda) ||
        producto.descripcion.toLowerCase().includes(busqueda)
    );
    llenarTablaProductosLLeno();
}

function filtrarPorOferta() {
    const filtro = document.getElementById('filtroOferta').value;
    productosFiltradosGlobal = productos.filter(p => 
        filtro === 'todos' ? true :
        filtro === 'oferta' ? p.oferta : !p.oferta
    );
    llenarTablaProductos(productosFiltradosGlobal);
    llenarTablaProductosLLeno();
}

// Modales
function abrirModalAgregarProductos(tipo) {
    document.getElementById('Modal-Agregar-Producto').style.display = 'block';
}

function cerrarModalAgregarProducto() {
    document.getElementById('Modal-Agregar-Producto').style.display = 'none';
}

function editarProducto(id) {
    productoEditando = productos.find(p => p.id === id);
    if (productoEditando) {
        const galeria = document.getElementById('galeria-imagenes-editar');
        const urlsContainer = document.getElementById('urls-imagenes-editar');
        galeria.innerHTML = '';
        urlsContainer.innerHTML = '';

        // Rellenar datos básicos
        document.getElementById('editarProductoId').value = productoEditando.id;
        document.getElementById('editarNombreProducto').value = productoEditando.nombre;
        document.getElementById('editarDescripcionProducto').value = productoEditando.descripcion;
        document.getElementById('editarPrecioProducto').value = productoEditando.precio;
        document.getElementById('editarOfertaProducto').checked = productoEditando.oferta;
        document.getElementById('editarSelectCarpetas').value = productoEditando.carpeta;

        // Manejar ofertas
        if (productoEditando.oferta) {
            const descuento = ((productoEditando.precio - productoEditando.precioOferta) / productoEditando.precio * 100).toFixed(0);
            document.getElementById('editarDescuentoSeleccionado').value = descuento;
            document.getElementById('editarPrecioProductoDescuento').value = productoEditando.precioOferta.toFixed(2);
        }

        // Procesar imágenes
        const imagenes = Array.isArray(productoEditando.nombreimagenes) ? 
                        productoEditando.nombreimagenes : 
                        productoEditando.nombreimagenes.split(',').map(s => s.trim());
        
        imagenes.forEach(imagen => {
            if (!imagen) return;

            // Contenedor de imagen
            const imgContainer = document.createElement('div');
            imgContainer.className = 'imagen-container';
            
            // Elemento de imagen
            const img = document.createElement('img');
            img.src = imagen;
            img.className = 'miniatura-imagen';
            img.onerror = function() { 
                this.style.display = 'none'; 
            };
            
            // Badge con nombre de archivo
            const badge = document.createElement('div');
            badge.className = 'badge-imagen';
            let nombreArchivo = imagen;
            try {
                nombreArchivo = new URL(imagen).pathname.split('/').pop();
            } catch {
                nombreArchivo = imagen.split('/').pop();
            }
            badge.textContent = nombreArchivo;
            
            // Contenedor de URL
            const urlDiv = document.createElement('div');
            urlDiv.className = 'url-imagen';
            urlDiv.textContent = imagen;
            
            // Evento para copiar
            urlDiv.onclick = async function() {
                try {
                    await navigator.clipboard.writeText(imagen);
                    this.classList.add('copiado');
                    setTimeout(() => this.classList.remove('copiado'), 2000);
                } catch (err) {
                    const textarea = document.createElement('textarea');
                    textarea.value = imagen;
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                }
            };
            
            imgContainer.appendChild(img);
            imgContainer.appendChild(badge);
            galeria.appendChild(imgContainer);
            urlsContainer.appendChild(urlDiv);
        });

        document.getElementById('Modal-Editar-Producto').style.display = 'block';
        toggleCamposEdicionOferta();
    }
}

function toggleCamposEdicionOferta() {
    const ofertaCheckbox = document.getElementById('editarOfertaProducto');
    const descuentoInput = document.getElementById('editarDescuentoSeleccionado');
    const precioDescuentoInput = document.getElementById('editarPrecioProductoDescuento');
    
    ofertaCheckbox.addEventListener('change', () => {
        descuentoInput.disabled = !ofertaCheckbox.checked;
        precioDescuentoInput.disabled = !ofertaCheckbox.checked;
    });
    
    descuentoInput.disabled = !ofertaCheckbox.checked;
    precioDescuentoInput.disabled = !ofertaCheckbox.checked;
}

function cerrarModalEditarProducto() {
    document.getElementById('Modal-Editar-Producto').style.display = 'none';
}

function abrirModalEliminarProducto(id) {
    productoAEliminar = id;
    document.getElementById('modalEliminarProducto').style.display = 'block';
}

function cerrarModalEliminarProducto() {
    productoAEliminar = null;
    document.getElementById('modalEliminarProducto').style.display = 'none';
}

// CRUD de Productos
function guardarNuevoProducto() {
    cerrarModalAgregarProducto();
    llenarTablaProductosLLeno();
}

function guardarCambiosProducto() {
    if (!productoEditando) return;
    
    productoEditando.nombre = document.getElementById('editarNombreProducto').value;
    productoEditando.descripcion = document.getElementById('editarDescripcionProducto').value;
    productoEditando.precio = parseFloat(document.getElementById('editarPrecioProducto').value);
    productoEditando.oferta = document.getElementById('editarOfertaProducto').checked;
    productoEditando.carpeta = document.getElementById('editarSelectCarpetas').value;
    productoEditando.nombreimagenes = document.getElementById('editarTextareaImagenes').value.split(',').map(s => s.trim());
    
    if (productoEditando.oferta) {
        const descuento = parseFloat(document.getElementById('editarDescuentoSeleccionado').value);
        productoEditando.precioOferta = productoEditando.precio - (productoEditando.precio * (descuento / 100));
    } else {
        productoEditando.precioOferta = null;
    }
    
    llenarTablaProductos();
    llenarTablaProductosLLeno();
    cerrarModalEditarProducto();
}

function eliminarProductoConfirmado() {
    if (productoAEliminar !== null) {
        productos = productos.filter(p => p.id !== productoAEliminar);
        productosFiltradosGlobal = productosFiltradosGlobal.filter(p => p.id !== productoAEliminar);
        llenarTablaProductos();
        llenarTablaProductosLLeno();
        cerrarModalEliminarProducto();
    }
}

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
    productosFiltradosGlobal = [...productos];
    cargarSubmenuCategorias();
    llenarTablaProductosLLeno();
    llenarTablaProductos(productos);
    cambiarCantidadProductos();
});












// Función para calcular el descuento automáticamente
function configurarCalculoDescuento() {
    const precioInput = document.getElementById('editarPrecioProducto');
    const descuentoInput = document.getElementById('editarDescuentoSeleccionado');
    const precioDescuentoInput = document.getElementById('editarPrecioProductoDescuento');
    const ofertaCheckbox = document.getElementById('editarOfertaProducto');

    // Habilitar/deshabilitar campos
    ofertaCheckbox.addEventListener('change', () => {
        const estaActivo = ofertaCheckbox.checked;
        descuentoInput.disabled = !estaActivo;
        precioDescuentoInput.disabled = !estaActivo;
        
        if (!estaActivo) {
            descuentoInput.value = '';
            precioDescuentoInput.value = '';
        }
    });

    // Calcular precio con descuento cuando cambia el porcentaje
    descuentoInput.addEventListener('input', () => {
        const precio = parseFloat(precioInput.value);
        const descuento = parseFloat(descuentoInput.value);
        
        if (!isNaN(precio) && !isNaN(descuento)) {
            const precioConDescuento = precio - (precio * (descuento / 100));
            precioDescuentoInput.value = precioConDescuento.toFixed(2);
        }
    });

    // Calcular porcentaje cuando cambia el precio con descuento
    precioDescuentoInput.addEventListener('input', () => {
        const precio = parseFloat(precioInput.value);
        const precioDescuento = parseFloat(precioDescuentoInput.value);
        
        if (!isNaN(precio) && !isNaN(precioDescuento)) {
            const descuento = ((precio - precioDescuento) / precio * 100).toFixed(2);
            descuentoInput.value = descuento;
        }
    });

    // Actualizar al cambiar el precio original
    precioInput.addEventListener('input', () => {
        if (descuentoInput.value) {
            descuentoInput.dispatchEvent(new Event('input'));
        }
    });
}

// Función para validar los campos de descuento
function validarCamposDescuento() {
    let valido = true;
    const descuento = parseFloat(document.getElementById('editarDescuentoSeleccionado').value);
    const precioDescuento = parseFloat(document.getElementById('editarPrecioProductoDescuento').value);
    const precio = parseFloat(document.getElementById('editarPrecioProducto').value);

    // Resetear errores
    document.getElementById('errorEditarPrecioDescuentoProducto').textContent = '';

    if (descuento < 0 || descuento > 100) {
        document.getElementById('errorEditarPrecioDescuentoProducto').textContent = 'Descuento inválido (0-100%)';
        valido = false;
    }

    if (precioDescuento >= precio) {
        document.getElementById('errorEditarPrecioDescuentoProducto').textContent = 'El precio con descuento debe ser menor al original';
        valido = false;
    }

    return valido;
}

// En la función editarProducto, agregar al final:
document.getElementById('editarOfertaProducto').addEventListener('change', toggleCamposEdicionOferta);
document.getElementById('editarDescuentoSeleccionado').addEventListener('input', validarCamposDescuento);
document.getElementById('editarPrecioProductoDescuento').addEventListener('input', validarCamposDescuento);

// En el DOMContentLoaded inicializar:
document.addEventListener("DOMContentLoaded", () => {
    configurarCalculoDescuento();
});

// Configurar cálculo de descuento para agregar productos
function configurarCalculoDescuentoAgregar() {
    const precioInput = document.getElementById('precioProducto');
    const descuentoInput = document.getElementById('descuentoSeleccionado');
    const precioDescuentoInput = document.getElementById('precioProductoDescuento');
    const ofertaCheckbox = document.getElementById('ofertaProducto');

    // Habilitar/deshabilitar campos
    ofertaCheckbox.addEventListener('change', () => {
        const estaActivo = ofertaCheckbox.checked;
        descuentoInput.disabled = !estaActivo;
        precioDescuentoInput.disabled = !estaActivo;
        
        if (!estaActivo) {
            descuentoInput.value = '';
            precioDescuentoInput.value = '';
        }
    });

    // Calcular precio con descuento cuando cambia el porcentaje
    descuentoInput.addEventListener('input', () => {
        const precio = parseFloat(precioInput.value);
        const descuento = parseFloat(descuentoInput.value);
        
        if (!isNaN(precio) && !isNaN(descuento)) {
            const precioConDescuento = precio - (precio * (descuento / 100));
            precioDescuentoInput.value = precioConDescuento.toFixed(2);
        }
    });

    // Calcular porcentaje cuando cambia el precio con descuento
    precioDescuentoInput.addEventListener('input', () => {
        const precio = parseFloat(precioInput.value);
        const precioDescuento = parseFloat(precioDescuentoInput.value);
        
        if (!isNaN(precio) && !isNaN(precioDescuento)) {
            const descuento = ((precio - precioDescuento) / precio * 100).toFixed(2);
            descuentoInput.value = descuento;
        }
    });

    // Actualizar al cambiar el precio original
    precioInput.addEventListener('input', () => {
        if (descuentoInput.value) {
            descuentoInput.dispatchEvent(new Event('input'));
        }
    });
}

// Validación para formulario de agregar
function validarCamposDescuentoAgregar() {
    let valido = true;
    const descuento = parseFloat(document.getElementById('descuentoSeleccionado').value);
    const precioDescuento = parseFloat(document.getElementById('precioProductoDescuento').value);
    const precio = parseFloat(document.getElementById('precioProducto').value);

    // Resetear errores
    document.getElementById('errorPrecioDescuentoProducto').textContent = '';

    if (descuento < 0 || descuento > 100) {
        document.getElementById('errorPrecioDescuentoProducto').textContent = 'Descuento inválido (0-100%)';
        valido = false;
    }

    if (precioDescuento >= precio) {
        document.getElementById('errorPrecioDescuentoProducto').textContent = 'El precio con descuento debe ser menor al original';
        valido = false;
    }

    return valido;
}

// Actualizar la inicialización
document.addEventListener("DOMContentLoaded", () => {
    configurarCalculoDescuento(); // Para editar
    configurarCalculoDescuentoAgregar(); // Para agregar
});

// Función para sincronizar selects con inputs de carpeta
function configurarSelectoresCarpeta() {
    // Para el modal de agregar
    const selectAgregar = document.getElementById('select-carpetas');
    const inputAgregar = document.getElementById('nombre-carpeta');
    
    selectAgregar.addEventListener('change', function() {
        inputAgregar.value = this.value;
    });
    
    inputAgregar.addEventListener('input', function() {
        if(this.value !== selectAgregar.value) {
            selectAgregar.selectedIndex = 0;
        }
    });

    // Para el modal de editar
    const selectEditar = document.getElementById('editarSelectCarpetas');
    const inputEditar = document.getElementById('editarNombreCarpeta');
    
    selectEditar.addEventListener('change', function() {
        inputEditar.value = this.value;
    });
    
    inputEditar.addEventListener('input', function() {
        if(this.value !== selectEditar.value) {
            selectEditar.selectedIndex = 0;
        }
    });
}

// Modificar la función guardarNuevoProducto
function guardarNuevoProducto() {
    const nuevaCarpeta = document.getElementById('nombre-carpeta').value.trim();
    // ... resto de la lógica
    // Usar nuevaCarpeta para guardar
}

// Modificar la función guardarCambiosProducto
function guardarCambiosProducto() {
    const carpetaEditada = document.getElementById('editarNombreCarpeta').value.trim();
    // ... resto de la lógica
    // Usar carpetaEditada para actualizar
}

// Inicializar en DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
    configurarSelectoresCarpeta();
});

// Función para poblar el selector de categorías
function cargarFiltroCategorias() {
    const select = document.getElementById('filtroCategoria');
    select.innerHTML = '<option value="">Seleccionar Categoría</option>';
    
    categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria.id;
        option.textContent = categoria.nombre;
        select.appendChild(option);
    });
}

// Función de filtrado por categoría
function filtrarPorCategoria() {
    const categoriaId = parseInt(document.getElementById('filtroCategoria').value);
    
    if (categoriaId) {
        productosFiltradosGlobal = productos.filter(p => p.categoriaId === categoriaId);
    } else {
        productosFiltradosGlobal = [...productos];
    }
    
    // Actualizar ambas tablas
    llenarTablaProductos(productosFiltradosGlobal);
    llenarTablaProductosLLeno();
    
    // Reiniciar paginación
    paginaActualProductos = 1;
    actualizarPaginacion();
}

// Función para actualizar la paginación
function actualizarPaginacion() {
    document.getElementById("paginaActualProductosLleno").textContent = `Página ${paginaActualProductos}`;
    document.getElementById("totalPaginasProductosLleno").textContent = `de ${Math.ceil(productosFiltradosGlobal.length / productosPorPagina)}`;
}

// Modificar la inicialización
document.addEventListener("DOMContentLoaded", () => {
    cargarFiltroCategorias();
    // ... resto de la inicialización
});

// Actualizar función de búsqueda
function buscarProductosDestacados() {
    const busqueda = document.getElementById('buscadorProductoDestacados').value.toLowerCase();
    const categoriaId = parseInt(document.getElementById('filtroCategoria').value);
    
    productosFiltradosGlobal = productos.filter(producto => {
        const coincideBusqueda = producto.nombre.toLowerCase().includes(busqueda) ||
                                producto.descripcion.toLowerCase().includes(busqueda);
        const coincideCategoria = categoriaId ? producto.categoriaId === categoriaId : true;
        
        return coincideBusqueda && coincideCategoria;
    });
    
    llenarTablaProductosLLeno();
}

// Actualizar función de filtrado por ofertas
function filtrarPorOferta() {
    const filtro = document.getElementById('filtroOferta').value;
    const categoriaId = parseInt(document.getElementById('filtroCategoria').value);
    
    productosFiltradosGlobal = productos.filter(p => {
        const coincideOferta = filtro === 'todos' ? true :
                              filtro === 'oferta' ? p.oferta : !p.oferta;
        const coincideCategoria = categoriaId ? p.categoriaId === categoriaId : true;
        
        return coincideOferta && coincideCategoria;
    });
    
    llenarTablaProductos(productosFiltradosGlobal);
    llenarTablaProductosLLeno();
}