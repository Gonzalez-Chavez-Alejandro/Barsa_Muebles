//--------------------



  
  let categoriasPorPagina = 25;
  let paginaCategoria = 1;
  let categoriaEditando = null;
  let categoriaAEliminar = null;
  

  function mostrarCategorias() {
    const tbody = document.getElementById('tablaCategorias');
    tbody.innerHTML = '';
  
    const inicio = (paginaCategoria - 1) * categoriasPorPagina;
    const fin = inicio + categoriasPorPagina;
    const categoriasAMostrar = categorias.slice(inicio, fin);
  
    categoriasAMostrar.forEach((cat, index) => {
      const fila = document.createElement('tr');
      fila.innerHTML = fila.innerHTML = `
      <td>${cat.id}</td>
      <td>${cat.nombre}</td>
      <td>${cat.descripcion}</td>
      <td><img src="${cat.imagen}" alt="${cat.nombre}" style="width: 80px; height: auto;"/></td>
      <td>
        <button class="edit-btn-producto" onclick="abrirModalEditarCategoria(${inicio + index})">
          <i class="fas fa-edit"></i>
          <a class="button-table"></a>
        </button>
        <button class="delete-btn-producto" onclick="abrirModalEliminarCategoria(${inicio + index})">
          <i class="fas fa-trash-alt"></i>
          <a class="button-table"></a>
        </button>
      </td>
    `;
    
      tbody.appendChild(fila);
    });
  
    document.getElementById('paginaActualCategoria').textContent = `Página ${paginaCategoria}`;
    document.getElementById('totalPaginasCategoria').textContent = `de ${Math.ceil(categorias.length / categoriasPorPagina)}`;
  }
  
  function cambiarPaginaCategoria(direccion) {
    const totalPaginas = Math.ceil(categorias.length / categoriasPorPagina);
    paginaCategoria += direccion;
  
    if (paginaCategoria < 1) paginaCategoria = 1;
    if (paginaCategoria > totalPaginas) paginaCategoria = totalPaginas;
  
    mostrarCategorias();
  }
  
  function abrirModalAgregarCategoria() {
    document.getElementById('modalAgregarCategoria').style.display = 'flex';
  }
  
  function abrirModalEditarCategoria(index) {
    categoriaEditando = index; // Aquí se asigna el índice
    document.getElementById('editarNombreCategoria').value = categorias[index].nombre;
    document.getElementById('editarDescripcionCategoria').value = categorias[index].descripcion;
    document.getElementById('editarImagenCategoria').value = categorias[index].imagen || '' ; // Si no hay imagen, dejar vacío
    document.getElementById('modalEditarCategoria').style.display = 'flex';
  }
  
  
  function cerrarModalEditarCategoria() {
    document.getElementById('modalEditarCategoria').style.display = 'none';
  }
  function cerrarModalEliminarCategoria() {
    document.getElementById('modalEliminarCategoria').style.display = 'none';
  }
  
  function abrirModalEliminarCategoria(index) {
    categoriaAEliminar = index;
    document.getElementById('modalEliminarCategoria').style.display = 'flex';
  }

  function cerrarModalAgregarCategoria() {
    document.getElementById('modalAgregarCategoria').style.display = 'none';
  }
  
  
  function guardarCategoria() {
    const nombre = document.getElementById('nombreCategoria').value.trim();
    const descripcion = document.getElementById('descripcionCategoria').value.trim();
    const imagen = document.getElementById('imagenCategoria')?.value.trim() || ""; // opcional
  
    if (nombre && descripcion) {
      categorias.push({
        id: idCounterCategoria++,
        nombre,
        descripcion,
        imagen
      });
      cerrarModalAgregarCategoria();
      mostrarCategorias();
    }
  }
  
  
  
  function guardarEdicionCategoria() {
    const nombre = document.getElementById('editarNombreCategoria').value.trim();
    const descripcion = document.getElementById('editarDescripcionCategoria').value.trim();
    
    // Obtener el valor de la imagen. Si está vacío, mantener la imagen original.
    const imagen = document.getElementById('editarImagenCategoria')?.value.trim() || categorias[categoriaEditando].imagen;
    
    // Validar los campos y editar la categoría
    if (nombre && descripcion && categoriaEditando !== null) {
      categorias[categoriaEditando] = {
        id: categorias[categoriaEditando].id, // conservar el ID original
        nombre,
        descripcion,
        imagen // mantener o actualizar la imagen
      };
      cerrarModalEditarCategoria();
      mostrarCategorias();
    }
  }
  
  
  
  function confirmarEliminarCategoria() {
    if (categoriaAEliminar !== null) {
      categorias.splice(categoriaAEliminar, 1);
      cerrarModalEliminarCategoria();
      mostrarCategorias();
    }
  }
  
  // Mostrar al cargar
  window.onload = mostrarCategorias;
  // Función para abrir el modal de edición


// Función para cerrar el modal de edición
function cerrarModal() {
  document.getElementById('modalEditar').style.display = 'none'; // Cerrar el modal
}




// Selecciona el tbody



