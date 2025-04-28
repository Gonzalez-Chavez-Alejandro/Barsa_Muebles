let idCounterProducto = 1;
const productos = [
  {
    id: idCounterProducto++,
    nombre: "Silla moderna",
    descripcion: "Silla de madera con respaldo",
    precio: 1200,
    oferta: true,
    precioOferta: 999,
    categoriaId: 1
  },
  {
    id: idCounterProducto++,
    nombre: "Mesa redonda",
    descripcion: "Mesa para comedor",
    precio: 3500,
    oferta: false,
    precioOferta: 0,
    categoriaId: 1
  },
  {
    id: idCounterProducto++,
    nombre: "Silla moderna",
    descripcion: "Silla de madera con respaldo",
    precio: 1200,
    oferta: true,
    precioOferta: 999,
    categoriaId: 1
  },
  {
    id: idCounterProducto++,
    nombre: "Mesa redonda",
    descripcion: "Mesa para comedor",
    precio: 3500,
    oferta: false,
    precioOferta: 0,
    categoriaId: 1
  },
  {
    id: idCounterProducto++,
    nombre: "Silla moderna",
    descripcion: "Silla de madera con respaldo",
    precio: 1200,
    oferta: true,
    precioOferta: 999,
    categoriaId: 1
  },
  {
    id: idCounterProducto++,
    nombre: "Mesa redonda",
    descripcion: "Mesa para comedor",
    precio: 3500,
    oferta: false,
    precioOferta: 0,
    categoriaId: 1
  },
  {
    id: idCounterProducto++,
    nombre: "Silla moderna",
    descripcion: "Silla de madera con respaldo",
    precio: 1200,
    oferta: true,
    precioOferta: 999,
    categoriaId: 1
  },
  {
    id: idCounterProducto++,
    nombre: "Mesa redonda",
    descripcion: "Mesa para comedor",
    precio: 3500,
    oferta: false,
    precioOferta: 0,
    categoriaId: 1
  },
  {
    id: idCounterProducto++,
    nombre: "Silla moderna",
    descripcion: "Silla de madera con respaldo",
    precio: 1200,
    oferta: true,
    precioOferta: 999,
    categoriaId: 1
  },
  {
    id: idCounterProducto++,
    nombre: "Mesa redonda",
    descripcion: "Mesa para comedor",
    precio: 3500,
    oferta: false,
    precioOferta: 0,
    categoriaId: 1
  },
  {
    id: idCounterProducto++,
    nombre: "Silla moderna",
    descripcion: "Silla de madera con respaldo",
    precio: 1200,
    oferta: true,
    precioOferta: 999,
    categoriaId: 1
  },
  {
    id: idCounterProducto++,
    nombre: "Mesa redonda",
    descripcion: "Mesa para comedor",
    precio: 3500,
    oferta: false,
    precioOferta: 0,
    categoriaId: 1
  }
];

// Almacenar la categoría seleccionada
let categoriaSeleccionada = null;
let productosFiltrados = [...productos];
let productosPorPagina = 10; // Cantidad de productos por página
let paginaActual = 1; // Página inicial
let totalPaginas = Math.ceil(productos.length / productosPorPagina); // Calcular el total de páginas


// Función para llenar la tabla de productos
function llenarTablaProductos(listaProductos) {
  const tabla = document.getElementById('tablaProductos');
  tabla.innerHTML = ''; // Limpiar la tabla antes de llenarla

  // Filtrar los productos por página actual
  const inicio = (paginaActual - 1) * productosPorPagina;
  const fin = inicio + productosPorPagina;
  const productosPagina = listaProductos.slice(inicio, fin); // Tomar solo los productos de la página actual

  // Recorrer los productos y agregar cada uno a la tabla
  productosPagina.forEach(producto => {
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

  // Actualizar la paginación en la UI
  document.getElementById('paginaActualProductos').textContent = `Página ${paginaActual}`;
  document.getElementById('totalPaginasProductos').textContent = totalPaginas;
}


// Función para guardar un nuevo producto
function guardarNuevoProducto() {
  // Obtener los valores de los inputs
  const nombre = document.getElementById('nombreProducto').value.trim();
  const descripcion = document.getElementById('descripcionProducto').value.trim();
  const precio = parseFloat(document.getElementById('precioProducto').value.trim());
  const oferta = document.getElementById('ofertaProducto').checked;
  const precioOferta = oferta ? parseFloat(document.getElementById('precioProductoDescuento').value.trim()) : 0;

  // Verificar que los campos esenciales no estén vacíos
  if (nombre && descripcion && !isNaN(precio)) {
    // Crear un nuevo objeto producto
    const nuevoProducto = {
      id: idCounterProducto++, // Asignar un ID único
      nombre,
      descripcion,
      precio,
      oferta,
      precioOferta,
      categoriaId: categoriaSeleccionada // Asignar categoría seleccionada
    };

    // Agregar el producto al arreglo
    productos.push(nuevoProducto);

    // Llamar a la función para mostrar los productos de la categoría seleccionada
    if (categoriaSeleccionada !== null) {
      mostrarProductosCategoria(categoriaSeleccionada); // Actualizar tabla con productos de la categoría seleccionada
    } else {
      mostrarProductos(); // Mostrar todos los productos si no hay categoría activa
    }

    // Cerrar el modal
    cerrarModalAgregarProducto();
  } else {
    alert("Por favor, complete todos los campos correctamente.");
  }
}

// Función para mostrar los productos de una categoría específica
function mostrarProductosCategoria(categoriaId) {
  categoriaSeleccionada = categoriaId; // Guardar la categoría seleccionada
  const productosDeCategoria = productos.filter(p => p.categoriaId === categoriaId); // Filtrar los productos por categoría
  llenarTablaProductos(productosDeCategoria); // Llenar la tabla con los productos de esa categoría
}

// Función para mostrar todos los productos
function mostrarProductos() {
  // Mostrar todos los productos si no hay categoría seleccionada
  llenarTablaProductos(productos);
}

// Función para eliminar un producto
function eliminarProducto(productoId) {
  const indice = productos.findIndex(p => p.id === productoId);
  if (indice !== -1) {
    productos.splice(indice, 1);

    // Si estamos mostrando productos de una categoría, actualizamos la tabla
    if (categoriaSeleccionada !== null) {
      mostrarProductosCategoria(categoriaSeleccionada);
    } else {
      mostrarProductos(); // Mostrar todos los productos si no hay categoría activa
    }
  }
}




// Función de búsqueda de productos
function buscarProductos() {
  const filtro = document.getElementById('buscadorProducto').value.toLowerCase();

  productosFiltrados = productos.filter(producto => 
    producto.nombre.toLowerCase().includes(filtro) || 
    producto.descripcion.toLowerCase().includes(filtro)
  );

  // Si hay una categoría seleccionada, mostrar solo los productos de esa categoría
  if (categoriaSeleccionada !== null) {
    mostrarProductosCategoria(categoriaSeleccionada);
  } else {
    llenarTablaProductos(productosFiltrados); // Mostrar productos filtrados
  }
}








function ordenarPorNombreProducto() {
  productos.sort((a, b) => {
      if (a.nombre < b.nombre) return ordenAscendente ? -1 : 1;
      if (a.nombre > b.nombre) return ordenAscendente ? 1 : -1;
      return 0;
  });

  // Cambiar el texto del botón
  const boton = document.getElementById("ordenarBtn");
  if (ordenAscendente) {
      boton.innerHTML = "Ordenar Z-A";
  } else {
      boton.innerHTML = "Ordenar A-Z";
  }

  // Cambiar el estado del orden
  ordenAscendente = !ordenAscendente;

  // Mostrar los productos ordenados
  mostrarProductos();
}

// Función para filtrar productos por nombre
function filtrarProductos() {
  const filtro = document.getElementById('filtroNombre').value.toLowerCase();
  const productosFiltrados = productos.filter(producto => producto.nombre.toLowerCase().includes(filtro));

  // Mostrar los productos filtrados
  const tabla = document.getElementById('tablaProductos').getElementsByTagName('tbody')[0];
  tabla.innerHTML = ''; // Limpiar la tabla

  productosFiltrados.forEach(producto => {
      const row = tabla.insertRow();
      row.insertCell(0).textContent = producto.nombre;
      row.insertCell(1).textContent = producto.precio;
      row.insertCell(2).textContent = producto.categoria;
  });
}












function cambiarPaginaProductos(incremento) {
  const nuevaPagina = paginaActual + incremento;
  if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
    paginaActual = nuevaPagina;
    mostrarProductos(); // Actualizar la tabla con la nueva página
  }
}














// Función para cargar el submenú de categorías
function cargarSubmenuCategorias() {
  const submenu = document.getElementById('submenu-categorias');
  submenu.innerHTML = ''; // Limpiar el submenú

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


// Ejecutar cuando se cargue la página
// Ejecutar cuando se cargue la página
window.addEventListener('DOMContentLoaded', () => {
  cargarSubmenuCategorias(); // Cargar las categorías al iniciar
  mostrarProductos(); // Mostrar todos los productos al iniciar (sin filtro)
});


