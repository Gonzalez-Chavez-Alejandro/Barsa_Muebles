// Mostrar los datos de contacto en la sección pública
function mostrarContacto() { 
  const listaTel = document.getElementById("lista-telefonos");
  const listaUbi = document.getElementById("lista-ubicaciones");
  const listaRedes = document.getElementById("lista-redes");

  if (!listaTel || !listaUbi || !listaRedes) return;

  listaTel.innerHTML = "";
  listaUbi.innerHTML = "";
  listaRedes.innerHTML = "";

  window.contactos.tel.forEach(t => {
    const li = document.createElement("li");
    li.textContent = t;
    listaTel.appendChild(li);
  });

  window.contactos.ubicaciones.forEach(u => {
    const li = document.createElement("li");
    li.textContent = u;
    listaUbi.appendChild(li);
  });

  for (const red in window.contactos.redes) {
    const data = window.contactos.redes[red];
    if (data.activo && data.url) {
      const a = document.createElement("a");
      a.href = data.url;
      a.target = "_blank";
      a.className = `social-icon ${red}`;
      a.innerHTML = `<i class="${iconos[red]}"></i>`;
      listaRedes.appendChild(a);
    }
  }
}

// Carga los datos en el formulario de administración
function cargarFormulario() {
  if (!document.getElementById("admin-form")) return;

  // Teléfonos
  const listaTel = document.getElementById("lista-telefonos-admin");
  listaTel.innerHTML = "";
  window.contactos.tel.forEach(tel => agregarTelefono(tel));

  // Ubicaciones
  const listaUbi = document.getElementById("lista-ubicaciones-admin");
  listaUbi.innerHTML = "";
  window.contactos.ubicaciones.forEach(ubi => agregarUbicacion(ubi));

  // Redes Sociales
  const redes = window.contactos.redes;
  document.getElementById("check-facebook").checked = redes.facebook.activo;
  document.getElementById("input-facebook").value = redes.facebook.url;

  document.getElementById("check-instagram").checked = redes.instagram.activo;
  document.getElementById("input-instagram").value = redes.instagram.url;

  document.getElementById("check-whatsapp").checked = redes.whatsapp.activo;
  document.getElementById("input-whatsapp").value = redes.whatsapp.url;

  document.getElementById("check-gmail").checked = redes.gmail.activo;
  document.getElementById("input-gmail").value = redes.gmail.url.replace("mailto:", "");
}

// Agrega un nuevo campo para teléfono en el formulario admin
function agregarTelefono(valor = "") {
  const contenedor = document.getElementById("lista-telefonos-admin");
  const div = document.createElement("div");
  div.innerHTML = `
    <input type="text" class="telefono-input" value="${valor}" maxlength="18" placeholder="10 dígitos">
    <button type="button" class="btn-eliminar">
      <i class="fas fa-trash"></i>
    </button>
    <small class="error-msg" style="color:red; display:none;">Debe contener al menos 10 dígitos válidos</small>
  `;
  contenedor.appendChild(div);

  const input = div.querySelector(".telefono-input");
  const errorMsg = div.querySelector(".error-msg");
  const btnEliminar = div.querySelector(".btn-eliminar");
  const mensajeEliminado = document.getElementById("mensaje-eliminado-telefono");

  input.addEventListener("input", () => {
    const soloNumeros = input.value.replace(/\D/g, "");
    const ultimos10 = soloNumeros.slice(-10);

    if (ultimos10.length !== 10) {
      input.classList.add("input-error");
      errorMsg.style.display = "block";
    } else {
      input.classList.remove("input-error");
      errorMsg.style.display = "none";
    }
  });

  btnEliminar.addEventListener("click", () => {
    div.remove();
    if (mensajeEliminado) {
      mensajeEliminado.innerHTML = `<i class="fas fa-check-circle"></i> Teléfono ha sido borrado.`;
      mensajeEliminado.classList.remove('mensaje-oculto');
      mensajeEliminado.classList.add('mensaje-visible');

      setTimeout(() => {
        mensajeEliminado.classList.remove('mensaje-visible');
        mensajeEliminado.classList.add('mensaje-oculto');
      }, 2000);
    }
  });
}

// Agrega un nuevo campo para ubicación en el formulario admin
function agregarUbicacion(valor = "") {
  const contenedor = document.getElementById("lista-ubicaciones-admin");
  const div = document.createElement("div");
  div.innerHTML = `
    <input type="text" class="ubicacion-input" value="${valor}">
    <button type="button" class="btn-eliminar-ubicacion">
      <i class="fas fa-trash"></i>
    </button>
  `;
  contenedor.appendChild(div);

  const btnEliminar = div.querySelector(".btn-eliminar-ubicacion");
  const mensajeEliminadoUbi = document.getElementById("mensaje-eliminado-ubicacion");

  btnEliminar.addEventListener("click", () => {
    div.remove();

    if (mensajeEliminadoUbi) {
      mensajeEliminadoUbi.classList.remove('mensaje-oculto');
      mensajeEliminadoUbi.classList.add('mensaje-visible');

      setTimeout(() => {
        mensajeEliminadoUbi.classList.remove('mensaje-visible');
        mensajeEliminadoUbi.classList.add('mensaje-oculto');
      }, 2000);
    }
  });
}


/*
// Muestra mensaje de error (botón para pruebas)
document.getElementById('mostrar-error').addEventListener('click', (e) => {
  e.preventDefault();
  const mensajeError = document.getElementById('mensaje-error');
  mensajeError.classList.remove('mensaje-oculto');
  mensajeError.classList.add('mensaje-visible');

  setTimeout(() => {
    mensajeError.classList.remove('mensaje-visible');
    mensajeError.classList.add('mensaje-oculto');
  }, 5000);
});
*/
// Toggle para mostrar/ocultar secciones
function toggleSeccion(titulo) {
  const contenedor = titulo.parentElement;
  contenedor.classList.toggle('seccion-activa');
}

// Código principal al cargar el DOM
document.addEventListener("DOMContentLoaded", () => {
  mostrarContacto();
  cargarFormulario();

  document.getElementById("admin-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const telInputs = document.querySelectorAll(".telefono-input");
    const ubiInputs = document.querySelectorAll(".ubicacion-input");

    const tels = Array.from(telInputs).map(input => input.value.trim()).filter(Boolean);
    const ubis = Array.from(ubiInputs).map(input => input.value.trim()).filter(Boolean);

    // Validar que todos los teléfonos contengan al menos 10 dígitos válidos
    const telefonosValidos = tels.every(t => {
      const soloNumeros = t.replace(/\D/g, "");
      return soloNumeros.slice(-10).length === 10;
    });

    if (!telefonosValidos) {
      alert("Todos los teléfonos deben contener al menos 10 dígitos numéricos válidos.");
      return;
    }

    // Actualizar contactos globales
    window.contactos.tel = tels;
    window.contactos.ubicaciones = ubis;
    window.contactos.redes = {
      facebook: {
        url: document.getElementById("input-facebook").value.trim(),
        activo: document.getElementById("check-facebook").checked
      },
      instagram: {
        url: document.getElementById("input-instagram").value.trim(),
        activo: document.getElementById("check-instagram").checked
      },
      whatsapp: {
        url: document.getElementById("input-whatsapp").value.trim(),
        activo: document.getElementById("check-whatsapp").checked
      },
      gmail: {
        url: "mailto:" + document.getElementById("input-gmail").value.trim(),
        activo: document.getElementById("check-gmail").checked
      }
    };

    mostrarContacto();

    // Mostrar mensaje de éxito al actualizar
    const mensajeActualizado = document.getElementById('mensaje-actualizado');
    mensajeActualizado.classList.remove('mensaje-oculto');
    mensajeActualizado.classList.add('mensaje-visible');

    setTimeout(() => {
      mensajeActualizado.classList.remove('mensaje-visible');
      mensajeActualizado.classList.add('mensaje-oculto');
    }, 2000);
  });
});

