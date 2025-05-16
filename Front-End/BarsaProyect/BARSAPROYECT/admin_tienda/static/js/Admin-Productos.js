

let ordenAscendentep = true;
let productosFiltradosGlobal = [...productos]; 
let productosPorPagina = 5;  // Valor inicial de productos por página
let paginaActualProductos = 1;

function ordenarPorNombre() {
  ordenAscendentep = !ordenAscendentep;  // Cambia el orden cada vez que se hace clic

  // Ordena los productos según el orden seleccionado
  productos.sort((a, b) => {
    if (ordenAscendentep) {
      return a.nombre.localeCompare(b.nombre);  // Orden Ascendente (A-Z)
    } else {
      return b.nombre.localeCompare(a.nombre);  // Orden Descendente (Z-A)
    }
  });

  // Refresca la tabla después de ordenar
  llenarTablaProductosLLeno();
}


/************************************************************************************************************/
/******************************* Llenar Tabla Productos *****************************************************/
/************************************************************************************************************/
function llenarTablaProductosLLeno(lista = productos) {
  const tbody = document.getElementById("tablaProductosDestacados");
  tbody.innerHTML = "";

  const inicio = (paginaActualProductos - 1) * productosPorPagina;
  const fin = inicio + productosPorPagina;
  const productosPagina = lista.slice(inicio, fin);

  productosPagina.forEach(producto => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${producto.id}</td>
      <td>${producto.nombre}</td>
      <td>${producto.descripcion}</td>
      <td>$${producto.precio}</td>
      <td>${producto.oferta ? 'Sí' : 'No'}</td>
      <td>${producto.oferta ? `$${producto.precioOferta}` : '-'}</td>
      <td>${producto.carpeta}</td>
      <td class="td-centrado">
        <textarea readonly class="form-control">${producto.nombreimagenes}</textarea>
      </td>
      <td>
        <button  class="edit-btn-producto"  onclick="editarProducto(${producto.id})">
        <i class="fas fa-edit"></i>
        </button>
        <button  class="delete-btn-producto" onclick="eliminarProducto(${producto.id})">
        <i class="fas fa-trash-alt"></i>
        </button>
      </td>
    `;

    tbody.appendChild(fila);
  });

  // Actualiza la paginación
  document.getElementById("paginaActualProductosLleno").textContent = `Página ${paginaActualProductos}`;
  document.getElementById("totalPaginasProductosLleno").textContent = `de ${Math.ceil(productos.length / productosPorPagina)}`;
}


function cambiarPaginaProductosLleno(direccion) {
  const totalPaginas = Math.ceil(productos.length / productosPorPagina);
  paginaActualProductos += direccion;

  if (paginaActualProductos < 1) paginaActualProductos = 1;
  if (paginaActualProductos > totalPaginas) paginaActualProductos = totalPaginas;

  llenarTablaProductosLLeno();
}

function cambiarCantidadProductos() {
  const selector = document.getElementById("selectorCantidadProductos");
  productosPorPagina = parseInt(selector.value);
  paginaActualProductos = 1;
  llenarTablaProductosLLeno(); // Refresca la tabla con la nueva cantidad
}

// Cargar la tabla con los productos al inicio
document.addEventListener("DOMContentLoaded", () => {
  llenarTablaProductosLLeno();  // Llenar la tabla al cargar
  cambiarCantidadProductos();   // Establecer la cantidad de productos por página
});




function cambiarCantidadProductos() {

  const selector = document.getElementById("selectorCantidadProductos");
  productosPorPagina = parseInt(selector.value);
  paginaActualProductos = 1;
  llenarTablaProductosLLeno(); // o el nombre que uses para dibujar la tabla
}
// Cargar al inicio
document.addEventListener("DOMContentLoaded", () => {
  llenarTablaProductosLLeno();
  cambiarCantidadProductos()
});
/************************************************************************************************************/
/******************************* Llenar Tabla Productos *****************************************************/
/************************************************************************************************************/

function llenarTablaProductos(listaProductos) {
  const tabla = document.getElementById('tablaProductos');
  tabla.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos productos
  
  listaProductos.forEach((producto, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="td-centrado">${producto.id}</td>
      <td ">${producto.nombre}</td>
      <td ">${producto.descripcion}</td>
      <td class="td-centrado">${producto.precio}</td>
      <td class="td-centrado">${producto.oferta ? 'Sí' : 'No'}</td>
      <td class="td-centrado">${producto.oferta ? '$' + producto.precioOferta : '-'}</td>
      <td>${producto.carpeta}</td>
      <td class="td-centrado">
        <textarea readonly class="form-control">${producto.nombreimagenes}</textarea>
      </td>
      <td class="td-centrado">
       <button class="edit-btn-producto" onclick="editarProducto(${index})"><i class="fas fa-edit"></i></button>

        <button class="delete-btn-producto" onclick="abrirModalEliminarProducto(${index})">
    <i class="fas fa-trash-alt"></i>
</button>

      </td>
    `;
    tabla.appendChild(tr);
  });
}



/************************************************************************************************************/
/******************************* Guardar Nuevo Producto *****************************************************/
/************************************************************************************************************/


function guardarNuevoProducto() {
  // Obtener valores de los campos
  const nombre = document.getElementById('nombreProducto').value.trim();
  const descripcion = document.querySelector('textarea[for="descripcionProducto"]').value.trim();
  const precio = parseFloat(document.getElementById('precioProducto').value);
  const estaEnOferta = document.getElementById('ofertaProducto').checked;
  const descuento = estaEnOferta ? parseFloat(document.getElementById('descuentoSeleccionado').value) : 0;
  const precioConDescuento = estaEnOferta ? parseFloat(document.getElementById('precioProductoDescuento').value) : null;
  const carpetaSeleccionada = document.getElementById('select-carpetas').value || document.getElementById('nombre-carpeta').value.trim();
  const nombreImagenes = document.getElementById('textareaImagenes').value.trim();
  
  // Validación básica
  let esValido = true;
  if (nombre === '') {
    document.getElementById('errorNombreProducto').textContent = 'Nombre requerido';
    esValido = false;
  } else {
    document.getElementById('errorNombreProducto').textContent = '';
  }
  
  if (descripcion === '') {
    document.getElementById('errorDescripcionProducto').textContent = 'Descripción requerida';
    esValido = false;
  } else {
    document.getElementById('errorDescripcionProducto').textContent = '';
  }
  
  if (isNaN(precio) || precio <= 0) {
    document.getElementById('errorPrecioProducto').textContent = 'Precio inválido';
    esValido = false;
  } else {
    document.getElementById('errorPrecioProducto').textContent = '';
  }
  
  if (estaEnOferta && (isNaN(descuento) || descuento < 0 || descuento > 100)) {
    document.getElementById('errorPrecioDescuentoProducto').textContent = 'Descuento inválido';
    esValido = false;
  } else {
    document.getElementById('errorPrecioDescuentoProducto').textContent = '';
  }
  
  if (!esValido) return; // Si no es válido, no guardar el producto
  
  // Crear producto
  const producto = {
    id: productos.length + 1,
    nombre,
    descripcion,
    precio: precio.toFixed(2),
    oferta: estaEnOferta,
    precioOferta: estaEnOferta ? precioConDescuento.toFixed(2) : null,
    carpeta: carpetaSeleccionada,
    nombreimagenes: nombreImagenes
  };
  
  // Agregar producto y actualizar tabla
  productos.push(producto);
  llenarTablaProductos(productos);
  limpiarFormularioNuevoProducto();
  cerrarModalAgregarProducto();
}

/************************************************************************************************************/
/******************************* Limpiar Formulario Nuevo Producto ******************************************/
/************************************************************************************************************/


function limpiarFormularioNuevoProducto() {
  document.getElementById('nombreProducto').value = '';
  document.querySelector('textarea[for="descripcionProducto"]').value = '';
  document.getElementById('precioProducto').value = '';
  document.getElementById('ofertaProducto').checked = false;
  document.getElementById('descuentoSeleccionado').value = '';
  document.getElementById('precioProductoDescuento').value = '';
  document.getElementById('select-carpetas').value = '';
  document.getElementById('textareaImagenes').value = '';
}



/* ************************************************************************** */
/* ****************** Pintar Select carpetas ene el input  ****************** */
/* ************************************************************************** */

 // Obtener el select y el input

const selectCarpetasProductos = document.getElementById('select-carpetas');
const inputNombreProductos = document.getElementById('nombre-carpeta');

// Cuando cambia el select, actualizar el input
selectCarpetasProductos.addEventListener('change', function () {
  inputNombreProductos.value = this.value;
});


/* ************************************************************************** */
/* *************************** Guardar Carpetas ***************************** */
/* ************************************************************************** */

document.getElementById('formulario-carpeta').addEventListener('submit', function(event) {
  event.preventDefault();

  const nombreCarpeta = document.getElementById('nombre-carpeta').value.trim();
  const mensajeError = document.getElementById('mensajeError');

  fetch('{% url "gestionar_carpetas" %}', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken  
      },
      body: JSON.stringify({ carpeta: nombreCarpeta })
  })
  .then(response => response.json().then(data => ({ ok: response.ok, data })))
  .then(({ ok, data }) => {
      if (ok && data.carpetas) {
          // Actualizar el select
          const select = document.getElementById('select-carpetas');
          select.innerHTML = '';
          data.carpetas.forEach(carpeta => {
              const option = document.createElement('option');
              option.value = carpeta;
              option.textContent = carpeta;
              select.appendChild(option);
          });

          // Ocultar mensaje de error si todo salió bien
          mensajeError.style.display = 'none';
          mensajeError.textContent = '';
      } else {
          // Mostrar mensaje de error
          mensajeError.style.display = 'block';
          mensajeError.textContent = data.error || 'Error al guardar la carpeta. Inténtalo de nuevo.';
      }
  })
  .catch(error => {
      console.error('Error de red o inesperado:', error);
      mensajeError.style.display = 'block';
      mensajeError.textContent = 'Error de red o inesperado. Inténtalo más tarde.';
  });
});

/* ***************************************************************************** */
/* ****************** Limpiar Formulario Nuevo Producto ************************ */
/* ***************************************************************************** */

function limpiarFormularioNuevoProducto() {
  document.getElementById('nombreProducto').value = '';
  document.querySelector('textarea[for="descripcionProducto"]').value = '';
  document.getElementById('precioProducto').value = '';
  document.getElementById('ofertaProducto').checked = false;
  document.getElementById('descuentoSeleccionado').value = '';
  document.getElementById('precioProductoDescuento').value = '';
  document.getElementById('select-carpetas').value = '';
  document.getElementById('nombre-carpeta').value = '';
  document.getElementById('textareaImagenes').value = '';

  // Limpiar mensajes de estado y archivos
  const estadoImagen = document.getElementById('estadoImagen');
  if (estadoImagen) estadoImagen.textContent = '';

  const nombreArchivo = document.getElementById('nombreArchivoImagen');
  if (nombreArchivo) {
    nombreArchivo.textContent = '';
    nombreArchivo.style.display = 'none';
  }

  // Limpiar errores de validación
  const errores = [
    'errorNombreProducto',
    'errorDescripcionProducto',
    'errorPrecioProducto',
    'errorPrecioDescuentoProducto'
  ];

  errores.forEach(id => {
    const elemento = document.getElementById(id);
    if (elemento) elemento.textContent = '';
  });
}

/* ***************************************************************************** */
/* ******************** Eliminar Producto Con Firmado ************************** */
/* ***************************************************************************** */

// Función para confirmar la eliminación del producto
function eliminarProductoConfirmado() {
  // Aquí se utiliza el índice guardado previamente para eliminar el producto
  if (productoAEliminarIndex !== -1) {
      // Lógica para eliminar el producto, por ejemplo:
      productos.splice(productoAEliminarIndex, 1); // Elimina el producto del array
      llenarTablaProductos(productos); // Actualiza la vista
  }

  // Cierra el modal después de la eliminación
  cerrarModalEliminarProducto();
}

/* ***************************************************************************** */
/* *************************** Editar Producto ********************************* */
/* ***************************************************************************** */

function editarProducto(index) {
  const producto = productos[index];

  document.getElementById('editarId').value = producto.id;
  document.getElementById('editarNombre').value = producto.nombre;
  document.getElementById('editarDescripcion').value = producto.descripcion;
  document.getElementById('editarPrecio').value = producto.precio;
  document.getElementById('editarOferta').value = producto.oferta;
  document.getElementById('editarPrecioOferta').value = producto.precioOferta;
  document.getElementById('editarCarpeta').value = producto.carpeta;
  document.getElementById('editarNombreImagenes').value = producto.nombreimagenes;
  document.getElementById('editarCategoriaId').value = producto.categoriaId;

  // 👉 Esta línea es clave para guardar el índice
  document.getElementById('formEditarProducto').dataset.index = index;

  document.getElementById('modalEditarProducto').style.display = 'flex';
}

/* ***************************************************************************** */
/* *********************** Guardar Editar Producto ***************************** */
/* ***************************************************************************** */

function guardarEditarProducto() {
  const form = document.getElementById('formEditarProducto');
  const index = parseInt(form.dataset.index);
  const producto = productos[index];

  producto.nombre = document.getElementById('editarNombre').value;
  producto.descripcion = document.getElementById('editarDescripcion').value;
  producto.precio = parseFloat(document.getElementById('editarPrecio').value);
  producto.oferta = document.getElementById('editarOferta').value === 'true';
  producto.precioOferta = parseFloat(document.getElementById('editarPrecioOferta').value);
  producto.carpeta = document.getElementById('editarCarpeta').value;
  producto.nombreimagenes = document.getElementById('editarNombreImagenes').value;
  producto.categoriaId = parseInt(document.getElementById('editarCategoriaId').value);

  // Refresca tabla y cierra el modal
  llenarTablaProductos(productosFiltradosGlobal);
  cerrarModalEditarProducto();
}

/* ***************************************************************************** */
/* ********************************* Modal ************************************* */
/* ***************************************************************************** */

function cerrarModalEditarProducto() {
  document.getElementById('modalEditarProducto').style.display = 'none';
}

function abrirModalEliminarProducto(index) {
  // Mostrar el modal
  document.getElementById('modalEliminarProducto').style.display = 'block';
  productoAEliminarIndex = index;
}

// Función para cerrar el modal de eliminación de producto
function cerrarModalEliminarProducto() {
  document.getElementById('modalEliminarProducto').style.display = 'none';
}

function cerrarModalAgregarProducto() {
  document.getElementById('Modal-Agregar-Producto').style.display = 'none';
}

function abrirModalAgregarProductos() {
  document.getElementById('Modal-Agregar-Producto').style.display = 'block';
}
function cerrarModalAgregar() {
  document.getElementById('Modal-Agregar-Producto').style.display = 'none';
}

function cerrarModalAgregarProducto() {
  document.getElementById('Modal-Agregar-Producto').style.display = 'none';
  limpiarFormularioNuevoProducto();
}









llenarTablaProductosLLeno(productos);


function cargarCategorias() {
  const selectCategoria = document.getElementById("filtroCategoria");
  categorias.forEach(categoria => {
    const option = document.createElement("option");
    option.value = categoria.id;
    option.textContent = categoria.nombre;
    selectCategoria.appendChild(option);
  });
}

// Llamar a la función al cargar la página
cargarCategorias();


function filtrarPorCategoria() {
  const categoriaSeleccionada = document.getElementById("filtroCategoria").value;
  
  // Filtrar los productos según la categoría seleccionada
  const productosFiltrados = productos.filter(producto => {
    return categoriaSeleccionada ? producto.categoriaId == categoriaSeleccionada : true;
  });
  
  // Llenar la tabla con los productos filtrados
  llenarTablaProductosLLeno(productosFiltrados);
}

function buscarProductosDestacados() {
  const buscador = document.getElementById("buscadorProductoDestacados").value.toLowerCase();
  
  const productosFiltrados = productos.filter(producto => 
    producto.nombre.toLowerCase().includes(buscador)
  );
  
  llenarTablaProductosLLeno(productosFiltrados); // Llenar la tabla con los productos filtrados
}

let categoriaSeleccionadaId = null;


function mostrarTablaCategoria(idCategoria) {
  categoriaSeleccionadaId = idCategoria;

  // Oculta todas las tablas
  document.querySelectorAll('.tabla-productos').forEach(tabla => {
    tabla.classList.remove('activa');
  });

  // Muestra la tabla de la categoría seleccionada
  const tabla = document.getElementById('tablaCategoria_' + idCategoria);
  if (tabla) {
    tabla.classList.add('activa');
  }

  // Muestra los productos de esa categoría
  const productosFiltrados = productos.filter(p => p.categoriaId == idCategoria);
  mostrarProductosEnTabla(productosFiltrados, idCategoria);
}
function buscarProductos() {
  const termino = document.getElementById('buscadorProducto').value.toLowerCase();

  // Filtro por nombre o descripción + por categoría actual
  const productosFiltrados = productos.filter(p => {
    const coincideBusqueda = p.nombre.toLowerCase().includes(termino) ||
                             p.descripcion.toLowerCase().includes(termino);
    const coincideCategoria = p.categoriaId == categoriaSeleccionadaId;
    return coincideBusqueda && coincideCategoria;
  });

  mostrarProductosEnTabla(productosFiltrados, categoriaSeleccionadaId);
}
function mostrarProductosEnTabla(productosFiltrados, idCategoria) {
  const tabla = document.getElementById('tablaCategoria_' + idCategoria);
  if (!tabla) return;

  const tbody = tabla.querySelector('tbody');
  tbody.innerHTML = ''; // Limpia filas anteriores

  productosFiltrados.forEach(p => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${p.nombre}</td>
      <td>${p.descripcion}</td>
      <td>${p.precio}</td>
      <td>${p.oferta ? p.precioOferta : '—'}</td>
      <td><img src="${p.nombreimagenes}" width="50"></td>
      
    `;
    tbody.appendChild(fila);
  });
}

function buscarProductos() {
  const termino = document.getElementById('buscadorProducto').value.toLowerCase();
  const filas = document.querySelectorAll('#tablaProductos tr');

  filas.forEach(fila => {
    const nombre = fila.children[1]?.textContent.toLowerCase() || "";
    fila.style.display = nombre.includes(termino) ? '' : 'none';
  });
}


  const toggle = document.getElementById('toggleSearch');
  const group = document.getElementById('searchGroup');

  toggle.addEventListener('click', () => {
    group.classList.toggle('expand');
    const input = group.querySelector('input');
    if (group.classList.contains('expand')) {
      setTimeout(() => input.focus(), 300);
    }
  });






/* ***************************************************************************** 
  function renderTarjetas(lista = productos) {
    const contenedor = document.getElementById("contenedor-productos");
    contenedor.innerHTML = "";
  
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
  */