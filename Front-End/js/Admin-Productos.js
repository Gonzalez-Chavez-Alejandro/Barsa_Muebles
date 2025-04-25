let idCounterProductos= 1;
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
        <td>${producto.oferta ? 'Sí' : 'No'}</td>
        <td>${producto.oferta ? '$' + producto.precioOferta : '-'}</td>
        <td>
          <button onclick="AgregarImagenes(${producto.id})">Imagenes</button>
        </td>
        <td>
          <button onclick="editarProducto(${producto.id})">Editar</button>
          <button onclick="eliminarProducto(${producto.id})">Eliminar</button>
        </td>
      `;
      tabla.appendChild(tr);
    });
  }
  function mostrarProductosCategoria(idCategoria, nombreCategoria) {
    ocultarTodasLasSecciones();
  
    const productosDeCategoria = productos.filter(p => p.categoriaId === idCategoria); // si manejas eso
    llenarTablaProductos(productosDeCategoria);
  
    document.getElementById('productos').classList.add('activa');
    document.getElementById('categoria-titulo').textContent = `Productos de ${nombreCategoria}`;
    document.getElementById('categoria-id').value = idCategoria;
    document.getElementById('formulario-producto').classList.add('activa');
  }
  