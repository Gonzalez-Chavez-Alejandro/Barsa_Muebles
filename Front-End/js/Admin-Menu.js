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
    const secciones = document.querySelectorAll('main .seccion');
    secciones.forEach(seccion => {
      seccion.classList.remove('activa');
    });
    const seccionActiva = document.getElementById(idSeccion);
    if (seccionActiva) {
      seccionActiva.classList.add('activa');
    }
    menuLateral.classList.remove("mostrar-menu"); // Cierra el menú en móvil
  }
  function mostrarInicio() {
// Ocultar todas las secciones
let secciones = document.querySelectorAll('.seccion');
secciones.forEach(seccion => {
  seccion.classList.remove('activa');
});

// Mostrar la sección de inicio
let inicio = document.getElementById('inicio');
inicio.classList.add('activa');
}
