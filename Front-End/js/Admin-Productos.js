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

function buscarProductos() {
  const termino = document.getElementById('buscadorProducto').value.toLowerCase();
  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(termino) ||
    p.descripcion.toLowerCase().includes(termino)
  );
  paginaActualProductos = 1;
  llenarTablaProductos(productosFiltrados.slice(0, productosPorPagina));
  document.getElementById('paginaActualProductos').textContent = `Página 1`;
  document.getElementById('totalPaginasProductos').textContent = `de ${Math.ceil(productosFiltrados.length / productosPorPagina)}`;
}


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

function buscarProductos() {
  const termino = document.getElementById('buscadorProducto').value.toLowerCase();
  productosFiltradosGlobal = productos.filter(p =>
    p.nombre.toLowerCase().includes(termino) ||
    p.descripcion.toLowerCase().includes(termino)
  );
  paginaActualProductos = 1;
  cambiarPaginaProductos(0); // Recargar la tabla con los resultados filtrados
}
 // Usamos tu variable en lugar de "ordenAscendente"

function ordenarPorNombreProducto() {
  ordenAscendentep = !ordenAscendentep;  // Alternar entre verdadero y falso

  // Ordenar los productos alfabéticamente, alternando entre ascendente y descendente
  productosFiltradosGlobal.sort((a, b) => {
    if (a.nombre.toLowerCase() < b.nombre.toLowerCase()) return ordenAscendentep ? -1 : 1;
    if (a.nombre.toLowerCase() > b.nombre.toLowerCase()) return ordenAscendentep ? 1 : -1;
    return 0;
  });

  // Mostrar los productos ordenados en la página actual
  cambiarPaginaProductos(0);  // Esto recarga la página actual con los productos ordenados

  // Actualizar el texto del botón según el orden
  const boton = document.getElementById('ordenarBtn');
  boton.textContent = ordenAscendentep ? 'Ordenar Z-A' : 'Ordenar A-Z';  // Cambiar el texto del botón
}
