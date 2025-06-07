let usuarios = [];
let usuariosFiltrados = [];
let paginaActual = 1;
const usuariosPorPagina = 3;
let usuarioAEliminarId = null; // IMPORTANTE: Definir variable global

// Obtener info usuario autenticado desde token guardado
async function obtenerUsuarioAutenticado() {
  const token = localStorage.getItem("access_token");
  if (!token) {
    console.warn("No hay token en localStorage"); // Consola: no token
    return null;
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/api/user-info/", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      console.error(`Error en user-info: ${response.status}`); // Consola: error en user-info con status
      return null;
    }

    return await response.json();

  } catch (error) {
    console.error("Error al obtener info del usuario:", error); // Consola: error en fetch
    return null;
  }
}

// Cargar usuarios
async function cargarUsuarios() {
  const token = localStorage.getItem("access_token");
  if (!token) {
    alert("No autenticado"); // Alerta: no autenticado
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/api/users/", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    if (!response.ok) {
      alert("Error al cargar usuarios"); // Alerta: error al cargar usuarios
      return;
    }
    usuarios = await response.json();
    usuariosFiltrados = [...usuarios];
    mostrarUsuarios(paginaActual);

  } catch (error) {
    console.error("Error al cargar usuarios:", error); // Consola: error fetch usuarios
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
    fila.innerHTML = `<td colspan="6" class="text-center">No se encontraron usuarios</td>`; // Mensaje tabla: no usuarios encontrados
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
        <button class="btn-admin-desing-edit" data-id="${usuario.id}"><i class="fas fa-edit"></i></button>
        <button class="btn-admin-desing-delete" data-id="${usuario.id}"><i class="fas fa-trash-alt"></i></button>
      </td>
    `;
    tbody.appendChild(fila);
  });

  // Asociar eventos a los botones eliminar después de renderizar
  document.querySelectorAll(".btn-admin-desing-delete").forEach(boton => {
    boton.addEventListener("click", (e) => {
      const idUsuario = e.currentTarget.getAttribute("data-id");
      eliminarUsuario(idUsuario);
    });
  });

  actualizarPaginacion();
  actualizarContadores();
}

document.addEventListener("DOMContentLoaded", async () => {
  const usuario = await obtenerUsuarioAutenticado();

  if (!usuario) {
    alert("No estás autenticado. Por favor inicia sesión."); // Alerta: no autenticado
    window.location.href = "/login";
    return;
  }

  if (!usuario.is_superuser) {
    alert("No tienes permisos para acceder a esta sección"); // Alerta: sin permisos
    document.querySelector(".admin-table").style.display = "none";
    document.getElementById("buscador").style.display = "none";
    document.getElementById("paginaAnterior").style.display = "none";
    document.getElementById("paginaSiguiente").style.display = "none";
    return;
  }

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

  // Asociar botones del modal
  document.getElementById("btnConfirmarEliminar")?.addEventListener("click", confirmarEliminacion);
  document.getElementById("btnCancelarEliminar")?.addEventListener("click", cancelarEliminacion);
});

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

  contadorElement.textContent = `Mostrando ${inicio} a ${fin} de ${totalUsuarios} usuarios`; // Texto contador usuarios
}

function buscarUsuarios() {
  const texto = document.getElementById("buscador")?.value.toLowerCase() || "";

  usuariosFiltrados = usuarios.filter(usuario =>
    usuario.id.toString().includes(texto) ||
    usuario.username?.toLowerCase().includes(texto) ||
    usuario.email?.toLowerCase().includes(texto) ||
    usuario.phoneUser?.toLowerCase().includes(texto)
  );

  paginaActual = 1;
  mostrarUsuarios(paginaActual);
}

// Modal de confirmación
function eliminarUsuario(id) {
  usuarioAEliminarId = id;
  const modal = document.getElementById("modalConfirmacion");
  if (modal) modal.style.display = "block"; // Mostrar modal
}

function cancelarEliminacion() {
  const modal = document.getElementById("modalConfirmacion");
  if (modal) modal.style.display = "none"; // Ocultar modal
  usuarioAEliminarId = null;
}

async function confirmarEliminacion() {
  if (!usuarioAEliminarId) return;

  const token = localStorage.getItem("access_token");

  try {
    const response = await fetch(`http://127.0.0.1:8000/api/users/${usuarioAEliminarId}/`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (response.ok) {
      alert("Usuario eliminado correctamente");
      await cargarUsuarios();
    } else {
      const data = await response.json();
      alert(data.error || "Error al eliminar el usuario");
    }

  } catch (error) {
    console.error("Error al eliminar usuario:", error); // Consola: error eliminar usuario
  } finally {
    cancelarEliminacion();
  }
}

// Cerrar modal al hacer clic fuera de él
window.addEventListener("click", function (e) {
  const modal = document.getElementById("modalConfirmacion");
  if (e.target === modal) {
    cancelarEliminacion(); // Ocultar modal al hacer clic fuera
  }
});

// Cerrar modal con tecla Escape
window.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    cancelarEliminacion(); // Ocultar modal con tecla Escape
  }
});




// Al cargar el usuario para editar:
document.addEventListener("click", async function (event) {
  if (event.target.closest(".btn-admin-desing-edit")) {
    const idUsuario = event.target.closest(".btn-admin-desing-edit").getAttribute("data-id");
    const token = localStorage.getItem("access_token");

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/users/${idUsuario}/`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Error al obtener datos del usuario");

      const usuario = await res.json();

      document.getElementById("modalEditar").style.display = "block";

      document.getElementById("nombreEditar").value = usuario.username || "";
      // Aquí asignamos ageUser al campo 'apellidoEditar' (años)
      document.getElementById("apellidoEditar").value = usuario.ageUser || "";  
      document.getElementById("correoEditar").value = usuario.email || "";
      document.getElementById("telefonoEditar").value = usuario.phoneUser || "";
      document.getElementById("contrasenaEditar").value = ""; // Nunca mostramos contraseñas

      document.getElementById("modalEditar").dataset.userId = usuario.id; // Guardamos ID en modal

    } catch (err) {
      console.error("Error cargando usuario para editar:", err);
      alert("No se pudo cargar la información del usuario");
    }
  }
});

// Guardar cambios:
async function guardarCambios() {
  const token = localStorage.getItem("access_token");
  const id = document.getElementById("modalEditar").dataset.userId;

  // Aquí parseamos ageUser a número entero (o cadena si prefieres)
  const ageUserValue = parseInt(document.getElementById("apellidoEditar").value.trim(), 10);

  if (isNaN(ageUserValue) || ageUserValue < 0) {
    alert("Por favor ingresa un número válido para Años");
    return;
  }

  const data = {
    username: document.getElementById("nombreEditar").value.trim(),
    email: document.getElementById("correoEditar").value.trim(),
    phoneUser: document.getElementById("telefonoEditar").value.trim(),
    ageUser: ageUserValue,
    password: document.getElementById("contrasenaEditar").value.trim(),
  };

  // No enviar password vacío para no resetearla
  if (!data.password) delete data.password;

  try {
    const res = await fetch(`http://127.0.0.1:8000/api/users/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      alert("Usuario actualizado correctamente");
      document.getElementById("modalEditar").style.display = "none";
      await cargarUsuarios(); // refresca la tabla
    } else {
      const err = await res.json();
      console.error("Error al actualizar:", err);
      alert("Error al actualizar usuario: " + (err.detail || res.status));
    }

  } catch (error) {
    console.error("Error al enviar actualización:", error);
    alert("Fallo al actualizar usuario");
  }
}

function cerrarModal() {
  document.getElementById("modalEditar").style.display = "none";
}
