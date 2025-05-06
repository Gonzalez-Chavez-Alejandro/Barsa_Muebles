let idCounterproductos = 1; 
const productos = [
  {id: idCounterproductos++, nombre: "aSilla moderna", descripcion: "Silla de madera con respaldo", precio: 1200, oferta: true, precioOferta: 999, carpeta:"carpeta", nombreimagenes:"https://res.cloudinary.com/dacrpsl5p/image/upload/v1746330867/CARPETA1/Disney%20Universe%2012_22_2024%204_18_43%20PM.png", categoriaId: 1 },
  { id: idCounterproductos++, nombre: "bSilla moderna", descripcion: "Silla de madera con respaldo", precio: 1200, oferta: true, precioOferta: 999, categoriaId: 1 },
  { id: idCounterproductos++, nombre: "cMesa redonda", descripcion: "Mesa para comedor", precio: 3500, oferta: false, precioOferta: 0, categoriaId: 1 },
  { id: idCounterproductos++, nombre: "dSilla moderna", descripcion: "Silla de madera con respaldo", precio: 1200, oferta: true, precioOferta: 999, categoriaId: 1 },
  { id: idCounterproductos++, nombre: "fMesa redonda", descripcion: "Mesa para comedor", precio: 3500, oferta: false, precioOferta: 0, categoriaId: 1 },
  { id: idCounterproductos++, nombre: "gSilla moderna", descripcion: "Silla de madera con respaldo", precio: 1200, oferta: true, precioOferta: 999, categoriaId: 1 },
  { id: idCounterproductos++, nombre: "hMesa redonda", descripcion: "Mesa para comedor", precio: 3500, oferta: false, precioOferta: 0, categoriaId: 1 },
  { id: idCounterproductos++, nombre: "jSilla moderna", descripcion: "Silla de madera con respaldo", precio: 1200, oferta: true, precioOferta: 999, categoriaId: 1 },
];

let paginaActualProductos = 1;
const productosPorPagina = 10;
let ordenAscendentep = true;
let productosFiltradosGlobal = [...productos]; 


/************************************************************************************************************/
/***************************** Cambiar Pagina Productos *****************************************************/
/************************************************************************************************************/
function cambiarPaginaProductos(direccion) {
  const totalProductos = productosFiltradosGlobal.length;
  const totalPaginas = Math.ceil(totalProductos / productosPorPagina);
  
  paginaActualProductos += direccion;
  
  if (paginaActualProductos < 1) paginaActualProductos = 1;
  if (paginaActualProductos > totalPaginas) paginaActualProductos = totalPaginas;
  
  const inicio = (paginaActualProductos - 1) * productosPorPagina;
  const fin = inicio + productosPorPagina;
  const productosPaginados = productosFiltradosGlobal.slice(inicio, fin);
  
  llenarTablaProductos(productosPaginados);
  
  document.getElementById('paginaActualProductos').textContent = `Página ${paginaActualProductos}`;
  document.getElementById('totalPaginasProductos').textContent = `de ${totalPaginas}`;
}

document.addEventListener('DOMContentLoaded', () => {
  cambiarPaginaProductos(0); // Carga la primera página
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
/******************************* Llenar Tabla Productos *****************************************************/
/************************************************************************************************************/


function buscarProductos() {
  const termino = document.getElementById('buscadorProducto').value.toLowerCase();
  productosFiltradosGlobal = productos.filter(p =>
    p.nombre.toLowerCase().includes(termino) || 
    p.descripcion.toLowerCase().includes(termino)
  );
  paginaActualProductos = 1;
  cambiarPaginaProductos(0); // Cambiar de página a la primera al buscar
}

function ordenarPorNombreProducto() {
  ordenAscendentep = !ordenAscendentep;
  
  productosFiltradosGlobal.sort((a, b) => {
    if (a.nombre.toLowerCase() < b.nombre.toLowerCase()) return ordenAscendentep ? -1 : 1;
    if (a.nombre.toLowerCase() > b.nombre.toLowerCase()) return ordenAscendentep ? 1 : -1;
    return 0;
  });
  
  cambiarPaginaProductos(0); // Cambiar de página a la primera después de ordenar
  
  const boton = document.getElementById('ordenarBtn');
  boton.textContent = ordenAscendentep ? 'Ordenar Z-A' : 'Ordenar A-Z';
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

