let categorias = [
    { id: "1",nombre: "Sofás", descripcion: "Sofás modernos y clásicos" },
    { nombre: "Comedores", descripcion: "Comedores de 4, 6 y 8 plazas" },
    { nombre: "Recámaras", descripcion: "Recámaras completas y modulares" },
    { nombre: "Salas", descripcion: "Salas en L, modulares, esquineras" },
    { nombre: "Escritorios", descripcion: "Escritorios para oficina y hogar" },
    { nombre: "Closets", descripcion: "Closets armables y empotrables" },
    { nombre: "Muebles TV", descripcion: "Muebles para centro de entretenimiento" }
  ];
  
  let categoriasPorPagina = 6;
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
      fila.innerHTML = `
        <td>${cat.nombre}</td>
        <td>${cat.descripcion}</td>
        <td>
          <button class="edit-btn" onclick="abrirModalEditarCategoria(${inicio + index})">
            <i class="fas fa-edit"></i>
            <a class="button-table">Editar</a>
          </button>
          <button class="delete-btn" onclick="abrirModalEliminarCategoria(${inicio + index})">
            <i class="fas fa-trash-alt"></i>
            <a class="button-table">Eliminar</a>
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
  
  function cerrarModalAgregarCategoria() {
    document.getElementById('modalAgregarCategoria').style.display = 'none';
  }
  
  function abrirModalEditarCategoria(index) {
    categoriaEditando = index;
    document.getElementById('editarNombreCategoria').value = categorias[index].nombre;
    document.getElementById('editarDescripcionCategoria').value = categorias[index].descripcion;
    document.getElementById('modalEditarCategoria').style.display = 'flex';
  }
  
  function cerrarModalEditarCategoria() {
    document.getElementById('modalEditarCategoria').style.display = 'none';
  }
  
  function abrirModalEliminarCategoria(index) {
    categoriaAEliminar = index;
    document.getElementById('modalEliminarCategoria').style.display = 'flex';
  }
  
  function cerrarModalEliminarCategoria() {
    document.getElementById('modalEliminarCategoria').style.display = 'none';
  }
  
  function guardarCategoria() {
    const nombre = document.getElementById('nombreCategoria').value.trim();
    const descripcion = document.getElementById('descripcionCategoria').value.trim();
  
    if (nombre && descripcion) {
      categorias.push({ nombre, descripcion });
      cerrarModalAgregarCategoria();
      mostrarCategorias();
    }
  }
  
  function guardarEdicionCategoria() {
    const nombre = document.getElementById('editarNombreCategoria').value.trim();
    const descripcion = document.getElementById('editarDescripcionCategoria').value.trim();
  
    if (nombre && descripcion && categoriaEditando !== null) {
      categorias[categoriaEditando] = { nombre, descripcion };
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
function abrirModal(index) {
  const usuario = usuarios[index];
  document.getElementById('nombreEditar').value = usuario.nombre;
  document.getElementById('correoEditar').value = usuario.correo;
  document.getElementById('telefonoEditar').value = usuario.telefono;
  document.getElementById('contrasenaEditar').value = usuario.contrasena;

  indiceUsuarioEditando = index; // Guardar el índice del usuario que estamos editando
  document.getElementById('modalEditar').style.display = 'block'; // Abrir el modal de edición
}

// Función para cerrar el modal de edición
function cerrarModal() {
  document.getElementById('modalEditar').style.display = 'none'; // Cerrar el modal
}

// Función para guardar los cambios realizados en un usuario
function guardarCambios() {
  if (indiceUsuarioEditando === null) return;

  // Actualizar los datos del usuario
  usuarios[indiceUsuarioEditando] = {
    nombre: document.getElementById("nombreEditar").value,
    correo: document.getElementById("correoEditar").value,
    telefono: document.getElementById("telefonoEditar").value,
    contrasena: document.getElementById("contrasenaEditar").value,
  };

  usuariosFiltrados = [...usuarios]; // Asegura que se actualice la lista filtrada
  mostrarUsuarios(paginaActual); // Refrescar la tabla
  cerrarModal(); // Cerrar el modal
}

// Función para agregar un nuevo usuario a la tabla
function agregarUsuarioATabla(usuario) {
  const tabla = document.querySelector('.admin-table tbody');
  const fila = document.createElement('tr');

  fila.innerHTML = `
    <td>${usuario.nombre}</td>
    <td>${usuario.correo}</td>
    <td>${usuario.telefono}</td>
    <td>${usuario.contrasena}</td>
    <td>
       <button class="edit-btn"><i class="fas fa-edit"></i> <a class="button-table">Editar</a></button>
       <button class="delete-btn"><i class="fas fa-trash-alt"></i><a class="button-table">Eliminar</a></button>
    </td>
  `;

  fila.querySelector('.edit-btn').addEventListener('click', () => abrirModal(usuarios.indexOf(usuario)));
  fila.querySelector('.delete-btn').addEventListener('click', () => eliminarUsuario(usuarios.indexOf(usuario)));

  tabla.appendChild(fila);
}

// Función para eliminar un usuario
function eliminarUsuario(index) {
  const usuario = usuarios[index];
  const confirmar = confirm(`¿Estás seguro de que deseas eliminar a ${usuario.nombre}?`);

  if (confirmar) {
    usuarios.splice(index, 1); // Eliminar el usuario del array
    usuariosFiltrados = [...usuarios]; // Asegurar que la lista filtrada esté actualizada
    mostrarUsuarios(paginaActual); // Refrescar la tabla
  }
}
