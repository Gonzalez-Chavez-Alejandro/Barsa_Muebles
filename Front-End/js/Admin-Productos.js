let idCounterproductos = 1;
const productos = [
  {id: idCounterproductos++, nombre: "Silla moderna", descripcion: "Silla de madera con respaldo", precio: 1200, oferta: true, precioOferta: 999, categoriaId: 1 },
  { id: idCounterproductos++, nombre: "Silla moderna", descripcion: "Silla de madera con respaldo", precio: 1200, oferta: true, precioOferta: 999, categoriaId: 1 },
  { id: idCounterproductos++, nombre: "Mesa redonda", descripcion: "Mesa para comedor", precio: 3500, oferta: false, precioOferta: 0, categoriaId: 1 },
  { id: idCounterproductos++, nombre: "Silla moderna", descripcion: "Silla de madera con respaldo", precio: 1200, oferta: true, precioOferta: 999, categoriaId: 1 },
  { id: idCounterproductos++, nombre: "Mesa redonda", descripcion: "Mesa para comedor", precio: 3500, oferta: false, precioOferta: 0, categoriaId: 1 },
  { id: idCounterproductos++, nombre: "Silla moderna", descripcion: "Silla de madera con respaldo", precio: 1200, oferta: true, precioOferta: 999, categoriaId: 1 },
  { id: idCounterproductos++, nombre: "Mesa redonda", descripcion: "Mesa para comedor", precio: 3500, oferta: false, precioOferta: 0, categoriaId: 1 },
  { id: idCounterproductos++, nombre: "Silla moderna", descripcion: "Silla de madera con respaldo", precio: 1200, oferta: true, precioOferta: 999, categoriaId: 1 },
  { id: idCounterproductos++, nombre: "Mesa redonda", descripcion: "Mesa para comedor", precio: 3500, oferta: false, precioOferta: 0, categoriaId: 1 },
  { id: idCounterproductos++, nombre: "Silla moderna", descripcion: "Silla de madera con respaldo", precio: 1200, oferta: true, precioOferta: 999, categoriaId: 1 },
  { id: idCounterproductos++, nombre: "Mesa redonda", descripcion: "Mesa para comedor", precio: 3500, oferta: false, precioOferta: 0, categoriaId: 1 },
  { id: idCounterproductos++, nombre: "Silla moderna", descripcion: "Silla de madera con respaldo", precio: 1200, oferta: true, precioOferta: 999, categoriaId: 1 },
  { id: idCounterproductos++, nombre: "Silla moderna", descripcion: "Silla de madera con respaldo", precio: 1200, oferta: true, precioOferta: 999, categoriaId: 1 },
  { id: idCounterproductos++, nombre: "Mesa redonda", descripcion: "Mesa para comedor", precio: 3500, oferta: false, precioOferta: 0, categoriaId: 1 },
  { id: idCounterproductos++, nombre: "Silla moderna", descripcion: "Silla de madera con respaldo", precio: 1200, oferta: true, precioOferta: 999, categoriaId: 1 },
  { id: idCounterproductos++, nombre: "Mesa redonda", descripcion: "Mesa para comedor", precio: 3500, oferta: false, precioOferta: 0, categoriaId: 1 },
  { id: idCounterproductos++, nombre: "Silla moderna", descripcion: "Silla de madera con respaldo", precio: 1200, oferta: true, precioOferta: 999, categoriaId: 1 },
  { id: idCounterproductos++, nombre: "Mesa redonda", descripcion: "Mesa para comedor", precio: 3500, oferta: false, precioOferta: 0, categoriaId: 1 },
  { id: idCounterproductos++, nombre: "Silla moderna", descripcion: "Silla de madera con respaldo", precio: 1200, oferta: true, precioOferta: 999, categoriaId: 1 },
  { id: idCounterproductos++, nombre: "Mesa redonda", descripcion: "Mesa para comedor", precio: 3500, oferta: false, precioOferta: 0, categoriaId: 1 }
];

let paginaActualProductos = 1;
const productosPorPagina = 10;
let productoEliminar = null;


function cambiarPaginaProductos(direccion) {
  const totalProductos = productos.length;
  const totalPaginas = Math.ceil(totalProductos / productosPorPagina);

  // Cambiar la página según la dirección
  paginaActualProductos += direccion;

  // Asegurarse de que la página no se salga de los límites
  if (paginaActualProductos < 1) paginaActualProductos = 1;
  if (paginaActualProductos > totalPaginas) paginaActualProductos = totalPaginas;

  // Calcular los índices de inicio y fin de los productos a mostrar
  const inicio = (paginaActualProductos - 1) * productosPorPagina;
  const fin = inicio + productosPorPagina;
  const productosPaginados = productos.slice(inicio, fin);

  // Llenar la tabla con los productos correspondientes
  llenarTablaProductos(productosPaginados);

  // Actualizar la información de la paginación
  document.getElementById('paginaActualProductos').textContent = `Página ${paginaActualProductos}`;
  document.getElementById('totalPaginasProductos').textContent = `de ${totalPaginas}`;
}

// Inicializar la primera página y mostrar solo los productos de la primera página al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  cambiarPaginaProductos(0); // Esto asegura que se cargue la primera página
});
function llenarTablaProductos(listaProductos) {
  const tabla = document.getElementById('tablaProductos');
  tabla.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos productos

  // Insertar los productos correspondientes a la página actual
  listaProductos.forEach(producto => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${producto.id}</td>
      <td>${producto.nombre}</td>
      <td>${producto.descripcion}</td>
      <td>$${producto.precio}</td>
      <td class="td-centrado">${producto.oferta ? 'Sí' : 'No'}</td>
      <td class="td-centrado">${producto.oferta ? '$' + producto.precioOferta : '-'}</td>
      <td class="td-centrado">
        <button class="btn-agregar-imagenes" onclick="AgregarImagenes(${producto.id})">
          <i class="fas fa-image icono-imagen"></i> Imágenes
        </button>
      </td>
      <td class="td-centrado">
        <button class="edit-btn-producto" onclick="editarProducto(${producto.idCounterproductos})"><i class="fas fa-edit"></i></button>
        <button class="delete-btn-producto" onclick="abrirModalEliminarProducto(${producto.id})">
  <i class="fas fa-trash-alt"></i>
</button>

      </td>
    `;
    tabla.appendChild(tr);
  });
}


function abrirModalEliminarProducto(index) {
  productoAEliminar = index; // ← no categoriaAEliminar si es producto
  document.getElementById('modalEliminarProducto').style.display = 'flex';
}
function cerrarModalEliminarProducto() {
  document.getElementById('modalEliminarProducto').style.display = 'none';
}
function confirmarEliminarProducto() {
  if (productoAEliminar !== null) {
    const index = productos.findIndex(p => p.id === productoAEliminar);
    if (index !== -1) {
      productos.splice(index, 1);
      cerrarModalEliminarProducto();
      cambiarPaginaProductos(0); // refrescar productos
    }
  }
}