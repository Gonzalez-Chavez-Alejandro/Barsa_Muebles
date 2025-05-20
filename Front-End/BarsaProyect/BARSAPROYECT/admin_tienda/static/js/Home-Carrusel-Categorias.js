document.addEventListener("DOMContentLoaded", () => {
  const homeCategorias = document.getElementById('Home-Categorias');
  const carousel = document.getElementById('carouselCategorias');

  // Crear cards de categorías
  categorias.forEach(cat => {
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
      <img src="${cat.imagen}" alt="${cat.nombre}">
      <h3>${cat.nombre}</h3>
      <p>${cat.descripcion}</p>
    `;

    // Redirigir al hacer clic
    card.addEventListener("click", () => {
      window.location.href = `/productos/?categoria=${cat.id}`;
    });

    carousel.appendChild(card);
  });

  // Función para mover el carrusel
  function scrollCarousel(direction) {
    const scrollAmount = 300;
    carousel.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
  }

  // Asignar eventos a flechas
  document.getElementById('leftArrow').addEventListener('click', () => scrollCarousel(-1));
  document.getElementById('rightArrow').addEventListener('click', () => scrollCarousel(1));
});
