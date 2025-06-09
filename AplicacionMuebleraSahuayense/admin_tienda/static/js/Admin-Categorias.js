let categoriaNombreSeleccionada = null;
let paginaActualCategoria = 1;
let itemsPorPaginaCategoria = 10;

// Función para obtener imagen placeholder segura
function getPlaceholderImage(text = 'Imagen no disponible', width = 80, height = 80) {
  return `https://dummyimage.com/${width}x${height}/cccccc/969696&text=${encodeURIComponent(text)}`;
}

// Función para validar y normalizar URLs de imágenes
function normalizeImageUrl(url) {
    if (!url) return '';

    // Si ya es una URL completa de Cloudinary válida, no la modifiques
    if (url.startsWith('https://res.cloudinary.com/')) {
        return url;
    }

    // Si viene algo raro (como image/upload/https://...), intenta limpiar
    if (url.includes('https://res.cloudinary.com/')) {
        const index = url.indexOf('https://res.cloudinary.com/');
        return url.slice(index);
    }

    // Si es una ruta relativa, prepende base URL
    return `https://res.cloudinary.com/dacrpsl5p/image/upload/${url}`;
}


// Función para cargar categorías desde la API
async function cargarCategorias() {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    alert("No estás autenticado");
    return;
  }

  try {
    const response = await fetch('/categorias/consulta/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('No se pudieron obtener las categorías');
    }

    const data = await response.json();

    window.categorias = data.map(cat => {
      const imagenFinal = normalizeImageUrl(cat.imagenCategory || '');
      console.log(`[DEBUG] Categoría: ${cat.nameCategory}, Imagen original: ${cat.imagenCategory}, Imagen final: ${imagenFinal}`);

      return {
        id: cat.nameCategory,
        nombre: cat.nameCategory,
        descripcion: cat.descriptionCategory,
        imagen: imagenFinal
      };
    });


    mostrarCategorias();
  } catch (error) {
    console.error('Error al cargar categorías:', error);
    alert('Error al cargar categorías: ' + error.message);
  }
}

// Mostrar categorías en la tabla
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
            <td>${categoria.nombre}</td>
            <td>${categoria.descripcion}</td>
            <td>
                <img src="${categoria.imagen || getPlaceholderImage()}" 
                     alt="${categoria.nombre}" 
                     width="80" 
                     style="border:1px solid #ccc;"
                     onerror="this.src='${getPlaceholderImage()}'">
            </td>
            <td class="acciones-categoria">
                <button class="btn-admin-desing-edits btn-editar-categoria" 
                    onclick="editarCategoria('${categoria.nombre}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-admin-desing-delete" onclick="eliminarCategoria('${categoria.nombre}')">
                    <i class="fas fa-trash-alt"></i>
                </button>
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

// Filtrar categorías
function filtrarCategorias() {
  paginaActualCategoria = 1;
  mostrarCategorias();
}

// Cambiar número de ítems por página
function cambiarItemsPorPagina() {
  const select = document.getElementById("itemsPorPagina");
  itemsPorPaginaCategoria = parseInt(select.value, 10);
  paginaActualCategoria = 1;
  mostrarCategorias();
}

// Cambiar página
function cambiarPaginaCategoria(direccion) {
  paginaActualCategoria += direccion;
  mostrarCategorias();
}

// Abrir modal para agregar categoría
function abrirModalAgregarCategoria() {
  document.getElementById('modalAgregarCategoria').style.display = 'block';
}

// Cerrar modal para agregar categoría
function cerrarModalAgregarCategoria() {
  document.getElementById('modalAgregarCategoria').style.display = 'none';
  document.getElementById('nombreCategoria').value = '';
  document.getElementById('descripcionCategoria').value = '';
  document.getElementById('subirImagen').value = '';
}

// Abrir modal para editar categoría
function editarCategoria(nombreCategoria) {
  const categoria = window.categorias.find(cat => cat.nombre === nombreCategoria);
  if (!categoria) {
    alert('Categoría no encontrada');
    return;
  }

  categoriaNombreSeleccionada = nombreCategoria;

  document.getElementById('editarNombreCategoria').value = categoria.nombre;
  document.getElementById('editarDescripcionCategoria').value = categoria.descripcion;
  document.getElementById('vistaPreviaEditarImagen').src = categoria.imagen || getPlaceholderImage();

  document.getElementById('modalEditarCategoria').style.display = 'block';
}

// Cerrar modal para editar categoría
function cerrarModalEditarCategoria() {
  document.getElementById('modalEditarCategoria').style.display = 'none';
  document.getElementById('editarNombreCategoria').value = '';
  document.getElementById('editarDescripcionCategoria').value = '';
  document.getElementById('editarImagenArchivo').value = '';
  document.getElementById('vistaPreviaEditarImagen').src = '';
  categoriaNombreSeleccionada = null;
}

// Guardar nueva categoría
async function guardarCategoria() {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    alert('No estás autenticado. Por favor inicia sesión.');
    return;
  }

  const nombre = document.getElementById('nombreCategoria').value.trim();
  const descripcion = document.getElementById('descripcionCategoria').value.trim();
  const imagenFile = document.getElementById('subirImagen').files[0];

  if (!nombre || !imagenFile) {
    alert('Nombre e imagen son obligatorios.');
    return;
  }

  const formData = new FormData();
  formData.append('nameCategory', nombre);
  formData.append('descriptionCategory', descripcion);
  formData.append('imagenCategory', imagenFile);

  try {
    const response = await fetch('/categorias/registro/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (response.ok) {
      alert('Categoría guardada con éxito');
      cerrarModalAgregarCategoria();
      await cargarCategorias();
    } else {
      const errorData = await response.json();
      alert('Error al guardar: ' + (errorData.message || JSON.stringify(errorData)));
    }
  } catch (error) {
    console.error('Error al guardar categoría:', error);
    alert('Error de conexión: ' + error.message);
  }
}

// Guardar edición de categoría
async function guardarEdicionCategorias() {
  const token = localStorage.getItem('accessToken');
  if (!token || !categoriaNombreSeleccionada) {
    alert('No estás autenticado o no hay categoría seleccionada');
    return;
  }

  const nuevoNombre = document.getElementById('editarNombreCategoria').value.trim();
  const descripcion = document.getElementById('editarDescripcionCategoria').value.trim();
  const imagenFile = document.getElementById('editarImagenArchivo').files[0];

  if (!nuevoNombre) {
    alert('El nombre de la categoría es obligatorio');
    return;
  }

  const formData = new FormData();
  formData.append('nameCategory', nuevoNombre);
  formData.append('descriptionCategory', descripcion);
  if (imagenFile) {
    formData.append('imagenCategory', imagenFile);
  }

  try {
    const response = await fetch(`/categorias/actualizar/${categoriaNombreSeleccionada}/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData
    });

    if (response.ok) {
      alert('Categoría actualizada con éxito');
      cerrarModalEditarCategoria();
      await cargarCategorias();
    } else {
      const errorData = await response.json();
      alert('Error al actualizarx: ' + (errorData.message || JSON.stringify(errorData)));
    }
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    alert('Error de conexión: ' + error.message);
  }
}

// Eliminar categoría
async function eliminarCategoria(nombreCategoria) {
  if (!confirm(`¿Estás seguro de que deseas eliminar la categoría "${nombreCategoria}"?`)) {
    return;
  }

  const token = localStorage.getItem('accessToken');
  if (!token) {
    alert('No estás autenticado. Por favor inicia sesión.');
    return;
  }

  try {
    const response = await fetch(`/categorias/actualizar/${nombreCategoria}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      alert('Categoría eliminada con éxito');
      await cargarCategorias();
    } else {
      const errorData = await response.json();
      alert('Error al eliminar: ' + (errorData.message || JSON.stringify(errorData)));
    }
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    alert('Error de conexión: ' + error.message);
  }
}

// Mostrar vista previa de imagen al seleccionar
document.getElementById('subirImagen').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      // Puedes mostrar la vista previa aquí si agregas un elemento img al modal de agregar
    };
    reader.readAsDataURL(file);
  }
});

document.getElementById('editarImagenArchivo').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      document.getElementById('vistaPreviaEditarImagen').src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// Inicialización cuando el DOM está listo
document.addEventListener("DOMContentLoaded", () => {
  cargarCategorias();

  // Asignar eventos
  document.getElementById('buscadorCategorias').addEventListener('input', filtrarCategorias);
  document.getElementById('btnAnterior').addEventListener('click', () => cambiarPaginaCategoria(-1));
  document.getElementById('btnSiguiente').addEventListener('click', () => cambiarPaginaCategoria(1));
  document.getElementById('btnGuardarCategoria').addEventListener('click', guardarCategoria);
  document.getElementById('itemsPorPagina').addEventListener('change', cambiarItemsPorPagina);

  const btnGuardarEdicion = document.querySelector('.btn-agregar-editar-categoria');
  if (btnGuardarEdicion) {
    btnGuardarEdicion.addEventListener('click', guardarEdicionCategorias);
  }
});