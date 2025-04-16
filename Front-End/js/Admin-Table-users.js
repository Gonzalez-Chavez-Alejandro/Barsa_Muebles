// Variables globales
let ordenAscendente = true; 
let usuariosPorPagina = 5; 
let paginaActual = 1; 
let usuarios = [
  { nombre: 'Juan Pérez', correo: 'juan@correo.com', telefono: '1234567890', contrasena: '1234' },
  { nombre: 'Ana Gómez', correo: 'ana@correo.com', telefono: '0987654321', contrasena: '5678' },
  { nombre: 'Carlos Ruiz', correo: 'carlos@correo.com', telefono: '1122334455', contrasena: 'abcd' },
  { nombre: 'Laura Martínez', correo: 'laura@correo.com', telefono: '5566778899', contrasena: 'efgh' },
  { nombre: 'Pedro Sánchez', correo: 'pedro@correo.com', telefono: '6677889900', contrasena: 'ijkl' },
  { nombre: 'María López', correo: 'maria@correo.com', telefono: '2233445566', contrasena: 'mnop' },
  { nombre: 'José Pérez', correo: 'jose@correo.com', telefono: '3344556677', contrasena: 'qrst' }
];

// Cambiar de página
function mostrarUsuarios(pagina = 1) {
  const tbody = document.querySelector('.admin-table tbody');
  tbody.innerHTML = '';

  const inicio = (pagina - 1) * usuariosPorPagina;
  const fin = inicio + usuariosPorPagina;
  const usuariosPagina = usuariosFiltrados.slice(inicio, fin);

  usuariosPagina.forEach((usuario, index) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${usuario.nombre}</td>
      <td>${usuario.correo}</td>
      <td>${usuario.telefono}</td>
      <td data-password="${usuario.contrasena}">*******</td>
      <td>
        <button class="edit-btn"><i class="fas fa-edit"></i> Editar</button>
        <button class="delete-btn"><i class="fas fa-trash-alt"></i> Eliminar</button>
      </td>`;
  
    // Obtener el índice real en el array original (usuarios)
    const realIndex = usuarios.findIndex(u =>
      u.nombre === usuario.nombre &&
      u.correo === usuario.correo &&
      u.telefono === usuario.telefono &&
      u.contrasena === usuario.contrasena
    );
  
    fila.querySelector('.edit-btn').addEventListener('click', () => abrirModal(realIndex));
    fila.querySelector('.delete-btn').addEventListener('click', () => eliminarUsuario(realIndex));
  
    tbody.appendChild(fila);
  });
  

  actualizarPaginacion();
}

function actualizarPaginacion() {
  const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina);
  document.getElementById('paginaActual').textContent = `Página ${paginaActual}`;
  document.getElementById('totalPaginas').textContent = `de ${totalPaginas}`;

  document.getElementById('paginaAnterior').disabled = paginaActual === 1;
  document.getElementById('paginaSiguiente').disabled = paginaActual === totalPaginas;
}


window.addEventListener('DOMContentLoaded', () => {
  mostrarUsuarios(paginaActual);
});

// Cambiar de página
function cambiarPagina(direccion) {
  const totalPaginas = Math.ceil(usuarios.length / usuariosPorPagina);
  paginaActual += direccion;

  if (paginaActual < 1) paginaActual = 1;
  if (paginaActual > totalPaginas) paginaActual = totalPaginas;

  mostrarUsuarios(paginaActual);
  document.getElementById('paginaAnterior').disabled = paginaActual === 1;
  document.getElementById('paginaSiguiente').disabled = paginaActual === totalPaginas;
}

// Función para abrir el modal de edición
function abrirModal(index) {
  const usuario = usuarios[index];
  document.getElementById('nombreEditar').value = usuario.nombre;
  document.getElementById('correoEditar').value = usuario.correo;
  document.getElementById('telefonoEditar').value = usuario.telefono;
  document.getElementById('contrasenaEditar').value = usuario.contrasena;
  document.getElementById('modalEditar').setAttribute('data-index', index);
  document.getElementById('modalEditar').style.display = 'block';
}

// Función para cerrar el modal
function cerrarModal() {
  document.getElementById('modalEditar').style.display = 'none';
}

// Función para guardar cambios
function guardarCambios() {
  const index = parseInt(document.getElementById('modalEditar').getAttribute('data-index'));
  const nombre = document.getElementById('nombreEditar').value;
  const correo = document.getElementById('correoEditar').value;
  const telefono = document.getElementById('telefonoEditar').value;
  const contrasena = document.getElementById('contrasenaEditar').value;

  usuarios[index] = { nombre, correo, telefono, contrasena };
  mostrarUsuarios(paginaActual);
  cerrarModal();
}

// Función para eliminar un usuario
function eliminarUsuario(index) {
  usuarios.splice(index, 1);
  mostrarUsuarios(paginaActual);
}

// Función para buscar usuarios
function buscarUsuarios() {
  const filtro = document.getElementById('buscador').value.toLowerCase();
  const usuariosFiltrados = usuarios.filter(usuario => usuario.nombre.toLowerCase().includes(filtro));
  mostrarUsuarios(1);
}

// Asignar eventos a los botones de paginación
document.getElementById('paginaAnterior').addEventListener('click', () => cambiarPagina(-1));
let usuariosFiltrados = [...usuarios]; // Copia inicial

function buscarUsuarios() {
  const filtro = document.getElementById('buscador').value.toLowerCase();

  usuariosFiltrados = usuarios.filter(usuario => 
    usuario.nombre.toLowerCase().includes(filtro) || 
    usuario.correo.toLowerCase().includes(filtro)
  );

  paginaActual = 1; // Reiniciar a la primera página
  mostrarUsuarios(paginaActual);
}

function ordenarPorNombre() {
  ordenAscendente = !ordenAscendente;

  usuariosFiltrados.sort((a, b) => {
    if (a.nombre.toLowerCase() < b.nombre.toLowerCase()) return ordenAscendente ? -1 : 1;
    if (a.nombre.toLowerCase() > b.nombre.toLowerCase()) return ordenAscendente ? 1 : -1;
    return 0;
  });

  mostrarUsuarios(paginaActual);
}
window.addEventListener('DOMContentLoaded', () => {
  usuariosFiltrados = [...usuarios];
  mostrarUsuarios(paginaActual);
});
function eliminarUsuario(index) {
  const usuario = usuarios[index];
  const confirmar = confirm(`¿Estás seguro de que deseas eliminar a ${usuario.nombre}?`);

  if (confirmar) {
    usuarios.splice(index, 1);
    usuariosFiltrados = usuariosFiltrados.filter((u, i) => i !== index); // actualizar copia filtrada
    mostrarUsuarios(paginaActual);
  }
}
let indicePendienteEliminar = null;

function eliminarUsuario(index) {
  const usuario = usuarios[index];
  indicePendienteEliminar = index;

  document.getElementById('mensajeConfirmacion').textContent = `¿Estás seguro de que deseas eliminar a ${usuario.nombre}?`;
  document.getElementById('modalConfirmacion').style.display = 'flex';
}

document.getElementById('btnConfirmarEliminar').addEventListener('click', () => {
  if (indicePendienteEliminar !== null) {
    usuarios.splice(indicePendienteEliminar, 1);
    usuariosFiltrados = [...usuarios]; // Asegura que se actualice la lista
    mostrarUsuarios(paginaActual);
    indicePendienteEliminar = null;
  }
  document.getElementById('modalConfirmacion').style.display = 'none';
});

document.getElementById('btnCancelarEliminar').addEventListener('click', () => {
  document.getElementById('modalConfirmacion').style.display = 'none';
  indicePendienteEliminar = null;
});
