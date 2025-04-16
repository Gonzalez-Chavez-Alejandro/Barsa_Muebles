let filaActual = null;

// Buscar usuarios por nombre
function buscarUsuarios() {
  const filtro = document.getElementById('buscador').value.toLowerCase();
  const filas = document.querySelectorAll('.admin-table tbody tr');

  filas.forEach(fila => {
    const nombre = fila.querySelector('td:first-child').textContent.toLowerCase();
    fila.style.display = nombre.includes(filtro) ? '' : 'none';
  });
}

// Ordenar la tabla por nombre
let ordenAscendente = true;
function ordenarPorNombre() {
  const tabla = document.querySelector('.admin-table');
  const filas = Array.from(tabla.querySelectorAll('tbody tr'));

  filas.sort((a, b) => {
    const nombreA = a.querySelector('td:first-child').textContent.toLowerCase();
    const nombreB = b.querySelector('td:first-child').textContent.toLowerCase();
    return ordenAscendente
      ? nombreA.localeCompare(nombreB)
      : nombreB.localeCompare(nombreA);
  });

  const tbody = tabla.querySelector('tbody');
  filas.forEach(fila => tbody.appendChild(fila));
  ordenAscendente = !ordenAscendente;
}

// Abrir modal de edición
document.querySelectorAll('.edit-btn').forEach(boton => {
    boton.addEventListener('click', function () {
      filaActual = this.closest('tr');
      const celdas = filaActual.querySelectorAll('td');
  
      document.getElementById('nombreEditar').value = celdas[0].textContent;
      document.getElementById('correoEditar').value = celdas[1].textContent;
      document.getElementById('telefonoEditar').value = celdas[2].textContent;
  
      // ⚠ Mostrar la contraseña real desde el atributo personalizado
      const password = celdas[3].dataset.password || '';
      document.getElementById('contrasenaEditar').value = password;
  
      document.getElementById('modalEditar').style.display = 'block';
    });
  });
  



// Validar y guardar cambios
function guardarCambios() {
    const nombreInput = document.getElementById('nombreEditar');
    const correoInput = document.getElementById('correoEditar');
    const telefonoInput = document.getElementById('telefonoEditar');
    const contrasenaInput = document.getElementById('contrasenaEditar');
  
    const nombre = nombreInput.value.trim();
    const correo = correoInput.value.trim();
    let telefono = telefonoInput.value.trim().replace(/\D/g, '');
    const contrasena = contrasenaInput.value.trim();
  
    let isValid = true;
  
    // Validar nombre (solo letras y espacios)
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(nombre) || nombre === "") {
      alert("El nombre solo debe contener letras y espacios.");
      nombreInput.classList.add("invalid");
      isValid = false;
    } else {
      nombreInput.classList.remove("invalid");
    }
  
    // Validar correo (estilo Google)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      alert("Ingrese un correo electrónico válido.");
      correoInput.classList.add("invalid");
      isValid = false;
    } else {
      correoInput.classList.remove("invalid");
    }
  
    // Validar teléfono (solo números y 10 dígitos)
    if (!/^\d{10}$/.test(telefono)) {
      alert("El teléfono debe contener exactamente 10 dígitos numéricos.");
      telefonoInput.classList.add("invalid");
      isValid = false;
    } else {
      telefonoInput.classList.remove("invalid");
    }
  
    // Validar contraseña (mínimo 8 caracteres)
    if (contrasena === "" || contrasena.length < 8) {
      alert("La contraseña debe tener al menos 8 caracteres.");
      contrasenaInput.classList.add("invalid");
      isValid = false;
    } else {
      contrasenaInput.classList.remove("invalid");
    }
  
    // Si todo es válido, actualiza la tabla
    if (isValid && filaActual) {
      const celdas = filaActual.querySelectorAll('td');
      celdas[0].textContent = nombre;
      celdas[1].textContent = correo;
      celdas[2].textContent = telefono;
  
      // 🔐 Guardamos la contraseña real como atributo para futura BD
      celdas[3].dataset.password = contrasena;
      celdas[3].textContent = '*******'; // Mostramos oculta en la tabla
  
      cerrarModal();
    }
  }
  

document.getElementById('nombreEditar').addEventListener('input', function(event) {
    // Evitar que se escriban números o caracteres especiales
    this.value = this.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, ''); // Reemplaza cualquier cosa que no sea letra o espacio
});


// Restringir input de teléfono en tiempo real (solo números y 10 caracteres)
document.getElementById('telefonoEditar').addEventListener('input', function () {
  this.value = this.value.replace(/\D/g, '').slice(0, 10);
});
// Cerrar modal
function cerrarModal() {
    document.getElementById('modalEditar').style.display = 'none';
  }