// Función para cargar el submenú de categorías
function cargarSubmenuCategorias() {
    const submenu = document.getElementById('submenu-categorias');
    submenu.innerHTML = ''; // Limpiar el submenú
  
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
  
  // Ejecutar cuando se cargue la página
  window.addEventListener('DOMContentLoaded', () => {
    cargarSubmenuCategorias(); // Cargar las categorías al iniciar
   
  });
  
  