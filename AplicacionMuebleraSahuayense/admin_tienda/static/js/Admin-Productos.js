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

async function mostrarProductos() {
  const token = localStorage.getItem("access_token");

  if (!token) {
    alert("No estás autenticado");
    return;
  }

  //tbody.innerHTML = "";

  try {
    const response = await fetch("http://127.0.0.1:8000/productos/Listar/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error en la solicitud");
    }

    const productos = await response.json();

    console.log("[DEBUG] Productos recibidos:", productos);
    mostrarProductosView(productos)
    /*if (!productos.length) {
      tbody.innerHTML = `
        <tr><td colspan="8" style="text-align:center;">No hay productos disponibles.</td></tr>
      `;
      return;
    }

    productos.forEach(producto => {
      const imagen = normalizeImageUrl(producto.imageFurniture || "");

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${producto.categoryID || ''}</td>
        <td>${producto.nameFurniture || ''}</td>
        <td>${producto.descriptionFurniture || ''}</td>
        <td>${producto.porcentajeDescuento || 0}%</td>
        
        <td>${producto.stateFurniture ? 'Activo' : 'Inactivo'}</td>
        <td>
          <img src="${imagen}" 
               alt="Imagen producto" 
               width="80" 
               height="80"
               onerror="this.src='https://via.placeholder.com/80'">
        </td>
        <td>
          <button class="btn-admin-desing-edit" 
                  onclick='editarProducto(${JSON.stringify(producto)})'>
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn-admin-desing-delete" 
                  onclick="abrirModalEliminarProducto(${producto.id})">
            <i class="fas fa-trash-alt"></i>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });*/
  } catch (err) {
    console.error("Error al cargar productos:", err);
    alert("Error al cargar productos: " + err.message);
  }
}

function mostrarProductosView(productos) {
    const tbody = document.getElementById("tabla-productos");
    if (!productos.length) {
      tbody.innerHTML = `
        <tr><td colspan="8" style="text-align:center;">No hay productos disponibles.</td></tr>
      `;
      return;
    }

    productos.forEach(producto => {
      const imagen = normalizeImageUrl(productos.imageFurniture||"https://res.cloudinary.com/dacrpsl5p/image/upload/v1746330867/CARPETA1/Disney%20Universe%2012_22_2024%204_18_43%20PM.png");

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${producto.categoryID || ''}</td>
        <td>${producto.nameFurniture || ''}</td>
        <td>${producto.descriptionFurniture || ''}</td>
        <td>$${Number(producto.priceFurniture).toFixed(2) || '0.00'}</td>
        <td>${producto.porcentajeDescuento || 0}%</td>
        <td>$${Number(producto.PrecioOferta).toFixed(2) || '0.00'}</td>
        
        <td>${producto.stateFurniture ? 'Activo' : 'Inactivo'}</td>
        <td>
          <img src="${imagen}" 
               alt="Imagen producto" 
               width="80" 
               height="80"
               onerror="this.src='https://via.placeholder.com/80'">
        </td>
        <td>
          <button class="btn-admin-desing-edit" 
                  onclick='editarProducto(${JSON.stringify(producto)})'>
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn-admin-desing-delete" 
                  onclick="abrirModalEliminarProducto(${producto.id})">
            <i class="fas fa-trash-alt"></i>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
}

// Inicialización cuando el DOM está listo
document.addEventListener("DOMContentLoaded", () => {
  mostrarProductos()
});

/*








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

*/