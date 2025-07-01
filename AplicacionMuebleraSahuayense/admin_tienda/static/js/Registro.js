

/*
    document.querySelector(".submit-btn").addEventListener("click", function (e) {
      e.preventDefault(); // Evita el envío si hay errores

      const campos = document.querySelectorAll(".input-field");
      const checkbox = document.getElementById("terminos");
      let hayErrores = false;

      campos.forEach((campo) => {
        if (campo.value.trim() === "") {
          campo.style.borderColor = "#cc3300";
          campo.style.backgroundColor = "#fff5f5";
          hayErrores = true;
        } else {
          campo.style.borderColor = "#007acc";
          campo.style.backgroundColor = "#ffffff";
        }
      });

      if (!checkbox.checked) {
        alert("Debes aceptar los términos y condiciones.");
        hayErrores = true;
      }

      if (!hayErrores) {
        alert("Formulario válido. Enviar datos...");
        // Aquí puedes hacer el envío con AJAX o permitir el envío del formulario
        e.target.closest("form").submit();
      }
    });





    const telefonoInput = document.getElementById('telefono');

    telefonoInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, ''); // quita letras
      if (value.length > 10) value = value.slice(0, 10);

      // Formato 123 456 7890
      const formatted = value
        .replace(/(\d{3})(\d{0,3})(\d{0,4})/, function (_, p1, p2, p3) {
          let str = p1;
          if (p2) str += ' ' + p2;
          if (p3) str += ' ' + p3;
          return str;
        });

      e.target.value = formatted;
    });

    function soloLetras(inputId, errorId) {
      const input = document.getElementById(inputId);
      const error = document.getElementById(errorId);

      input.addEventListener('input', () => {
        const soloLetrasRegex = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]*$/;

        if (!soloLetrasRegex.test(input.value)) {
          error.style.display = 'block';
          input.style.borderColor = 'red';
        } else {
          error.style.display = 'none';
          input.style.borderColor = '';
        }
      });
    }

    soloLetras('nombre', 'nombre-error');
    soloLetras('apellido', 'apellido-error');



  
  // Validaciones en tiempo real
  const password = document.getElementById('contrasena');
  const confirmar = document.getElementById('confirmar_contrasena');
  const errorPass = document.getElementById('contrasena-error');
  const errorConfirmar = document.getElementById('confirmar-error');

  function validarContraseña() {
    if (password.value.length < 8) {
      errorPass.style.display = 'block';
      password.style.borderColor = 'red';
    } else {
      errorPass.style.display = 'none';
      password.style.borderColor = '';
    }
  }

  function validarConfirmacion() {
    if (confirmar.value !== password.value) {
      errorConfirmar.style.display = 'block';
      confirmar.style.borderColor = 'red';
    } else {
      errorConfirmar.style.display = 'none';
      confirmar.style.borderColor = '';
    }
  }

  password.addEventListener('input', () => {
    validarContraseña();
    validarConfirmacion();
  });

  confirmar.addEventListener('input', validarConfirmacion);
*/