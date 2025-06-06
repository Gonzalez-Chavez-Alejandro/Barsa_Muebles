let paginaActualProductos = 1;
let cantidadPorPagina = 5;

// Llenar el <select> con opciones de categoría
function llenarSelectCategorias() {
  const select = document.getElementById("filtroCategoria");
  window.categorias.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat.nombre;
    option.textContent = cat.nombre;
    select.appendChild(option);
  });
}

function mostrarProductos() {
  const tbody = document.getElementById("tabla-productos");
  tbody.innerHTML = "";

  const inicio = (paginaActualProductos - 1) * cantidadPorPagina;
  const fin = inicio + cantidadPorPagina;
  const productosFiltrados = window.productosFiltrados || window.productos;
  const productosPagina = productosFiltrados.slice(inicio, fin);

  if (productosPagina.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="9" style="text-align:center;">No hay productos para esta categoría.</td>`;
    tbody.appendChild(tr);
    return;
  }

  // Inicializa el objeto si no existe
  window.imagenesProducto = {};

  productosPagina.forEach((producto) => {
    const imagenes = producto.nombreimagenes.split(',').map(img => img.trim());

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${producto.id}</td>
      <td>${producto.nombre}</td>
      <td>${producto.descripcion}</td>
      <td>${producto.precio}</td>
      <td>${producto.oferta ? "Sí" : "No"}</td>
      <td>${producto.precioOferta}</td>
      <td>
        <div class="img-carousel" id="carousel-${producto.id}">
          <button onclick="cambiarImagen(${producto.id}, -1)">◀</button>
          <img src="${imagenes[0]}" alt="imagen" width="80" height="80" id="img-${producto.id}">
          <button onclick="cambiarImagen(${producto.id}, 1)">▶</button>
        </div>
      </td>
      <td>
       <a href="/administrador_editar_producto/" class="btn-admin-desing-edit" onclick='editarProducto(${JSON.stringify(producto)})'>
          <i class="fas fa-edit"></i>
        </a>

      <button class="btn-admin-desing-delete" onclick="abrirModalEliminarProducto(${producto.id})">
        <i class="fas fa-trash-alt"></i>
      </button>

      </td>
    `;
    tbody.appendChild(tr);

    // Guardar imágenes e índice actual
    window.imagenesProducto[producto.id] = {
      imagenes: imagenes,
      index: 0
    };
  });

  // Actualizar paginación
  const totalPaginas = Math.ceil(productosFiltrados.length / cantidadPorPagina);
  document.getElementById("paginaActualProductosLleno").textContent = `Página ${paginaActualProductos}`;
  document.getElementById("totalPaginasProductosLleno").textContent = `${totalPaginas}`;
}


function cambiarImagen(id, direccion) {
  const data = window.imagenesProducto[id];
  if (!data) return;

  data.index += direccion;

  if (data.index < 0) {
    data.index = data.imagenes.length - 1;
  } else if (data.index >= data.imagenes.length) {
    data.index = 0;
  }

  const img = document.getElementById(`img-${id}`);
  img.src = data.imagenes[data.index];
}

function filtrarPorCategoria() {
  const categoria = document.getElementById("filtroCategoria").value;
  const categoriaId = parseInt(categoria);

  if (categoria === "") {
    window.productosFiltrados = window.productos;
  } else {
    window.productosFiltrados = window.productos.filter(p => p.categoriaId === categoriaId);
  }

  console.log("Productos filtrados:", window.productosFiltrados); // Debug
  paginaActualProductos = 1;
  mostrarProductos();
}
const select = document.getElementById("filtroCategoria");
window.categorias.forEach(cat => {
  const option = document.createElement("option");
  option.value = cat.id;
  option.textContent = cat.nombre;
  select.appendChild(option);
});



window.addEventListener("DOMContentLoaded", () => {
  window.productosFiltrados = window.productos;
  llenarSelectCategorias();
  mostrarProductos();
});


function buscarProductosDestacados() {
  const termino = document.getElementById("buscador").value.toLowerCase();
  const categoriaSeleccionada = document.getElementById("filtroCategoria").value;

  window.productosFiltrados = window.productos.filter(p => {
    const coincideCategoria = categoriaSeleccionada === "" || p.categoria.toLowerCase() === categoriaSeleccionada.toLowerCase();
    const coincideBusqueda = p.nombre.toLowerCase().includes(termino) || p.descripcion.toLowerCase().includes(termino);
    return coincideCategoria && coincideBusqueda;
  });

  paginaActualProductos = 1;
  mostrarProductos();
}

function cambiarCantidadProductos() {
  const selector = document.getElementById("selectorCantidadProductos");
  cantidadPorPagina = parseInt(selector.value, 10);
  paginaActualProductos = 1;
  mostrarProductos();
}

function cambiarPaginaProductosLleno(direccion) {
  const totalPaginas = Math.ceil((window.productosFiltrados || window.productos).length / cantidadPorPagina);
  paginaActualProductos += direccion;

  if (paginaActualProductos < 1) paginaActualProductos = 1;
  if (paginaActualProductos > totalPaginas) paginaActualProductos = totalPaginas;

  mostrarProductos();
}
function buscarProductos() {
  const input = document.getElementById("buscador-productos").value.toLowerCase();
  const categoriaSeleccionada = document.getElementById("filtroCategoria").value;

  window.productosFiltrados = window.productos.filter(p => {
    const coincideBusqueda = p.nombre.toLowerCase().includes(input) || p.descripcion.toLowerCase().includes(input);
    const coincideCategoria = categoriaSeleccionada === "" || p.categoriaId == categoriaSeleccionada;
    return coincideBusqueda && coincideCategoria;
  });

  paginaActualProductos = 1;
  mostrarProductos();
}

let productoAEliminar = null;

function abrirModalEliminarProducto(idProducto) {
  productoAEliminar = idProducto;
  document.getElementById('modalEliminarProducto').style.display = 'block';
}

function cerrarModalEliminarProducto() {
  productoAEliminar = null;
  document.getElementById('modalEliminarProducto').style.display = 'none';
}

function eliminarProductoConfirmado() {
  if (productoAEliminar !== null) {
    // Eliminar del DOM
    const fila = document.querySelector(`#fila-producto-${productoAEliminar}`);
    if (fila) fila.remove();

    // Cierra el modal
    cerrarModalEliminarProducto();

    // Limpia la variable
    productoAEliminar = null;
  }
}

