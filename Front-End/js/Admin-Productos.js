const productos = {
    "Sillas": [
      { nombre: "Silla Moderna", descripcion: "Silla tapizada en lino", precio: "$1,200", imagenes: ["img1.jpg", "img2.jpg"] },
      { nombre: "Silla Clásica", descripcion: "Silla de madera tallada", precio: "$1,500", imagenes: ["img3.jpg"] }
    ],
    "Mesas": [
      { nombre: "Mesa Redonda", descripcion: "Mesa de comedor para 4 personas", precio: "$3,000", imagenes: ["img4.jpg", "img5.jpg"] }
    ]
  };
  
  function mostrarTablaProductos(categoria) {
    const contenedor = document.getElementById("tabla-productos");
    const lista = productos[categoria];
  
    if (!lista) {
      contenedor.innerHTML = "<p>No hay productos en esta categoría.</p>";
      return;
    }
  
    let tabla = `
      <table border="1" cellpadding="10" cellspacing="0">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th># Imágenes</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
    `;
  
    lista.forEach((producto, index) => {
      tabla += `
        <tr>
          <td>${producto.nombre}</td>
          <td>${producto.descripcion}</td>
          <td>${producto.precio}</td>
          <td>${producto.imagenes.length}</td>
          <td><button onclick="verImagenes('${categoria}', ${index})">Ver imágenes</button></td>
        </tr>
      `;
    });
  
    tabla += "</tbody></table>";
    contenedor.innerHTML = tabla;
  }
  
  function verImagenes(categoria, index) {
    const producto = productos[categoria][index];
    const contenido = document.getElementById("contenido-imagenes");
  
    contenido.innerHTML = producto.imagenes.map(url => `<img src="${url}" style="width:100px; margin:5px;">`).join("");
    document.getElementById("modal-imagenes").style.display = "block";
  }
  
  function cerrarModal() {
    document.getElementById("modal-imagenes").style.display = "none";
  }
  
  // Espera a que el DOM esté cargado antes de agregar el listener
  document.addEventListener("DOMContentLoaded", () => {
    const link = document.getElementById("ver-productos");
    link.addEventListener("click", (e) => {
      e.preventDefault(); // evita que recargue la página
      mostrarTablaProductos("Sillas"); // Cambia a otra categoría si quieres
    });
  });
  