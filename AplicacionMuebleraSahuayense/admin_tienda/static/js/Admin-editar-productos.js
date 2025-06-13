 /*let imagenesBase64 = [];

  window.addEventListener("DOMContentLoaded", () => {
    const producto = JSON.parse(localStorage.getItem("productoEditar"));
    const selectCategoria = document.getElementById("categoriaProducto");
    const previewContainer = document.getElementById("previewContainer");
    const imagenInput = document.getElementById("imagenProducto");

    // Validamos si hay categorías cargadas
    if (!window.categorias || window.categorias.length === 0) {
      console.error("No hay categorías disponibles en window.categorias");
      return;
    }

    // Llenamos el select con categorías
    window.categorias.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat.id;
      option.textContent = cat.nombre;
      selectCategoria.appendChild(option);
    });

    // Función para mostrar imágenes en el preview
    function mostrarImagen(base64) {
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

      btnEliminar.addEventListener('click', () => {
        previewContainer.removeChild(wrapper);
        imagenesBase64 = imagenesBase64.filter(b64 => b64 !== base64);
      });

      wrapper.appendChild(img);
      wrapper.appendChild(btnEliminar);
      previewContainer.appendChild(wrapper);
    }

    // Si hay producto, rellenamos los campos
    if (producto) {
      document.getElementById("nombreProducto").value = producto.nombre || '';
      document.getElementById("descripcionProducto").value = producto.descripcion || '';
      document.getElementById("precioProducto").value = producto.precio || '';

      const ofertaSelect = document.getElementById("ofertaProducto");
      if (producto.oferta === true || producto.oferta === "si") {
        ofertaSelect.value = "si";
        togglePrecioOferta();
        document.getElementById("precioProductoDescuento").value = producto.precioOferta || '';
      } else {
        ofertaSelect.value = "no";
      }

      // Seleccionar la categoría correspondiente
      setTimeout(() => {
        selectCategoria.value = producto.categoriaId || '';
      }, 0);

      // Mostrar imágenes existentes si hay
      if (producto.nombreimagenes) {
        imagenesBase64 = producto.nombreimagenes.split(",");
        imagenesBase64.forEach(base64 => {
          mostrarImagen(base64);
        });
      }
    }

    // Manejar subida de nuevas imágenes
    imagenInput.addEventListener('change', function(e) {
      const files = e.target.files;
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        
        reader.onload = function(e) {
          const base64 = e.target.result;
          imagenesBase64.push(base64);
          mostrarImagen(base64);
        };
        
        reader.readAsDataURL(file);
      }
      
      // Limpiar el input para permitir subir la misma imagen otra vez
      imagenInput.value = '';
    });

    // EVENTOS para cálculo automático de descuentos
    const precioInput = document.getElementById("precioProducto");
    const descuentoInput = document.getElementById("precioOferta");
    const resultadoInput = document.getElementById("precioProductoDescuento");

    function calcularDescuentoAutomatico() {
      const precio = parseFloat(precioInput.value);
      const precioFinal = parseFloat(resultadoInput.value);

      if (!isNaN(precio) && !isNaN(precioFinal) && precio > 0) {
        const descuento = ((precio - precioFinal) / precio) * 100;
        
        if (descuento >= 0 && descuento <= 100) {
          descuentoInput.value = Math.round(descuento);
        } else {
          descuentoInput.value = '';
        }
      } else {
        descuentoInput.value = '';
      }
    }

    precioInput.addEventListener("input", calcularDescuentoAutomatico);
    resultadoInput.addEventListener("input", calcularDescuentoAutomatico);

    if (producto && producto.precio && producto.precioOferta) {
      calcularDescuentoAutomatico();
    }

    // Actualizar porcentaje visual
    const porcentajeVisual = document.getElementById("porcentajeVisual");
    if (porcentajeVisual) {
      descuentoInput.addEventListener("input", () => {
        porcentajeVisual.textContent = descuentoInput.value ? descuentoInput.value + "%" : "%";
      });
      porcentajeVisual.textContent = descuentoInput.value ? descuentoInput.value + "%" : "%";
    }
  });

  function togglePrecioOferta() {
    const grupo = document.getElementById("grupoPrecioOferta");
    const select = document.getElementById("ofertaProducto");
    if (select.value === "si") {
      grupo.style.display = "block";
      setTimeout(() => {
        const precioInput = document.getElementById("precioProducto");
        const resultadoInput = document.getElementById("precioProductoDescuento");
        if (precioInput.value && resultadoInput.value) {
          const precio = parseFloat(precioInput.value);
          const precioFinal = parseFloat(resultadoInput.value);
          if (precio > 0 && precioFinal >= 0) {
            const descuento = ((precio - precioFinal) / precio) * 100;
            if (descuento >= 0 && descuento <= 100) {
              document.getElementById("precioOferta").value = Math.round(descuento);
            }
          }
        }
      }, 100);
    } else {
      grupo.style.display = "none";
      document.getElementById("precioOferta").value = '';
      document.getElementById("precioProductoDescuento").value = '';
    }
    
  }


const precioInput = document.getElementById("precioProducto");
const descuentoInput = document.getElementById("precioOferta");
const resultadoInput = document.getElementById("precioProductoDescuento");

function calcularDescuento() {
  const precio = parseFloat(precioInput.value);
  const descuento = parseFloat(descuentoInput.value);

  if (!isNaN(precio) && !isNaN(descuento)) {
    const precioFinal = precio - (precio * descuento / 100);
    resultadoInput.value = precioFinal.toFixed(2);
  } else {
    resultadoInput.value = "";
  }
}

precioInput.addEventListener("input", calcularDescuento);
descuentoInput.addEventListener("input", calcularDescuento);







function agregarProducto(event) {
  event.preventDefault();

  const nombre = document.getElementById("nombreProducto").value.trim();
  const descripcion = document.getElementById("descripcionProducto").value.trim();
  const precio = parseFloat(document.getElementById("precioProducto").value);
  const oferta = document.getElementById("ofertaProducto").value === "si";
  const descuento = oferta ? parseInt(document.getElementById("precioOferta").value) : null;
  const precioOferta = oferta ? parseFloat(document.getElementById("precioProductoDescuento").value) : null;
  const categoriaId = document.getElementById("categoriaProducto").value;

  // Validación extra si quieres evitar errores
  if (!nombre || !descripcion || isNaN(precio) || !categoriaId || (oferta && (isNaN(descuento) || isNaN(precioOferta)))) {
    alert("Por favor, completa todos los campos requeridos.");
    return;
  }

  const datos = {
    nombre,
    descripcion,
    precio,
    oferta,
    descuento,
    precioOferta,
    categoriaId,
    nombreimagenes: imagenesBase64.join(",")
  };

  localStorage.setItem("productoGuardado", JSON.stringify(datos));

  const mensaje = document.getElementById("mensajeGuardado");
  mensaje.style.display = "inline";

  setTimeout(() => {
    mensaje.style.display = "none";
  }, 3000);
}

*/


