function guardarCambios() {
    usuarios[indiceUsuarioEditando] = {
      nombre: document.getElementById("nombreEditar").value,
      correo: document.getElementById("correoEditar").value,
      telefono: document.getElementById("telefonoEditar").value,
      contrasena: document.getElementById("contrasenaEditar").value,
    };
  
    usuariosFiltrados = [...usuarios]; // Actualizar la lista filtrada
    cerrarModal();
    mostrarUsuarios(paginaActual);
  }
  
  // Función para agregar nuevo usuario
  function guardarNuevoUsuario() {
    // Obtener los valores de los inputs
    const nombre = document.getElementById('nombreNuevo').value;
    const correo = document.getElementById('correoNuevo').value;
    const telefono = document.getElementById('telefonoNuevo').value;
    const contrasena = document.getElementById('contrasenaNuevo').value;
  
    // Validación (puedes agregar más validaciones)
    if (!nombre || !correo || !telefono || !contrasena) {
      alert("Por favor, complete todos los campos.");
      return;
    }
  
    // Crear el nuevo usuario
    const nuevoUsuario = { nombre, correo, telefono, contrasena };
  
    // Agregarlo a la lista de usuarios
    usuarios.push(nuevoUsuario);
  
    // Mostrar el nuevo usuario en la tabla
    agregarUsuarioATabla(nuevoUsuario);
  
    // Mostrar mensaje de éxito y cerrar el modal
    alert('Usuario agregado correctamente');
    cerrarModalAgregar();
  }