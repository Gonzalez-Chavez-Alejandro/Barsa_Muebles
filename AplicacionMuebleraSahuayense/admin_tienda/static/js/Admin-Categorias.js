/*let paginaActualCategoria = 1;
let itemsPorPaginaCategoria = 10;
let categoriaIdSeleccionada = null;

// Mostrar categorías en la tabla con paginación y filtrado
function mostrarCategorias() {
  const tbody = document.getElementById("tablaCategorias");
  tbody.innerHTML = "";

  const buscador = document.getElementById("buscadorCategorias").value.toLowerCase();

  const categoriasFiltradas = window.categorias.filter(cat =>
    cat.nombre.toLowerCase().includes(buscador) ||
    cat.descripcion.toLowerCase().includes(buscador)
  );

  const totalCategorias = categoriasFiltradas.length;
  const totalPaginas = Math.ceil(totalCategorias / itemsPorPaginaCategoria);

  if (paginaActualCategoria > totalPaginas) {
    paginaActualCategoria = totalPaginas > 0 ? totalPaginas : 1;
  }

  const inicio = (paginaActualCategoria - 1) * itemsPorPaginaCategoria;
  const fin = inicio + itemsPorPaginaCategoria;
  const categoriasPagina = categoriasFiltradas.slice(inicio, fin);

  categoriasPagina.forEach(categoria => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${categoria.id}</td>
      <td>${categoria.nombre}</td>
      <td>${categoria.descripcion}</td>
      <td><img src="${categoria.imagen}" alt="${categoria.nombre}" width="80"></td>
      <td>
        <button class="btn-admin-desing-edit" onclick="editarCategoria(${categoria.id})"><i class="fas fa-edit"></i></button>
        <button class="btn-admin-desing-delete" onclick="eliminarCategoria(${categoria.id})"><i class="fas fa-trash-alt"></i></button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById("resultadosInfo").textContent =
    `Mostrando ${categoriasPagina.length} de ${totalCategorias} categorías`;

  document.getElementById("paginaActualCategoria").textContent = `Página ${paginaActualCategoria}`;
  document.getElementById("totalPaginasCategoria").textContent = totalPaginas || 1;

  document.getElementById("btnAnterior").disabled = paginaActualCategoria <= 1;
  document.getElementById("btnSiguiente").disabled = paginaActualCategoria >= totalPaginas || totalPaginas === 0;
}

// Cambiar página actual
function cambiarPaginaCategoria(direccion) {
  const buscador = document.getElementById("buscadorCategorias").value.toLowerCase();
  const categoriasFiltradas = window.categorias.filter(cat =>
    cat.nombre.toLowerCase().includes(buscador) ||
    cat.descripcion.toLowerCase().includes(buscador)
  );

  const totalPaginas = Math.ceil(categoriasFiltradas.length / itemsPorPaginaCategoria);
  const nuevaPagina = paginaActualCategoria + direccion;

  if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
    paginaActualCategoria = nuevaPagina;
    mostrarCategorias();
  }
}

// Cambiar cantidad de ítems por página
function cambiarItemsPorPagina() {
  const select = document.getElementById("itemsPorPagina");
  itemsPorPaginaCategoria = parseInt(select.value);
  paginaActualCategoria = 1;
  mostrarCategorias();
}

// Filtrar categorías
function filtrarCategorias() {
  paginaActualCategoria = 1;
  mostrarCategorias();
}

// Cargar categorías desde API con token
async function cargarCategorias() {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('No estás autenticado. Por favor inicia sesión.');
      return;
    }

    const response = await fetch('/api/categorias/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

    const data = await response.json();
    window.categorias = data;
    mostrarCategorias();
  } catch (error) {
    console.error('Error al cargar categorías:', error);
  }
}

// Abrir modal eliminar
window.eliminarCategoria = function (id) {
  categoriaIdSeleccionada = id;
  abrirModalEliminarCategoria();
};

function abrirModalEliminarCategoria() {
  document.getElementById('modalEliminarCategoria').style.display = 'block';
}

function cerrarModalEliminarCategoria() {
  document.getElementById('modalEliminarCategoria').style.display = 'none';
}

// Confirmar eliminación categoría
async function confirmarEliminarCategoria() {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('No estás autenticado. Por favor, inicia sesión.');
      return;
    }

    const response = await fetch(`/api/categorias/${categoriaIdSeleccionada}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      alert('Categoría eliminada correctamente');
      cerrarModalEliminarCategoria();
      cargarCategorias();
    } else {
      const errorData = await response.json();
      alert(`No se pudo eliminar la categoría. ${errorData.detail || ''}`);
    }
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    alert('Error al eliminar la categoría.');
  }
}

// Abrir y cerrar modal agregar categoría
function abrirModalAgregarCategoria() {
  document.getElementById('modalAgregarCategoria').style.display = 'block';
}

function cerrarModalAgregarCategoria() {
  document.getElementById('modalAgregarCategoria').style.display = 'none';
}

// Guardar categoría (crear)
window.guardarCategoria = async function () {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    alert('No estás autenticado. Por favor, inicia sesión.');
    return;
  }

  const nombre = document.getElementById('nombreCategoria').value.trim();
  const descripcion = document.getElementById('descripcionCategoria').value.trim();
  const imagenInput = document.getElementById('subirImagen'); // ✅ CORREGIDO

  if (!nombre || !descripcion) {
    alert('Por favor, completa todos los campos obligatorios.');
    return;
  }

  const formData = new FormData();
  formData.append('nombre', nombre);
  formData.append('descripcion', descripcion);
  if (imagenInput.files.length > 0) {
    formData.append('imagen', imagenInput.files[0]);
  }

  try {
    const response = await fetch('/api/categorias/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.ok) {
      alert('Categoría guardada con éxito');
      cerrarModalAgregarCategoria();
      cargarCategorias();
      document.getElementById('nombreCategoria').value = '';
      document.getElementById('descripcionCategoria').value = '';
      imagenInput.value = '';
    } else {
      const errorData = await response.json();
      alert('Error al guardar categoría: ' + (errorData.detail || ''));
    }
  } catch (error) {
    console.error('Error al guardar categoría:', error);
    alert('Error al guardar la categoría.');
  }
};

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  cargarCategorias();

  document.getElementById('btnGuardarCategoria').addEventListener('click', function (e) {
    e.preventDefault();
    guardarCategoria();
  });
});






// Abrir modal para editar una categoría existente
window.editarCategoria = function (id) {
  const categoria = window.categorias.find(cat => cat.id === id);
  if (!categoria) {
    alert('Categoría no encontrada');
    return;
  }

  categoriaIdSeleccionada = id;
  document.getElementById('editarNombreCategoria').value = categoria.nombre;
  document.getElementById('editarDescripcionCategoria').value = categoria.descripcion;
  document.getElementById('editarImagenArchivo').value = ''; // Reset input file

  abrirModalEditarCategoria();
};

function abrirModalEditarCategoria() {
  document.getElementById('modalEditarCategoria').style.display = 'block';
}

function cerrarModalEditarCategoria() {
  document.getElementById('modalEditarCategoria').style.display = 'none';
}

// Guardar cambios a la categoría editada
async function guardarEdicionCategoria() {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    alert('No estás autenticado. Por favor inicia sesión.');
    return;
  }

  const nombre = document.getElementById('editarNombreCategoria').value.trim();
  const descripcion = document.getElementById('editarDescripcionCategoria').value.trim();
  const imagenInput = document.getElementById('editarImagenArchivo');

  if (!nombre || !descripcion) {
    alert('Por favor completa todos los campos obligatorios.');
    return;
  }

  const formData = new FormData();
  formData.append('nombre', nombre);
  formData.append('descripcion', descripcion);
  if (imagenInput.files.length > 0) {
    formData.append('imagen', imagenInput.files[0]);
  }

  try {
    const response = await fetch(`/api/categorias/${categoriaIdSeleccionada}/`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.ok) {
      alert('Categoría actualizada con éxito.');
      cerrarModalEditarCategoria();
      cargarCategorias();
    } else {
      const errorData = await response.json();
      alert('Error al editar categoría: ' + (errorData.detail || ''));
    }
  } catch (error) {
    console.error('Error al editar categoría:', error);
    alert('Error al editar la categoría.');
  }
}
  */