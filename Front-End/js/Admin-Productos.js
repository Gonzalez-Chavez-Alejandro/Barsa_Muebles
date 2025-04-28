let idCounterProductos = 1;
const productos = [
  {
    id: idCounterProductos++,
    nombre: "Silla moderna",
    descripcion: "Silla de madera con respaldo",
    precio: 1200,
    oferta: true,
    precioOferta: 999,
    categoriaId: 1
  },
  {
    id: idCounterProductos++,
    nombre: "Mesa redonda",
    descripcion: "Mesa para comedor",
    precio: 3500,
    oferta: false,
    precioOferta: 0,
    categoriaId: 1
  }
];

// Función para llenar la tabla de productos
function llenarTablaProductos(productos) {
  const tabla = document.getElementById('tablaProductos');
  tabla.innerHTML = ''; // Limpia la tabla antes de llenar

  productos.forEach(producto => {
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
        <button class="edit-btn-producto" onclick="editarProducto(${producto.id})"><i class="fas fa-edit"></i></button>
        <button class="delete-btn-producto" onclick="eliminarProducto(${producto.id})"><i class="fas fa-trash-alt"></i></button>
      </td>
    `;
    tabla.appendChild(tr);
  });
}

// Función para mostrar productos de una categoría
function mostrarProductosCategoria(idCategoria, nombreCategoria) {
  ocultarTodasLasSecciones();
  document.getElementById('productos').classList.add('activa');
  document.getElementById('categoria-titulo').textContent = `Productos de ${nombreCategoria}`;
  document.getElementById('categoria-id').value = idCategoria;
  document.getElementById('formulario-producto').classList.add('activa');
  menuLateral.classList.remove("mostrar-menu");
  
  // Filtrar productos por categoría
  const productosDeCategoria = productos.filter(p => p.categoriaId === idCategoria);
  llenarTablaProductos(productosDeCategoria);
}

// Función para cargar las categorías en el submenú
function cargarSubmenuCategorias() {
  const submenu = document.getElementById('submenu-categorias');
  submenu.innerHTML = '';

  categorias.forEach(categoria => {
    const li = document.createElement('li');
    li.classList.add('submenu-item');
    li.innerHTML = `
      <a href="#" onclick="mostrarProductosCategoria(${categoria.id}, '${categoria.nombre}')">
        ${categoria.nombre}
      </a>
    `;
    submenu.appendChild(li);
  });
}

// Función para guardar un nuevo producto
function guardarNuevoProducto() {
  const nombreProducto = document.getElementById('nombreProducto') ? document.getElementById('nombreProducto').value : '';
  const descripcionProducto = document.getElementById('descripcionProducto') ? document.getElementById('descripcionProducto').value : '';
  const precioProducto = parseFloat(document.getElementById('precioProducto') ? document.getElementById('precioProducto').value : '0');
  const ofertaProducto = document.getElementById('ofertaProducto') ? document.getElementById('ofertaProducto').checked : false;
  const descuentoSeleccionado = parseFloat(document.getElementById('descuentoSeleccionado') ? document.getElementById('descuentoSeleccionado').value : '0');
  
  const precioOferta = ofertaProducto ? (precioProducto - (precioProducto * (descuentoSeleccionado / 100))) : 0;

  // Validaciones
  if (!nombreProducto || !descripcionProducto || isNaN(precioProducto) || precioProducto <= 0) {
    alert('Por favor, llena todos los campos correctamente.');
    return;
  }

  // Crear un nuevo producto
  const nuevoProducto = {
    id: idCounterProductos++, // Incrementar el contador de IDs
    nombre: nombreProducto,
    descripcion: descripcionProducto,
    precio: precioProducto,
    oferta: ofertaProducto,
    precioOferta: precioOferta,
    categoriaId: parseInt(document.getElementById('categoria-id') ? document.getElementById('categoria-id').value : '0')
  };

  // Agregar el producto al array de productos
  productos.push(nuevoProducto);

  // Actualizar la tabla de productos
  llenarTablaProductos(productos);

  // Cerrar el modal
  cerrarModalAgregarProducto();
}

// Función para cerrar el modal de agregar producto
function cerrarModalAgregarProducto() {
  const modal = document.getElementById('Modal-Agregar-Producto');
  modal.style.display = 'none'; // Ocultar el modal
}

// Función para aplicar descuento
function aplicarDescuento() {
  const oferta = document.getElementById('ofertaProducto').checked;
  const descuentoSeleccionado = parseFloat(document.getElementById('descuentoSeleccionado').value);
  const precioProducto = parseFloat(document.getElementById('precioProducto').value);
  const precioProductoDescuento = document.getElementById('precioProductoDescuento');

  if (oferta && !isNaN(descuentoSeleccionado) && descuentoSeleccionado > 0) {
    const precioOferta = precioProducto - (precioProducto * (descuentoSeleccionado / 100));
    precioProductoDescuento.value = precioOferta;
    precioProductoDescuento.disabled = false;
  } else {
    precioProductoDescuento.value = '';
    precioProductoDescuento.disabled = true;
  }
}

// Función para eliminar un producto
function eliminarProducto(productoId) {
  const indice = productos.findIndex(p => p.id === productoId);
  if (indice !== -1) {
    productos.splice(indice, 1); // Eliminar el producto del array
    llenarTablaProductos(productos); // Actualizar la tabla
  }
}

// Función para editar un producto (esto puede ser expandido según lo que necesites)
function editarProducto(productoId) {
  alert(`Editar producto con ID: ${productoId}`);
}

// Función para agregar imágenes (esto puede ser expandido según lo que necesites)
function AgregarImagenes(productoId) {
  alert(`Agregar imágenes para el producto con ID: ${productoId}`);
}

// Función para ocultar todas las secciones (esto puede depender de tu implementación de ocultación de secciones)
function ocultarTodasLasSecciones() {
  const secciones = document.querySelectorAll('.seccion');
  secciones.forEach(seccion => {
    seccion.classList.remove('activa');
  });
}

// Ejecutar al cargar la página
window.addEventListener('DOMContentLoaded', () => {
  cargarSubmenuCategorias();
});
