// Variables globales
let ordenAscendente = true; 
let usuariosPorPagina = 5; 
let paginaActual = 1; 
let indiceUsuarioEditando = null;
let idCounter = 1;

let usuarios = [
  { id: idCounter++, nombre: 'Juan Pérez', correo: 'juan@correo.com', telefono: '1234567890', contrasena: '1234' },
  { id: idCounter++, nombre: 'Ana Gómez', correo: 'ana@correo.com', telefono: '0987654321', contrasena: '5678' },
  { id: idCounter++, nombre: 'Carlos Ruiz', correo: 'carlos@correo.com', telefono: '1122334455', contrasena: 'abcd' },
  { id: idCounter++, nombre: 'Laura Martínez', correo: 'laura@correo.com', telefono: '5566778899', contrasena: 'efgh' },
  { id: idCounter++, nombre: 'Pedro Sánchez', correo: 'pedro@correo.com', telefono: '6677889900', contrasena: 'ijkl' },
  { id: idCounter++, nombre: 'María López', correo: 'maria@correo.com', telefono: '2233445566', contrasena: 'mnop' },
  { id: idCounter++, nombre: 'José Pérez', correo: 'jose@correo.com', telefono: '3344556677', contrasena: 'qrst' }
];

let usuariosFiltrados = [...usuarios];

document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggleMenu");
  const menuLateral = document.getElementById("menuLateral");

  toggleBtn.addEventListener("click", () => {
    menuLateral.classList.toggle("hidden");
  });

  mostrarUsuarios(paginaActual);
});

function mostrarSeccion(id) {
  const secciones = document.querySelectorAll('.seccion');
  secciones.forEach(seccion => seccion.classList.remove('activa'));

  const seccionMostrada = document.getElementById(id);
  seccionMostrada.classList.add('activa');
}

function mostrarUsuarios(pagina = 1) {
  const tbody = document.querySelector('.admin-table tbody');
  tbody.innerHTML = '';

  const inicio = (pagina - 1) * usuariosPorPagina;
  const fin = inicio + usuariosPorPagina;
  const usuariosPagina = usuariosFiltrados.slice(inicio, fin);

  usuariosPagina.forEach((usuario) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${usuario.id}</td>
      <td>${usuario.nombre}</td>
      <td>${usuario.correo}</td>
      <td>${usuario.telefono}</td>
      <td data-password="${usuario.contrasena}">*******</td>
      <td>
        <button class="edit-btn"><i class="fas fa-edit"></i><a class="button-table">Editar</a></button>
        <button class="delete-btn"><i class="fas fa-trash-alt"></i><a class="button-table">Eliminar</a></button>
      </td>`;

    const index = usuarios.findIndex(u => u.id === usuario.id);
    fila.querySelector('.edit-btn').addEventListener('click', () => abrirModal(index));
    fila.querySelector('.delete-btn').addEventListener('click', () => eliminarUsuario(index));

    tbody.appendChild(fila);
  });

  actualizarPaginacion();
}

function actualizarPaginacion() {
  const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina);
  document.getElementById('paginaActual').textContent = `Página ${paginaActual}`;
  document.getElementById('totalPaginas').textContent = `${totalPaginas}`;

  document.getElementById('paginaAnterior').disabled = paginaActual === 1;
  document.getElementById('paginaSiguiente').disabled = paginaActual === totalPaginas;
}

function cambiarPagina(direccion) {
  const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina);
  paginaActual += direccion;
  if (paginaActual < 1) paginaActual = 1;
  if (paginaActual > totalPaginas) paginaActual = totalPaginas;

  mostrarUsuarios(paginaActual);
}

document.getElementById('paginaAnterior').addEventListener('click', () => cambiarPagina(-1));
document.getElementById('paginaSiguiente').addEventListener('click', () => cambiarPagina(1));

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

function buscarUsuarios() {
  const filtro = document.getElementById('buscador').value.toLowerCase();

  usuariosFiltrados = usuarios.filter(usuario => 
    usuario.nombre.toLowerCase().includes(filtro) || 
    usuario.correo.toLowerCase().includes(filtro)
  );

  paginaActual = 1;
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

// Guardar nuevo usuario
function guardarNuevoUsuario() {
  const nombre = document.getElementById('nombreNuevo').value;
  const correo = document.getElementById('correoNuevo').value;
  const telefono = document.getElementById('telefonoNuevo').value;
  const contrasena = document.getElementById('contrasenaNuevo').value;

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
  cerrarModalAgregar();
  alert("Usuario agregado correctamente");
}

function cerrarModalAgregar() {
  document.getElementById('modalAgregar').style.display = 'none';
}
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggleMenu");
  const menuLateral = document.getElementById("menuLateral");

  toggleBtn.addEventListener("click", () => {
    menuLateral.classList.toggle("hidden");
  });

  mostrarUsuarios(paginaActual);

  // ✅ Mostrar la sección de usuarios al cargar
  mostrarSeccion('usuarios');
});



mostrarUsuarios(paginaActual);