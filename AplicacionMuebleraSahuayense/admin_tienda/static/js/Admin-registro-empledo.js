document.getElementById("form-superuser").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Limpiar mensajes anteriores
  const fields = ["username", "email", "password", "ageUser", "phoneUser"];
  fields.forEach(field => {
    document.getElementById(`error-${field}`).textContent = "";
  });
  document.getElementById("successMsg").textContent = "";

  const token = localStorage.getItem("accessToken");
  if (!token) {
    alert("Debes iniciar sesión como superusuario.");
    return;
  }

  // Recoger datos
  const data = {
    username: document.getElementById("username").value.trim(),
    email: document.getElementById("email").value.trim(),
    password: document.getElementById("password").value,
    ageUser: document.getElementById("ageUser").value,
    phoneUser: document.getElementById("phoneUser").value.trim(),
  };

  try {
    const res = await fetch("/api/crear-superuser/", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      // Mostrar errores específicos por campo o generales
      if (typeof result === "object") {
        for (const field in result) {
          const fieldSpan = document.getElementById(`error-${field}`);
          if (fieldSpan) {
            fieldSpan.textContent = result[field].join(" ");
          } else {
            // Errores generales (como detail)
            alert(result[field]);
          }
        }
      } else {
        alert("Ocurrió un error desconocido.");
      }
      return;
    }

    // Éxito
    document.getElementById("successMsg").textContent = result.message || "¡Superusuario creado correctamente!";
    document.getElementById("form-superuser").reset();

  } catch (error) {
    console.error("Error al enviar solicitud:", error);
    alert("Error de conexión con el servidor. Intenta de nuevo.");
  }
});





document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', function () {
      const container = this.closest('.password-container');
      const passwordInput = container.querySelector('input[type="password"], input[type="text"]');
      const icon = this.querySelector('i');

      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
      } else {
        passwordInput.type = 'password';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
      }
    });
  });
});

