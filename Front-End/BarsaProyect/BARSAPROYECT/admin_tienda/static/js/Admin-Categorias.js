let paginaActualCategoria = 1;
let itemsPorPaginaCategoria = 10;


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

// Obtener una categoría por ID
function obtenerCategoriaPorId(id) {
  return window.categorias.find(cat => cat.id === id);
}

// Guardar nueva categoría
function guardarCategoria() {
  const nombre = document.getElementById("nombreCategoria").value.trim();
  const descripcion = document.getElementById("descripcionCategoria").value.trim();
  const imagen = document.getElementById("imagenCategoria").value.trim();

  if (!nombre || !descripcion || !imagen) {
    alert("Todos los campos son obligatorios.");
    return;
  }

  const nuevaCategoria = {
    id: idCounterCategoria++,
    nombre,
    descripcion,
    imagen
  };

  window.categorias.push(nuevaCategoria);
  cerrarModalAgregarCategoria();
  mostrarCategorias();
}

// Guardar edición
function guardarEdicionCategoria() {
  const id = window.categoriaIdEditando;
  const categoria = obtenerCategoriaPorId(id);
  if (!categoria) return;

  const nombre = document.getElementById("editarNombreCategoria").value.trim();
  const descripcion = document.getElementById("editarDescripcionCategoria").value.trim();
  const imagen = document.getElementById("editarImagenCategoria").value.trim();

  if (!nombre || !descripcion || !imagen) {
    alert("Todos los campos son obligatorios.");
    return;
  }

  categoria.nombre = nombre;
  categoria.descripcion = descripcion;
  categoria.imagen = imagen;

  cerrarModalEditarCategoria();
  mostrarCategorias();
}

// Eliminar categoría
function eliminarCategoriaPorId(id) {
  window.categorias = window.categorias.filter(cat => cat.id !== id);
  mostrarCategorias();
}

// Mostrar categorías al cargar
document.addEventListener("DOMContentLoaded", mostrarCategorias);

/* ---------------------- MODALES ---------------------- */

function abrirModalAgregarCategoria() {
  document.getElementById("modalAgregarCategoria").style.display = "block";
}

function cerrarModalAgregarCategoria() {
  document.getElementById("modalAgregarCategoria").style.display = "none";
}

function editarCategoria(id) {
  const categoria = obtenerCategoriaPorId(id);
  if (!categoria) return;

  document.getElementById("editarNombreCategoria").value = categoria.nombre;
  document.getElementById("editarDescripcionCategoria").value = categoria.descripcion;
  document.getElementById("editarImagenCategoria").value = categoria.imagen;

  window.categoriaIdEditando = id;
  document.getElementById("modalEditarCategoria").style.display = "block";
}

function cerrarModalEditarCategoria() {
  document.getElementById("modalEditarCategoria").style.display = "none";
}

function eliminarCategoria(id) {
  window.categoriaIdAEliminar = id;
  document.getElementById("modalEliminarCategoria").style.display = "block";
}

function cerrarModalEliminarCategoria() {
  document.getElementById("modalEliminarCategoria").style.display = "none";
}

function confirmarEliminarCategoria() {
  const id = window.categoriaIdAEliminar;
  eliminarCategoriaPorId(id);
  cerrarModalEliminarCategoria();
}

// Cerrar modal al hacer clic fuera
window.onclick = function (event) {
  const modales = [
    "modalAgregarCategoria",
    "modalEditarCategoria",
    "modalEliminarCategoria"
  ];

  modales.forEach(id => {
    const modal = document.getElementById(id);
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
};



document.getElementById('subirImagen').addEventListener('change', function(e) {
  const archivo = e.target.files[0];
  const boton = document.getElementById('imagenCategoriaBtn');
  
  if (!archivo) {
    boton.style.backgroundImage = '';
    boton.classList.remove('has-image');
    return;
  }

  const lector = new FileReader();
  lector.onload = function(e) {
    boton.style.backgroundImage = `url('${e.target.result}')`;
    boton.classList.add('has-image');
    document.getElementById('imagenCategoria').value = e.target.result;
  };
  lector.readAsDataURL(archivo);
});



document.getElementById('inputImagenArchivo').addEventListener('change', function(e) {
  const archivo = e.target.files[0];
  const boton = document.getElementById('imagenCategoriaBtn');

  if (!archivo) {
    boton.style.backgroundImage = '';
    boton.classList.remove('has-image');
    return;
  }

  const lector = new FileReader();
  lector.onload = function(e) {
    boton.style.backgroundImage = `url('${e.target.result}')`;
    boton.classList.add('has-image');
    document.getElementById('editarImagenCategoria').value = e.target.result;
  };
  lector.readAsDataURL(archivo);
});
