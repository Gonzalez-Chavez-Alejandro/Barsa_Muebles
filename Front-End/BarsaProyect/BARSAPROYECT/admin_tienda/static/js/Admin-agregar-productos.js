
window.addEventListener('DOMContentLoaded', () => {
    const selectCategoria = document.getElementById('categoriaProducto');
    window.categorias.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.nombre;
        selectCategoria.appendChild(option);
    });
});

function togglePrecioOferta() {
    const select = document.getElementById("ofertaProducto");
    const grupo = document.getElementById("grupoPrecioOferta");
    grupo.style.display = (select.value === "si") ? "block" : "none";
}

function agregarProducto(event) {
    event.preventDefault();

    const nombre = document.getElementById("nombreProducto").value;
    const descripcion = document.getElementById("descripcionProducto").value;
    const precio = document.getElementById("precioProducto").value;
    const oferta = document.getElementById("ofertaProducto").value;
    const precioOferta = document.getElementById("precioOferta").value;
    const categoria = document.getElementById("categoriaProducto").value;

    const datos = {
        nombre,
        descripcion,
        precio,
        oferta,
        precioOferta,
        categoria,
        imagenes: imagenesBase64
    };

    console.log("Producto capturado:", datos);

    // Mostrar mensaje flotante
    const mensaje = document.getElementById("mensajeGuardado");
    mensaje.style.display = 'block';
    mensaje.style.opacity = '1';

    // Ocultar después de 7 segundos con desvanecido
    setTimeout(() => {
        mensaje.style.opacity = '0';
        setTimeout(() => {
            mensaje.style.display = 'none';
        }, 500);
    }, 7000);

    // Limpiar formulario
    document.getElementById("form-agregar-producto").reset();
    previewContainer.innerHTML = '';
    imagenesBase64 = [];
    togglePrecioOferta();
}




const inputFile = document.getElementById('imagenProducto');
const previewContainer = document.getElementById('previewContainer');

// Arreglo para almacenar las imágenes en base64
let imagenesBase64 = [];

inputFile.addEventListener('change', () => {
  const archivos = Array.from(inputFile.files);

  archivos.forEach(file => {
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result;
      imagenesBase64.push(base64); // Guardar base64

      // Crear contenedor con imagen y botón de eliminar
      const wrapper = document.createElement('div');
      wrapper.style.position = 'relative';

      const img = document.createElement('img');
      img.src = base64;
      img.style.maxWidth = '120px';
      img.style.maxHeight = '120px';
      img.style.borderRadius = '6px';
      img.style.objectFit = 'cover';
      img.style.display = 'block';

      const btnEliminar = document.createElement('button');
      btnEliminar.textContent = '×';
      btnEliminar.style.position = 'absolute';
      btnEliminar.style.top = '2px';
      btnEliminar.style.right = '2px';
      btnEliminar.style.background = 'red';
      btnEliminar.style.color = 'white';
      btnEliminar.style.border = 'none';
      btnEliminar.style.borderRadius = '50%';
      btnEliminar.style.width = '20px';
      btnEliminar.style.height = '20px';
      btnEliminar.style.cursor = 'pointer';
      btnEliminar.title = 'Eliminar esta imagen';

      // Eliminar imagen al hacer clic
      btnEliminar.addEventListener('click', () => {
        previewContainer.removeChild(wrapper);
        imagenesBase64 = imagenesBase64.filter(b64 => b64 !== base64);
      });

      wrapper.appendChild(img);
      wrapper.appendChild(btnEliminar);
      previewContainer.appendChild(wrapper);
    };

    reader.readAsDataURL(file);
  });

  // Limpiar input para permitir volver a subir las mismas imágenes
  inputFile.value = '';
});
















       /*                Agregar producto     */
const precioProductoInput = document.getElementById('precioProducto');
const precioOfertaInput = document.getElementById('precioOferta');
const precioDescuentoInput = document.getElementById('precioProductoDescuento');
const selectOferta = document.getElementById('ofertaProducto');

function actualizarPrecioConDescuento() {
  const precio = parseFloat(precioProductoInput.value);
  const descuento = parseFloat(precioOfertaInput.value);
if (
  selectOferta.value === 'si' &&
  !isNaN(precio) &&
  !isNaN(descuento) &&
  precio > 0 &&
  descuento > 0 &&
  descuento <= 100
) {
  const precioFinal = precio - (precio * descuento / 100);
  precioDescuentoInput.value = precioFinal.toFixed(2);
} else {
  precioDescuentoInput.value = '';
}

}

// Escucha cambios en los inputs
precioProductoInput.addEventListener('input', actualizarPrecioConDescuento);
precioOfertaInput.addEventListener('input', actualizarPrecioConDescuento);
selectOferta.addEventListener('change', () => {
  actualizarPrecioConDescuento();
  if (selectOferta.value === 'no') {
    precioDescuentoInput.value = '';
  }
});
