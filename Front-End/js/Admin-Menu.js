// Mostrar/ocultar submenús
function toggleSubmenu(button) {
  const li = button.parentElement;
  li.classList.toggle("activo");
}

// Mostrar/ocultar menú lateral en móviles
const botonMenu = document.getElementById("botonMenu");
const menuLateral = document.getElementById("menuLateral");

botonMenu.addEventListener("click", () => {
  menuLateral.classList.toggle("mostrar-menu");
});

const botonCerrar = document.getElementById("cerrarMenu");
botonCerrar.addEventListener("click", () => {
  menuLateral.classList.remove("mostrar-menu");
});

// Mostrar secciones y cerrar menú móvil
function mostrarSeccion(idSeccion) {
  ocultarTodasLasSecciones();
  const seccionActiva = document.getElementById(idSeccion);
  if (seccionActiva) {
    seccionActiva.classList.add('activa');
  }
  menuLateral.classList.remove("mostrar-menu");
}

// Mostrar la sección de inicio
function mostrarInicio() {
  ocultarTodasLasSecciones();
  const inicio = document.getElementById('inicio');
  inicio.classList.add('activa');
}

// Ocultar todas las secciones
function ocultarTodasLasSecciones() {
  document.querySelectorAll('.seccion').forEach(seccion => {
    seccion.classList.remove('activa');
  });
}

// Cargar dinámicamente las categorías en el submenú
function cargarSubmenuCategorias() {
  const submenu = document.getElementById('submenu-categorias');
  submenu.innerHTML = '';

  categorias.forEach(categoria => {
    const li = document.createElement('li');
    li.classList.add('submenu-item');
    li.innerHTML = `
      <a href="#" onclick="mostrarProductosCategoria(${categoria.id}, '${categoria.nombre}')">
        ${categoria.nombre}
      </a>
    `;
    submenu.appendChild(li);
  });
}

// Mostrar la sección de productos con la categoría seleccionada
function mostrarProductosCategoria(idCategoria, nombreCategoria) {
  ocultarTodasLasSecciones();
  document.getElementById('productos').classList.add('activa');
  document.getElementById('categoria-titulo').textContent = `Productos de ${nombreCategoria}`;
  document.getElementById('categoria-id').value = idCategoria;
  document.getElementById('formulario-producto').classList.add('activa');
  menuLateral.classList.remove("mostrar-menu");
}

// Ejecutar al cargar la página
window.addEventListener('DOMContentLoaded', () => {
  cargarSubmenuCategorias();
});
