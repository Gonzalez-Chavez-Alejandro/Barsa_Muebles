// Variables globales para control de usuarios y paginación
let ordenAscendente = true;               // Controla el orden alfabético (ascendente/descendente)
let usuariosPorPagina = 6;                // Número de usuarios que se muestran por página
let paginaActual = 1;                     // Página que se está visualizando actualmente
let indiceUsuarioEditando = null;         // Índice del usuario que se está editando
let usuariosFiltrados = [...usuarios];    // Lista de usuarios filtrada por búsqueda
let indicePendienteEliminar = null;       // Índice del usuario pendiente por eliminar


// Mostrar sección
function mostrarSeccion(id) {
  const secciones = document.querySelectorAll('.seccion');
  secciones.forEach(seccion => seccion.classList.remove('activa'));
  document.getElementById(id).classList.add('activa');
}

// Mostrar usuarios en tabla con paginación
function mostrarUsuarios(pagina = 1) {
  const tbody = document.querySelector('.admin-table tbody');
  tbody.innerHTML = '';

  const inicio = (pagina - 1) * usuariosPorPagina;
  const fin = inicio + usuariosPorPagina;
  const usuariosPagina = usuariosFiltrados.slice(inicio, fin);

  usuariosPagina.forEach(usuario => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${usuario.id}</td>
      <td>${usuario.nombre}</td>
      <td>${usuario.correo}</td>
      <td>${usuario.telefono}</td>
      <td data-password="${usuario.contrasena}">*******</td>
      <td>
        <button class="btn-admin-desing-edit"><i class="fas fa-edit"></i></button>
        <button class="btn-admin-desing-delete"><i class="fas fa-trash-alt"></i></button>
      </td>`;

    const index = usuarios.findIndex(u => u.id === usuario.id);
    fila.querySelector('.btn-admin-desing-edit').addEventListener('click', () => abrirModal(index));
    fila.querySelector('.btn-admin-desing-delete').addEventListener('click', () => eliminarUsuario(index));

    tbody.appendChild(fila);
  });

  actualizarPaginacion();
}

// Actualizar controles de paginación (con texto correcto)
function actualizarPaginacion() {
  const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina);
  const indicador = document.getElementById('indicadorPaginacion');
  if (indicador) {
    indicador.textContent = `Página ${paginaActual} de ${totalPaginas}`;
  }

  document.getElementById('paginaAnterior').disabled = paginaActual === 1;
  document.getElementById('paginaSiguiente').disabled = paginaActual === totalPaginas;
}

// Cambiar página
function cambiarPagina(direccion) {
  const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina);
  if ((direccion === -1 && paginaActual > 1) || (direccion === 1 && paginaActual < totalPaginas)) {
    paginaActual += direccion;
    mostrarUsuarios(paginaActual);
  }
}

document.getElementById('paginaAnterior').addEventListener('click', () => cambiarPagina(-1));
document.getElementById('paginaSiguiente').addEventListener('click', () => cambiarPagina(1));

// Abrir modal editar
function abrirModal(index) {
  const usuario = usuarios[index];
  document.getElementById('nombreEditar').value = usuario.nombre;
  document.getElementById('correoEditar').value = usuario.correo;
  document.getElementById('telefonoEditar').value = usuario.telefono;
  document.getElementById('contrasenaEditar').value = usuario.contrasena;
  indiceUsuarioEditando = index;
  document.getElementById('modalEditar').style.display = 'block';
}

function cerrarModal() {
  document.getElementById('modalEditar').style.display = 'none';
}

function guardarCambios() {
  usuarios[indiceUsuarioEditando] = {
    ...usuarios[indiceUsuarioEditando],
    nombre: document.getElementById("nombreEditar").value,
    correo: document.getElementById("correoEditar").value,
    telefono: document.getElementById("telefonoEditar").value,
    contrasena: document.getElementById("contrasenaEditar").value,
  };
  usuariosFiltrados = [...usuarios];
  cerrarModal();
  mostrarUsuarios(paginaActual);
}

// Eliminar usuario
function eliminarUsuario(index) {
  const usuario = usuarios[index];
  indicePendienteEliminar = index;
  document.getElementById('mensajeConfirmacion').textContent = `¿Estás seguro de que deseas eliminar a ${usuario.nombre}?`;
  document.getElementById('modalConfirmacion').style.display = 'flex';
}

document.getElementById('btnConfirmarEliminar').addEventListener('click', () => {
  if (indicePendienteEliminar !== null) {
    usuarios.splice(indicePendienteEliminar, 1);
    usuariosFiltrados = [...usuarios];
    mostrarUsuarios(paginaActual);
    indicePendienteEliminar = null;
  }
  document.getElementById('modalConfirmacion').style.display = 'none';
});

document.getElementById('btnCancelarEliminar').addEventListener('click', () => {
  document.getElementById('modalConfirmacion').style.display = 'none';
  indicePendienteEliminar = null;
});

// Buscar usuarios
function buscarUsuarios() {
  const filtro = document.getElementById('buscador').value.toLowerCase();
  usuariosFiltrados = usuarios.filter(usuario =>
    usuario.nombre.toLowerCase().includes(filtro) ||
    usuario.correo.toLowerCase().includes(filtro)
  );
  paginaActual = 1;
  mostrarUsuarios(paginaActual);
}

// Ordenar por nombre
function ordenarPorNombre() {
  ordenAscendente = !ordenAscendente;
  usuariosFiltrados.sort((a, b) => {
    if (a.nombre.toLowerCase() < b.nombre.toLowerCase()) return ordenAscendente ? -1 : 1;
    if (a.nombre.toLowerCase() > b.nombre.toLowerCase()) return ordenAscendente ? 1 : -1;
    return 0;
  });
  mostrarUsuarios(paginaActual);
}

// Agregar nuevo usuario
function abrirModalAgregar() {
  document.getElementById('modalAgregarUsuario').style.display = 'block';
  document.getElementById('nombreNuevo').value = '';
  document.getElementById('correoNuevo').value = '';
  document.getElementById('telefonoNuevo').value = '';
  document.getElementById('contrasenaNuevo').value = '';

}

function cerrarModalAgregar() {
  const modal = document.getElementById('modalAgregarUsuario');
  if (modal) modal.style.display = 'none';
}

function guardarNuevo() {
  const nombre = document.getElementById('nombreNuevo').value.trim();
  const correo = document.getElementById('correoNuevo').value.trim();
  const telefono = document.getElementById('telefonoNuevo').value.trim();
  const contrasena = document.getElementById('contrasenaNuevo').value.trim();

  if (!nombre || !correo || !telefono || !contrasena) {
    alert("Por favor, complete todos los campos.");
    return;
  }

  const nuevoUsuario = {
    id: idCounter++,
    nombre,
    correo,
    telefono,
    contrasena
  };

  usuarios.push(nuevoUsuario);
  usuariosFiltrados = [...usuarios];
  mostrarUsuarios(paginaActual);
  cerrarModalAgregarUsuario()
  alert("Usuario agregado correctamente");
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("toggleMenu")?.addEventListener("click", () => {
    document.getElementById("menuLateral")?.classList.toggle("hidden");
  });

  mostrarUsuarios(paginaActual);

  document.getElementById('buscador')?.addEventListener('input', buscarUsuarios);
  document.getElementById('ordenarNombre')?.addEventListener('click', ordenarPorNombre);
  document.getElementById('btnAbrirAgregar')?.addEventListener('click', abrirModalAgregar);
  document.getElementById('btnCerrarAgregar')?.addEventListener('click', cerrarModalAgregar);
  document.getElementById('btnGuardarNuevo')?.addEventListener('click', guardarNuevo);
  document.getElementById('btnGuardarCambios')?.addEventListener('click', guardarCambios);
  document.getElementById('btnCerrarEditar')?.addEventListener('click', cerrarModal);
});

function cerrarModalAgregarUsuario() {
  cerrarModalAgregar();
}


// Cierra el modal de editar usuario
function cerrarModal() {
    document.getElementById('modalEditar').style.display = 'none';
}

// Cierra el modal de confirmación
function cerrarModalConfirmacion() {
    document.getElementById('modalConfirmacion').style.display = 'none';
}

// Cierra el modal de agregar usuario
function cerrarModalAgregarUsuario() {
    document.getElementById('modalAgregarUsuario').style.display = 'none';
}

// Versión alternativa que cierra cualquier modal por su ID
function cerrarCualquierModal(idModal) {
    document.getElementById(idModal).style.display = 'none';
}