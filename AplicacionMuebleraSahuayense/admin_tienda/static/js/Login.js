
  const loginForm = document.getElementById("login-form");
  const errorUsername = document.getElementById("error-username");
  const errorPassword = document.getElementById("error-password");

  // ------------- LOGIN NORMAL --------------
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorUsername.style.display = "none";
  errorPassword.style.display = "none";

  const loginData = {
    username: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  try {
    const response = await fetch("/api/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    });

    const data = await response.json();
    console.log("data.detail", data.detail);

    if (!response.ok) {
      const msg = data.username?.[0] || data.password?.[0] || data.detail || "Credenciales inválidas.";

      if (data.username?.length) {
        errorUsername.style.display = "block";
        errorUsername.textContent = msg;
      } else if (data.password?.length) {
        errorPassword.style.display = "block";
        errorPassword.textContent = msg;
      } else {
        errorUsername.style.display = "block";
        errorUsername.textContent = msg;
      }

      return;
    }

    // Autenticación correcta: guardar token y redirigir
    //localStorage.setItem("accessToken", data.access);
    //localStorage.setItem("refreshToken", data.refresh);

    const userRes = await fetch("/api/user-info/", {
      headers: { Authorization: `Bearer ${data.access}` },
    });

    if (!userRes.ok) {
      console.error("Error obteniendo info del usuario");
      return;
    }
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('accessToken', data.access);
    localStorage.setItem('refreshToken', data.refresh);

    const userInfo = await userRes.json();

    if (userInfo.is_superuser) {
      window.location.href = "/administrador";
    } else {
      window.location.href = "/configuracion_usuario";
    }
  } catch (error) {
    console.error("Error de conexión:", error);
    errorUsername.style.display = "block";
    errorUsername.textContent = "Error de conexión: " + error.message;
  }
});

  // ------------- RECUPERAR CONTRASEÑA -------------
  let emailRecuperacion = "";

  document.querySelector(".forgot-password a").addEventListener("click", () => {
    abrirModal("modal-solicitar-correo");
  });

  function abrirModal(id) {
    document.getElementById(id).classList.remove("hidden");
  }

  function cerrarModal(id) {
    document.getElementById(id).classList.add("hidden");
  }

  async function enviarCodigoRecuperacion() {
    const email = document.getElementById("correo-recuperacion").value.trim();
    const mensajeCorreo = document.getElementById("mensaje-correo");
    const button = document.getElementById("btn_EnviarCodigo");
    mensajeCorreo.textContent = "";
    button.textContent = "Enviando..."


    if (!email.endsWith("@gmail.com")) {
      mensajeCorreo.textContent = "Solo se aceptan correos @gmail.com.";
      return;
    }

    try {
      const res = await fetch("/password_reset/send-code/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        mensajeCorreo.textContent = data.detail || "Correo no encontrado.";
        return;
      }

      emailRecuperacion = email;
      //
      cerrarModal("modal-solicitar-correo");
      abrirModal("modal-verificar-codigo");
    } catch (err) {
      mensajeCorreo.textContent = "Error de red.";
    }
    button.textContent = "Enviar código"
  }

  function verificarCodigo() {
    const code = document.getElementById("codigo-verificacion").value.trim();
    const mensajeCodigo = document.getElementById("mensaje-codigo");
    mensajeCodigo.textContent = "";

    if (!/^\d{6}$/.test(code)) {
      mensajeCodigo.textContent = "El código debe tener 6 dígitos.";
      return;
    }

    // Guardar código temporalmente para enviar después
    localStorage.setItem("codigo_verificacion", code);

    cerrarModal("modal-verificar-codigo");
    abrirModal("modal-nueva-password");
  }

  async function cambiarPassword() {
    const nueva = document.getElementById("nueva-password").value;
    const confirmar = document.getElementById("confirmar-password").value;
    const mensajePassword = document.getElementById("mensaje-password");
    mensajePassword.textContent = "";

    if (nueva !== confirmar) {
      mensajePassword.textContent = "Las contraseñas no coinciden.";
      return;
    }

    if (nueva.length < 6) {
      mensajePassword.textContent = "Debe tener al menos 6 caracteres.";
      return;
    }

    try {
      const res = await fetch("/password_reset/verify-code/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailRecuperacion,
          code: localStorage.getItem("codigo_verificacion"),
          new_password: nueva,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        mensajePassword.textContent = data.detail || "No se pudo cambiar la contraseña.";
        return;
      }

      cerrarModal("modal-nueva-password");
      alert("✅ Contraseña actualizada correctamente.");

      // Opcional: limpiar localStorage del código después de éxito a247wolf247a@gmail.com
      localStorage.removeItem("codigo_verificacion");
    } catch (err) {
      mensajePassword.textContent = "Error en el servidor.";
    }
  }