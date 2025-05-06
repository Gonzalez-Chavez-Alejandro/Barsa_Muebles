let idCounterproductos = 1; 
const productos = [
  {id: idCounterproductos++, nombre: "aSilla moderna", descripcion: "Silla de madera con respaldo", precio: 1200, oferta: true, precioOferta: 999, categoriaId: 1 },
  { id: idCounterproductos++, nombre: "bSilla moderna", descripcion: "Silla de madera con respaldo", precio: 1200, oferta: true, precioOferta: 999, categoriaId: 1 },
  { id: idCounterproductos++, nombre: "cMesa redonda", descripcion: "Mesa para comedor", precio: 3500, oferta: false, precioOferta: 0, categoriaId: 1 },
  { id: idCounterproductos++, nombre: "dSilla moderna", descripcion: "Silla de madera con respaldo", precio: 1200, oferta: true, precioOferta: 999, categoriaId: 1 },
  { id: idCounterproductos++, nombre: "fMesa redonda", descripcion: "Mesa para comedor", precio: 3500, oferta: false, precioOferta: 0, categoriaId: 1 },
  { id: idCounterproductos++, nombre: "gSilla moderna", descripcion: "Silla de madera con respaldo", precio: 1200, oferta: true, precioOferta: 999, categoriaId: 1 },
  { id: idCounterproductos++, nombre: "hMesa redonda", descripcion: "Mesa para comedor", precio: 3500, oferta: false, precioOferta: 0, categoriaId: 1 },
  { id: idCounterproductos++, nombre: "jSilla moderna", descripcion: "Silla de madera con respaldo", precio: 1200, oferta: true, precioOferta: 999, categoriaId: 1 },
  { id: idCounterproductos++, nombre: "lMesa redonda", descripcion: "Mesa para comedor", precio: 3500, oferta: false, precioOferta: 0, categoriaId: 1 },
  { id: idCounterproductos++, nombre: "mSilla moderna", descripcion: "Silla de madera con respaldo", precio: 1200, oferta: true, precioOferta: 999, categoriaId: 1 },
  { id: idCounterproductos++, nombre: "mMesa redonda", descripcion: "Mesa para comedor", precio: 3500, oferta: false, precioOferta: 0, categoriaId: 1 },
  { id: idCounterproductos++, nombre: "oSilla moderna", descripcion: "Silla de madera con respaldo", precio: 1200, oferta: true, precioOferta: 999, categoriaId: 1 },
  { id: idCounterproductos++, nombre: "pSilla moderna", descripcion: "Silla de madera con respaldo", precio: 1200, oferta: true, precioOferta: 999, categoriaId: 1 },
  { id: idCounterproductos++, nombre: "qMesa redonda", descripcion: "Mesa para comedor", precio: 3500, oferta: false, precioOferta: 0, categoriaId: 1 },
  { id: idCounterproductos++, nombre: "rSilla moderna", descripcion: "Silla de madera con respaldo", precio: 1200, oferta: true, precioOferta: 999, categoriaId: 1 },
  { id: idCounterproductos++, nombre: "Mesa redonda", descripcion: "Mesa para comedor", precio: 3500, oferta: false, precioOferta: 0, categoriaId: 1 },
  { id: idCounterproductos++, nombre: "Silla moderna", descripcion: "Silla de madera con respaldo", precio: 1200, oferta: true, precioOferta: 999, categoriaId: 1 },
  { id: idCounterproductos++, nombre: "Mesa redonda", descripcion: "Mesa para comedor", precio: 3500, oferta: false, precioOferta: 0, categoriaId: 1 },
  { id: idCounterproductos++, nombre: "Silla moderna", descripcion: "Silla de madera con respaldo", precio: 1200, oferta: true, precioOferta: 999, categoriaId: 1 },
  { id: idCounterproductos++, nombre: "Mesa redonda", descripcion: "Mesa para comedor", precio: 3500, oferta: false, precioOferta: 0, categoriaId: 1 }
];

let paginaActualProductos = 1;
const productosPorPagina = 10;
let ordenAscendentep = true; 
let productosFiltradosGlobal = [...productos]; // Comienza mostrando todos

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
  cambiarPaginaProductos(0); // Esto asegura que se cargue la primera página
});

function llenarTablaProductos(listaProductos) {
  const tabla = document.getElementById('tablaProductos');
  tabla.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos productos

  listaProductos.forEach((producto, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${producto.id}</td>
      <td>${producto.nombre}</td>
      <td>${producto.descripcion}</td>
      <td>$${producto.precio}</td>
      <td class="td-centrado">${producto.oferta ? 'Sí' : 'No'}</td>
      <td class="td-centrado">${producto.oferta ? '$' + producto.precioOferta : '-'}</td>
      <td class="td-centrado">
        <button class="btn-agregar-imagen-home" onclick="AgregarImagenesHome(${producto.id})">
          <i class="fas fa-image icono-imagen"></i> Home
        </button>
      </td>
      <td class="td-centrado">
        <button class="btn-agregar-imagenes" onclick="AgregarImagenes(${producto.id})">
          <i class="fas fa-image icono-imagen"></i> Imágenes
        </button>
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

function buscarProductos() {
  const termino = document.getElementById('buscadorProducto').value.toLowerCase();
  productosFiltradosGlobal = productos.filter(p =>
    p.nombre.toLowerCase().includes(termino) ||
    p.descripcion.toLowerCase().includes(termino)
  );
  paginaActualProductos = 1;
  cambiarPaginaProductos(0); 
}

function ordenarPorNombreProducto() {
  ordenAscendentep = !ordenAscendentep;

  productosFiltradosGlobal.sort((a, b) => {
    if (a.nombre.toLowerCase() < b.nombre.toLowerCase()) return ordenAscendentep ? -1 : 1;
    if (a.nombre.toLowerCase() > b.nombre.toLowerCase()) return ordenAscendentep ? 1 : -1;
    return 0;
  });

  cambiarPaginaProductos(0); 

  const boton = document.getElementById('ordenarBtn');
  boton.textContent = ordenAscendentep ? 'Ordenar Z-A' : 'Ordenar A-Z';  
}

let productoEditando = null;
let productoAEliminarId = null; // Guardar el ID real

function abrirModalEditarProducto(index) {
  productoEditando = index;
  const producto = productosFiltradosGlobal[index];
  document.getElementById('editarNombreProducto').value = producto.nombre;
  document.getElementById('editarDescripcionProducto').value = producto.descripcion;
  document.getElementById('editarPrecioProducto').value = producto.precio;
  document.getElementById('editarOfertaProducto').checked = producto.oferta;
  document.getElementById('editarPrecioOfertaProducto').value = producto.precioOferta;
  document.getElementById('modalEditarProducto').style.display = 'flex';
}

function cerrarModalEditarProducto() {
  document.getElementById('modalEditarProducto').style.display = 'none';
}

function guardarEdicionProducto() {
  if (productoEditando !== null) {
    const nombre = document.getElementById('editarNombreProducto').value.trim();
    const descripcion = document.getElementById('editarDescripcionProducto').value.trim();
    const precio = parseFloat(document.getElementById('editarPrecioProducto').value);
    const oferta = document.getElementById('editarOfertaProducto').checked;
    const precioOferta = parseFloat(document.getElementById('editarPrecioOfertaProducto').value);

    if (nombre && descripcion && !isNaN(precio)) {
      productosFiltradosGlobal[productoEditando] = {
        ...productosFiltradosGlobal[productoEditando],
        nombre,
        descripcion,
        precio,
        oferta,
        precioOferta: oferta ? precioOferta : 0
      };
      cerrarModalEditarProducto();
      cambiarPaginaProductos(0);
    }
  }
}

function abrirModalEliminarProducto(index) {
  // Obtener el ID del producto desde la lista filtrada
  productoAEliminarId = productosFiltradosGlobal[index].id;
  document.getElementById('modalEliminarProducto').style.display = 'flex';
}

function cerrarModalEliminarProducto() {
  document.getElementById('modalEliminarProducto').style.display = 'none';
}

function confirmarEliminarProducto() {
  if (productoAEliminarId !== null) {
    // Eliminar producto por ID en el array filtrado
    productosFiltradosGlobal = productosFiltradosGlobal.filter(p => p.id !== productoAEliminarId);
    
    // Si estamos en la última página y la cantidad de productos ha cambiado, ajustamos la página actual
    const totalProductos = productosFiltradosGlobal.length;
    const totalPaginas = Math.ceil(totalProductos / productosPorPagina);
    
    if (paginaActualProductos > totalPaginas) {
      paginaActualProductos = totalPaginas; // Si eliminamos en una página que ya no existe, volvemos a la última
    }

    // Volver a mostrar la tabla con los productos actualizados
    cambiarPaginaProductos(0); 
    cerrarModalEliminarProducto(); // Cerrar el modal después de la eliminación
  }
}


function agregarProducto() {
  const nombre = document.getElementById('nuevoNombreProducto').value.trim();
  const descripcion = document.getElementById('nuevoDescripcionProducto').value.trim();
  const precio = parseFloat(document.getElementById('nuevoPrecioProducto').value);
  const oferta = document.getElementById('nuevoOfertaProducto').checked;
  const precioOferta = parseFloat(document.getElementById('nuevoPrecioOfertaProducto').value);

  if (nombre && descripcion && !isNaN(precio)) {
    const nuevoProducto = {
      id: idCounterproductos++, // Nuevo ID
      nombre,
      descripcion,
      precio,
      oferta,
      precioOferta: oferta ? precioOferta : 0,
      categoriaId: 1 
    };

    productos.push(nuevoProducto);
    cambiarPaginaProductos(0);
  }
}
