let paginaActualProductos = 1;
let cantidadPorPagina = 5;
let productosGlobal = [];

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

  if (!productosGlobal.length) {
    tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;">No hay productos disponibles.</td></tr>`;
    return;
  }

  const totalProductos = productosGlobal.length;
  const totalPaginas = Math.ceil(totalProductos / cantidadPorPagina);

  if (paginaActualProductos > totalPaginas) {
    paginaActualProductos = totalPaginas;
  }

  const inicio = (paginaActualProductos - 1) * cantidadPorPagina;
  const fin = inicio + cantidadPorPagina;
  const productosPagina = productosGlobal.slice(inicio, fin);

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

  // Mostrar paginación
  document.getElementById("paginaActual").textContent = `Página ${paginaActualProductos}`;
  document.getElementById("totalPaginas").textContent = totalPaginas;
}

// Botones de paginación
document.getElementById("btnAnterior").addEventListener("click", () => {
  if (paginaActualProductos > 1) {
    paginaActualProductos--;
    mostrarProductosView();
  }
});

document.getElementById("btnSiguiente").addEventListener("click", () => {
  const totalPaginas = Math.ceil(productosGlobal.length / cantidadPorPagina);
  if (paginaActualProductos < totalPaginas) {
    paginaActualProductos++;
    mostrarProductosView();
  }
});

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  mostrarProductos();
});
