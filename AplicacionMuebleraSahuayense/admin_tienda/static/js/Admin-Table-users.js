let usuarios = [];
let usuariosFiltrados = [];
let paginaActual = 1;
const usuariosPorPagina = 10;

// Obtener info usuario autenticado desde token guardado
async function obtenerUsuarioAutenticado() {
  const token = localStorage.getItem("access_token");  // Consistencia con tu login
  if (!token) {
    console.warn("No hay token en localStorage");
    return null;
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/api/user-info/", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      console.error(`Error en user-info: ${response.status}`);
      return null;
    }

    return await response.json();

  } catch (error) {
    console.error("Error al obtener info del usuario:", error);
    return null;
  }
}

// Cargar usuarios (aquí deberías hacer fetch a tu API que lista usuarios)
async function cargarUsuarios() {
  const token = localStorage.getItem("access_token");
  if (!token) {
    alert("No autenticado");
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/api/users/", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    if (!response.ok) {
      alert("Error al cargar usuarios");
      return;
    }
    usuarios = await response.json();
    usuariosFiltrados = [...usuarios];
    mostrarUsuarios(paginaActual);

  } catch (error) {
    console.error("Error al cargar usuarios:", error);
  }
}

function mostrarUsuarios(pagina = 1) {
  const tbody = document.querySelector(".admin-table tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  const inicio = (pagina - 1) * usuariosPorPagina;
  const fin = inicio + usuariosPorPagina;
  const usuariosPagina = usuariosFiltrados.slice(inicio, fin);

  if (usuariosPagina.length === 0) {
    const fila = document.createElement("tr");
    fila.innerHTML = `<td colspan="6" class="text-center">No se encontraron usuarios</td>`;
    tbody.appendChild(fila);
    return;
  }

  usuariosPagina.forEach(usuario => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
    <td>${usuario.id}</td>
    <td>${usuario.username}</td>
    <td>${usuario.email}</td>
    <td>${usuario.phoneUser || ''}</td>
    <td>*******</td>
    <td>
      <button class="btn-admin-desing-edit"><i class="fas fa-edit"></i></button>
      <button class="btn-admin-desing-delete"><i class="fas fa-trash-alt"></i></button>
    </td>
  `;
    tbody.appendChild(fila);
  });

  // Actualizar paginación y contadores si tienes esas funciones
  // actualizarPaginacion();
  // actualizarContadores();
}

// Eventos para paginación, búsquedas, etc.
// function paginaAnterior() { ... }
// function paginaSiguiente() { ... }
// function buscarUsuarios() { ... }

// Al cargar la página, verificar usuario y permisos
document.addEventListener("DOMContentLoaded", async () => {
  const usuario = await obtenerUsuarioAutenticado();

  if (!usuario) {
    alert("No estás autenticado. Por favor inicia sesión.");
    window.location.href = "/login"; // Opcional redirigir
    return;
  }

  if (!usuario.is_superuser) {
    alert("No tienes permisos para acceder a esta sección");
    document.querySelector(".admin-table").style.display = "none";
    document.getElementById("buscador").style.display = "none";
    document.getElementById("paginaAnterior").style.display = "none";
    document.getElementById("paginaSiguiente").style.display = "none";
    return;
  }

  // Si es admin, carga la tabla y activa controles
  cargarUsuarios();

  document.getElementById("paginaAnterior")?.addEventListener("click", () => {
    if (paginaActual > 1) {
      paginaActual--;
      mostrarUsuarios(paginaActual);
    }
  });

  document.getElementById("paginaSiguiente")?.addEventListener("click", () => {
    const maxPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina);
    if (paginaActual < maxPaginas) {
      paginaActual++;
      mostrarUsuarios(paginaActual);
    }
  });

  document.getElementById("buscador")?.addEventListener("input", (e) => {
    const texto = e.target.value.toLowerCase();
    usuariosFiltrados = usuarios.filter(u =>
      (u.nombre?.toLowerCase().includes(texto) || u.username?.toLowerCase().includes(texto)) ||
      (u.correo?.toLowerCase().includes(texto) || u.email?.toLowerCase().includes(texto)) ||
      (u.telefono?.toLowerCase().includes(texto) || u.phoneUser?.toLowerCase().includes(texto))
    );
    paginaActual = 1;
    mostrarUsuarios(paginaActual);
  });
});

/** 



function actualizarPaginacion() {
  const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina);
  document.getElementById("paginaAnterior").disabled = paginaActual <= 1;
  document.getElementById("paginaSiguiente").disabled = paginaActual >= totalPaginas;
}

function actualizarContadores() {
  const contadorElement = document.getElementById("contador-usuarios");
  if (!contadorElement) return;

  const totalUsuarios = usuariosFiltrados.length;
  const inicio = (paginaActual - 1) * usuariosPorPagina + 1;
  const fin = Math.min(paginaActual * usuariosPorPagina, totalUsuarios);

  contadorElement.textContent = `Mostrando ${inicio} a ${fin} de ${totalUsuarios} usuarios`;
}

function paginaAnterior() {
  if (paginaActual > 1) {
    paginaActual--;
    mostrarUsuarios(paginaActual);
  }
}

function paginaSiguiente() {
  const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina);
  if (paginaActual < totalPaginas) {
    paginaActual++;
    mostrarUsuarios(paginaActual);
  }
}

function buscarUsuarios() {
  const texto = document.getElementById("buscador").value.toLowerCase();

  usuariosFiltrados = usuarios.filter(u =>
    u.id.toString().includes(texto) ||
    u.nombre.toLowerCase().includes(texto) ||
    u.correo.toLowerCase().includes(texto) ||
    (u.telefono && u.telefono.toLowerCase().includes(texto))
  );

  paginaActual = 1;
  mostrarUsuarios(paginaActual);
}





// Navegación entre páginas
function paginaAnterior() {
  if (paginaActual > 1) {
    paginaActual--;
    mostrarUsuarios(paginaActual);
  }
}

function paginaSiguiente() {
  const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina);
  if (paginaActual < totalPaginas) {
    paginaActual++;
    mostrarUsuarios(paginaActual);
  }
}

// Búsqueda de usuarios
function buscarUsuarios() {
  const texto = document.getElementById("buscador")?.value.toLowerCase() || "";

  usuariosFiltrados = usuarios.filter(usuario =>
    usuario.nombre.toLowerCase().includes(texto) ||
    usuario.correo.toLowerCase().includes(texto) ||
    (usuario.telefono && usuario.telefono.toLowerCase().includes(texto)) ||
    usuario.id.toString().includes(texto)
  );

  paginaActual = 1;
  mostrarUsuarios(paginaActual);
}

// Funciones para eliminar usuario
function eliminarUsuario(id) {
  usuarioAEliminarId = id;
  const modal = document.getElementById("modalConfirmacion");
  if (modal) modal.style.display = "block";
}

function cancelarEliminacion() {
  const modal = document.getElementById("modalConfirmacion");
  if (modal) modal.style.display = "none";
  usuarioAEliminarId = null;
}

async function confirmarEliminacion() {
  if (!usuarioAEliminarId) return;

  try {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("No hay token de autenticación");

    const response = await fetch(`http://localhost:8000/usuarios/${usuarioAEliminarId}/`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (response.status === 404) {
      throw new Error("El usuario no existe o ya fue eliminado");
    }
    if (response.status === 403) {
      throw new Error("No tienes permisos para esta acción");
    }
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    // Recargar la lista
    await cargarUsuarios();

    // Cerrar modal y limpiar
    const modal = document.getElementById("modalConfirmacion");
    if (modal) modal.style.display = "none";
    usuarioAEliminarId = null;

    // Mostrar feedback al usuario
    mostrarMensaje("Usuario eliminado correctamente", "success");

  } catch (error) {
    console.error("Detalles del error:", error);
    mostrarMensaje(`Error al eliminar: ${error.message}`, "error");
  }
}

// Función auxiliar para mostrar mensajes
function mostrarMensaje(texto, tipo = "info") {
  const mensaje = document.getElementById("mensaje-usuario");
  if (!mensaje) return;

  mensaje.textContent = texto;
  mensaje.className = `mensaje-${tipo}`;
  mensaje.style.display = "block";

  setTimeout(() => {
    mensaje.style.display = "none";
  }, 5000);
}

// Función para abrir modal de edición (primer paso)
function abrirModalEdicion(id) {
  usuarioEditandoId = id;
  const usuario = usuarios.find(u => u.id === id);
  if (!usuario) {
    mostrarMensaje("Usuario no encontrado", "error");
    return;
  }

  const modal = document.getElementById("modalEditar");
  if (modal) modal.style.display = "block";

  // Rellenar inputs con datos actuales
  document.getElementById("nombreEditar").value = usuario.nombre.split(" ")[0] || "";
  const nombreCompleto = usuario.nombre.split(" ");
  const apellido = nombreCompleto.length > 1 ? nombreCompleto.slice(1).join(" ") : "";
  document.querySelector('#modalEditar input[placeholder*="Apellido"]').value = apellido;

  document.getElementById("correoEditar").value = usuario.correo || "";
  document.getElementById("telefonoEditar").value = usuario.telefono || "";
  document.getElementById("contrasenaEditar").value = ""; // Dejamos vacío
}

// Cerrar modal
function cerrarModal() {
  const modal = document.getElementById("modalEditar");
  if (modal) modal.style.display = "none";

  // Limpiar errores y campos de validación
  ["errorNombre", "errorapellido", "errorCorreo", "errorTelefono", "errorContrasena"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = "";
  });
}

// Guardar cambios (PATCH)
async function guardarCambios() {
  if (!usuarioEditandoId) return;

  const nombre = document.getElementById("nombreEditar").value.trim();
  const apellido = document.querySelector('#modalEditar input[placeholder*="Apellido"]').value.trim();
  const correo = document.getElementById("correoEditar").value.trim();
  const telefono = document.getElementById("telefonoEditar").value.trim();
  const contrasena = document.getElementById("contrasenaEditar").value.trim();

  // Validaciones simples
  let errores = false;
  if (nombre.length < 2) {
    document.getElementById("errorNombre").textContent = "Nombre muy corto";
    errores = true;
  } else {
    document.getElementById("errorNombre").textContent = "";
  }

  if (apellido.length < 2) {
    document.getElementById("errorapellido").textContent = "Apellido muy corto";
    errores = true;
  } else {
    document.getElementById("errorapellido").textContent = "";
  }

  if (!correo.includes("@")) {
    document.getElementById("errorCorreo").textContent = "Correo inválido";
    errores = true;
  } else {
    document.getElementById("errorCorreo").textContent = "";
  }

  if (telefono.length < 10) {
    document.getElementById("errorTelefono").textContent = "Teléfono inválido";
    errores = true;
  } else {
    document.getElementById("errorTelefono").textContent = "";
  }

  if (contrasena.length > 0 && contrasena.length < 6) {
    document.getElementById("errorContrasena").textContent = "La contraseña debe tener al menos 6 caracteres";
    errores = true;
  } else {
    document.getElementById("errorContrasena").textContent = "";
  }

  if (errores) return;

  const datosActualizar = {
    first_name: nombre,
    last_name: apellido,
    email: correo,
    phoneUser: telefono
  };
  if (contrasena.length > 0) {
    datosActualizar.password = contrasena;
  }

  try {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("No autenticado");

    const response = await fetch(`http://localhost:8000/usuarios/${usuarioEditandoId}/`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(datosActualizar)
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.detail || `Error ${response.status}`);
    }

    // Refrescar lista de usuarios
    await cargarUsuarios();

    mostrarMensaje("Usuario actualizado correctamente", "success");
    cerrarModal();
  } catch (error) {
    mostrarMensaje(`Error al actualizar: ${error.message}`, "error");
  }
}

// Cerrar modal si se hace click fuera del contenido
window.onclick = function(event) {
  const modal = document.getElementById("modalEditar");
  if (event.target === modal) {
    cerrarModal();
  }
};
*/