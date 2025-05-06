  // Esperar que el DOM esté cargado
  document.addEventListener("DOMContentLoaded", () => {
    const linkSubir = document.getElementById('linkSubir-img');
    const linkOtro = document.getElementById('linkOtro-img');
    const sectionSubir = document.getElementById('subir');
    const sectionOtro = document.getElementById('otro');

    linkSubir.addEventListener('click', () => {
      sectionSubir.classList.add('active');
      sectionOtro.classList.remove('active');
      linkSubir.classList.add('active');
      linkOtro.classList.remove('active');
    });

    linkOtro.addEventListener('click', () => {
      sectionSubir.classList.remove('active');
      sectionOtro.classList.add('active');
      linkOtro.classList.add('active');
      linkSubir.classList.remove('active');
    });
  });