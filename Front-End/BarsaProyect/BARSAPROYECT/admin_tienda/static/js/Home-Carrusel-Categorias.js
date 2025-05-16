

const homeCategorias = document.getElementById('Home-Categorias');
const carousel = document.getElementById('carouselCategorias');

// Crear los cards de categorías
categorias.forEach(cat => {
  const card = document.createElement('div');
  card.className = 'card';

  card.innerHTML = `
    <img src="${cat.imagen}" alt="${cat.nombre}">
    <h3>${cat.nombre}</h3>
    <p>${cat.descripcion}</p>
  `;

  carousel.appendChild(card);
});

// Función para desplazar el carrusel
function scrollCarousel(direction) {
  const scrollAmount = 300;  // El tamaño del desplazamiento
  carousel.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
}

// Flechas de navegación
const leftArrow = document.createElement('button');
leftArrow.classList.add('arrow', 'left');
leftArrow.innerHTML = '&#9664;';  // Flecha izquierda

const rightArrow = document.createElement('button');
rightArrow.classList.add('arrow', 'right');
rightArrow.innerHTML = '&#9654;';  // Flecha derecha

// Añadir las flechas al contenedor
homeCategorias.appendChild(leftArrow);
homeCategorias.appendChild(rightArrow);

// Navegar a la izquierda
leftArrow.addEventListener('click', () => {
  scrollCarousel(-1);
});

// Navegar a la derecha
rightArrow.addEventListener('click', () => {
  scrollCarousel(1);
});

























