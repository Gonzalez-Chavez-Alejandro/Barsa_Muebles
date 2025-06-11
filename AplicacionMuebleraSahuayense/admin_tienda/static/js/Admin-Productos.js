let paginaActualProductos = 1;
let cantidadPorPagina = 5;
let productosGlobal = [];
let productosFiltrados = [];
let modoFiltrado = false;

// Mostrar productos con autenticación
async function mostrarProductos() {
  const token = localStorage.getItem("access_token");
  if (!token) {
    alert("No estás autenticado");
    return;
  }

  try {
    const response = await fetch("/productos/Listar/", {
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
    productosGlobal = productos;
    console.log("[DEBUG] Productos recibidos:", productos);
    mostrarProductosView();

  } catch (err) {
    console.error("Error al cargar productos:", err);
    alert("Error al cargar productos: " + err.message);
  }
}

// Crear HTML del carrusel de imágenes
function crearCarruselImagenes(urls, id) {
  if (!urls.length) {
    return `<img src="https://via.placeholder.com/80" alt="Sin imagen" width="80" height="80">`;
  }

  const safeId = `producto-${id}`;
  const imgId = `${safeId}-img`;
  const prevId = `${safeId}-prev`;
  const nextId = `${safeId}-next`;
  const primeraImagen = urls[0].trim();

  setTimeout(() => inicializarCarrusel(urls, imgId, prevId, nextId), 0);

  return `
    <div style="display: flex; align-items: center; gap: 5px;">
      <button id="${prevId}" style="cursor:pointer;">◀</button>
      <img id="${imgId}" src="${primeraImagen}" width="80" height="80" 
           style="border:1px solid #ccc;" 
           onerror="this.src='https://via.placeholder.com/80'">
      <button id="${nextId}" style="cursor:pointer;">▶</button>
    </div>
  `;
}

function inicializarCarrusel(imagenes, imgId, prevBtnId, nextBtnId) {
  let index = 0;
  const imgEl = document.getElementById(imgId);
  const prev = document.getElementById(prevBtnId);
  const next = document.getElementById(nextBtnId);

  if (!imgEl || !prev || !next) return;

  prev.addEventListener("click", () => {
    index = (index - 1 + imagenes.length) % imagenes.length;
    imgEl.src = imagenes[index].trim();
  });

  next.addEventListener("click", () => {
    index = (index + 1) % imagenes.length;
    imgEl.src = imagenes[index].trim();
  });
}

function mostrarProductosView() {
  const tbody = document.getElementById("tabla-productos");
  tbody.innerHTML = "";

  const productos = modoFiltrado ? productosFiltrados : productosGlobal;

  if (!productos.length) {
    tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;">${modoFiltrado ? 'No se encontraron productos.' : 'No hay productos disponibles.'}</td></tr>`;
    actualizarControlesPaginacion(0);
    return;
  }

  const inicio = (paginaActualProductos - 1) * cantidadPorPagina;
  const fin = inicio + cantidadPorPagina;
  const productosPagina = productos.slice(inicio, fin);

  productosPagina.forEach(producto => {
    const imagenes = producto.imageFurniture ? producto.imageFurniture.split(",") : [];
    const imagenesHTML = crearCarruselImagenes(imagenes, producto.id);

    const categoriasNombres = Array.isArray(producto.categorias_nombres)
  ? producto.categorias_nombres.join(", ")
  : "";



    const tr = document.createElement("tr");
    tr.innerHTML =
      `<td>${producto.id || ''}</td>
      <td>${producto.stateFurniture ? 'Activo' : 'Inactivo'}</td>
       <td>${producto.nameFurniture || ''}</td>
       <td>${producto.descriptionFurniture || ''}</td>
       <td>$${Number(producto.priceFurniture).toFixed(2)}</td>
       <td>${producto.porcentajeDescuento || 0}%</td>
      <td>$${producto.PrecioOferta && !isNaN(producto.PrecioOferta) ? Number(producto.PrecioOferta).toFixed(2) : Number(producto.priceFurniture).toFixed(2)}</td>
       <td>${imagenesHTML}</td>
       <td>${categoriasNombres}</td>
       <td>
        <a href="/editar-producto/${producto.id}/" class="btn-admin-desing-edit-productos">

          <i class="fas fa-edit"></i>
        </a>
         <button class="btn-admin-desing-delete-productos" onclick="abrirModalEliminarProducto(${producto.id})">
           <i class="fas fa-trash-alt"></i>
         </button>
       </td>`;
    tbody.appendChild(tr);
  });

  const totalPaginas = Math.ceil(productos.length / cantidadPorPagina);
  actualizarControlesPaginacion(totalPaginas);
}


function obtenerNombresCategorias(ids) {
  if (!Array.isArray(ids)) return "";
  return ids.map(id => {
    const cat = window.categorias.find(c => c.id === id);
    return cat ? cat.nameCategory : id;
  }).join(", ");
}

function actualizarControlesPaginacion(totalPaginas = 0) {
  const btnAnterior = document.getElementById("btnAnteriorProductos");
  const btnSiguiente = document.getElementById("btnSiguienteProductos");
  const paginaActualElement = document.getElementById("paginaActualProductos");
  const totalPaginasElement = document.getElementById("totalPaginas");

  paginaActualElement.textContent = paginaActualProductos;
  totalPaginasElement.textContent = totalPaginas;

  btnAnterior.disabled = paginaActualProductos <= 1;
  btnSiguiente.disabled = paginaActualProductos >= totalPaginas;
}

async function cargarCategoriasProductos() {
  const token = localStorage.getItem("access_token");
  if (!token) {
    alert("No estás autenticado");
    return;
  }

  try {
    const response = await fetch("/categorias/consulta/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const categorias = await response.json();
    console.log("[DEBUG] Categorías recibidas:", categorias);

    window.categorias = categorias;
    llenarSelectCategorias();

  } catch (err) {
    console.error("Error al cargar categorías:", err);
    alert("Error al cargar categorías: " + err.message);
  }
}

function llenarSelectCategorias() {
  const select = document.getElementById('filtroCategoriasView');
  if (!select) return;

  select.innerHTML = '<option value="">Todas las categorías</option>';

  window.categorias.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat.id;
    option.textContent = cat.nameCategory;
    select.appendChild(option);
  });
}

function filtrarPorCategoria() {
  const select = document.getElementById("filtroCategoriasView");
  if (!select) return;

  const categoriaId = select.value;

  if (!categoriaId) {
    modoFiltrado = false;
    paginaActualProductos = 1;
    mostrarProductosView();
    return;
  }

  const categoria = window.categorias.find(cat => String(cat.id) === categoriaId);
  if (!categoria) {
    modoFiltrado = false;
    mostrarProductosView();
    return;
  }

  productosFiltrados = productosGlobal.filter(producto => {
  return producto.categoryID.includes(Number(categoria.id));
});


  modoFiltrado = true;
  paginaActualProductos = 1;
  mostrarProductosView();
}

function buscarProductos() {
  const input = document.getElementById("buscador-productos").value.toLowerCase().trim();

  if (input === "") {
    modoFiltrado = false;
    paginaActualProductos = 1;
    mostrarProductosView();
    return;
  }

  productosFiltrados = productosGlobal.filter(producto => {
    const nombre = producto.nameFurniture?.toLowerCase() || "";
    const descripcion = producto.descriptionFurniture?.toLowerCase() || "";
    return nombre.includes(input) || descripcion.includes(input);
  });

  modoFiltrado = true;
  paginaActualProductos = 1;
  mostrarProductosView();
}

function ordenarPorNombre() {
  const productos = modoFiltrado ? productosFiltrados : productosGlobal;

  if (productos.length === 0) return;

  productos.sort((a, b) =>
    a.nameFurniture.localeCompare(b.nameFurniture)
  );

  mostrarProductosView();
}

function cambiarCantidadProductos() {
  const selector = document.getElementById("selectorCantidadProductos");
  cantidadPorPagina = parseInt(selector.value);
  paginaActualProductos = 1;
  mostrarProductosView();
}

document.addEventListener("DOMContentLoaded", () => {
  mostrarProductos();
  cargarCategoriasProductos();

  const filtroCategoriasViewEl = document.getElementById("filtroCategoriasView");
  if (filtroCategoriasViewEl) {
    filtroCategoriasViewEl.addEventListener("change", filtrarPorCategoria);
  }

  const btnAnterior = document.getElementById("btnAnteriorProductos");
  if (btnAnterior) {
    btnAnterior.addEventListener("click", () => {
      if (paginaActualProductos > 1) {
        paginaActualProductos--;
        mostrarProductosView();
      }
    });
  }

  const btnSiguiente = document.getElementById("btnSiguienteProductos");
  if (btnSiguiente) {
    btnSiguiente.addEventListener("click", () => {
      const totalPaginas = Math.ceil(
        (modoFiltrado ? productosFiltrados.length : productosGlobal.length) / cantidadPorPagina
      );
      if (paginaActualProductos < totalPaginas) {
        paginaActualProductos++;
        mostrarProductosView();
      }
    });
  }

  const buscador = document.getElementById("buscador-productos");
  if (buscador) {
    buscador.addEventListener("input", buscarProductos);
  }

  const selectorCantidad = document.getElementById("selectorCantidadProductos");
  if (selectorCantidad) {
    selectorCantidad.addEventListener("change", cambiarCantidadProductos);
  }

  const ordenarNombreBtn = document.getElementById("ordenarNombre");
  if (ordenarNombreBtn) {
    ordenarNombreBtn.addEventListener("click", ordenarPorNombre);
  }
});







let productoIdAEliminar = null;

function abrirModalEliminarProducto(id) {
  productoIdAEliminar = id;
  document.getElementById('modalEliminarProducto').style.display = 'flex';
}

function cerrarModalEliminarProducto() {
  productoIdAEliminar = null;
  document.getElementById('modalEliminarProducto').style.display = 'none';
}

function getCSRFToken() {
  const tokenMeta = document.querySelector('meta[name="csrf-token"]');
  return tokenMeta ? tokenMeta.getAttribute('content') : '';
}

async function eliminarProductoConfirmado() {
  if (!productoIdAEliminar) return;

  const token = localStorage.getItem("access_token");
  if (!token) {
    alert("No estás autenticado");
    return;
  }

  try {
    const csrfToken = getCSRFToken();

    const response = await fetch(`/productos/eliminar-producto/${productoIdAEliminar}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.redirected || response.ok) {
      cerrarModalEliminarProducto();
      await mostrarProductos(); // recarga productos actualizados
    } else {
      const errorData = await response.json();
      console.error("Error del servidor:", errorData);
      alert("Error al eliminar el producto.");
    }
  } catch (error) {
    console.error("Error en la eliminación:", error);
    alert("Hubo un error inesperado.");
  }
}
