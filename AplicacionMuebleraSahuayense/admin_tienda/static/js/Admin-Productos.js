let paginaActualProductos = 1;
let cantidadPorPagina = 1; // Valor inicial que coincide con el selector
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

// Inicializar lógica del carrusel por producto
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

// Mostrar productos paginados
function mostrarProductosView() {
  const tbody = document.getElementById("tabla-productos");
  tbody.innerHTML = "";

  const productos = modoFiltrado ? productosFiltrados : productosGlobal;

  if (!productos.length) {
    tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;">${modoFiltrado ? 'No se encontraron productos.' : 'No hay productos disponibles.'}</td></tr>`;
    actualizarControlesPaginacion();
    return;
  }

  const totalProductos = productos.length;
  const totalPaginas = Math.ceil(totalProductos / cantidadPorPagina);

  // Ajustar página actual si es necesario
  if (paginaActualProductos > totalPaginas && totalPaginas > 0) {
    paginaActualProductos = totalPaginas;
  }

  const inicio = (paginaActualProductos - 1) * cantidadPorPagina;
  const fin = inicio + cantidadPorPagina;
  const productosPagina = productos.slice(inicio, fin);

  productosPagina.forEach(producto => {
    const imagenes = producto.imageFurniture ? producto.imageFurniture.split(",") : [];
    const imagenesHTML = crearCarruselImagenes(imagenes, producto.id);

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${producto.id || ''}</td>
      <td>${producto.nameFurniture || ''}</td>
      <td>${producto.descriptionFurniture || ''}</td>
      <td>$${Number(producto.priceFurniture).toFixed(2)}</td>
      <td>${producto.porcentajeDescuento || 0}%</td>
      <td>$${Number(producto.PrecioOferta).toFixed(2)}</td>
      <td>${producto.stateFurniture ? 'Activo' : 'Inactivo'}</td>
      <td>${imagenesHTML}</td>
      <td>${producto.categoryID || ''}</td>
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

  actualizarControlesPaginacion(totalPaginas);
}

// Actualizar controles de paginación
function actualizarControlesPaginacion(totalPaginas = 0) {
  const btnAnterior = document.getElementById("btnAnteriorProductos");
  const btnSiguiente = document.getElementById("btnSiguienteProductos");
  const paginaActualElement = document.getElementById("paginaActualProductos");
  const totalPaginasElement = document.getElementById("totalPaginas");

  if (modoFiltrado) {
    paginaActualElement.textContent = `Página ${paginaActualProductos} (Filtrado)`;
  } else {
    paginaActualElement.textContent = `Página ${paginaActualProductos}`;
  }
  
  totalPaginasElement.textContent = totalPaginas;

  // Habilitar/deshabilitar botones según la posición
  btnAnterior.disabled = paginaActualProductos <= 1;
  btnSiguiente.disabled = paginaActualProductos >= totalPaginas;
}

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  mostrarProductos();
  
  // Configurar event listeners para los botones de paginación
  document.getElementById("btnAnteriorProductos").addEventListener("click", () => {
    if (paginaActualProductos > 1) {
      paginaActualProductos--;
      mostrarProductosView();
    }
  });

  document.getElementById("btnSiguienteProductos").addEventListener("click", () => {
    const productos = modoFiltrado ? productosFiltrados : productosGlobal;
    const totalPaginas = Math.ceil(productos.length / cantidadPorPagina);
    if (paginaActualProductos < totalPaginas) {
      paginaActualProductos++;
      mostrarProductosView();
    }
  });
});

function cambiarCantidadProductos() {
  const selector = document.getElementById("selectorCantidadProductos");
  cantidadPorPagina = parseInt(selector.value);
  paginaActualProductos = 1; // Reiniciar a la primera página
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

// Función para ordenar por nombre (opcional)
function ordenarPorNombre() {
  const productos = modoFiltrado ? productosFiltrados : productosGlobal;
  
  // Verificar si ya está ordenado A-Z para cambiar a Z-A
  if (productos[0]?.nameFurniture < productos[productos.length-1]?.nameFurniture) {
    productos.sort((a, b) => b.nameFurniture.localeCompare(a.nameFurniture));
  } else {
    productos.sort((a, b) => a.nameFurniture.localeCompare(b.nameFurniture));
  }
  
  mostrarProductosView();
}



async function cargarCategorias() {
  const token = localStorage.getItem("access_token"); // O usa ACCESS_TOKEN si ya migraste

  try {
    const response = await fetch("/categorias/Listar/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) throw new Error("No se pudieron cargar las categorías");

    const categorias = await response.json();
    const select = document.getElementById("filtroCategoria");
    select.innerHTML = `<option value="">Todas las categorías</option>`;
    
    categorias.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat.id;
      option.textContent = cat.nameCategory;
      select.appendChild(option);
    });
  } catch (err) {
    console.error("Error al cargar categorías:", err);
  }
}


