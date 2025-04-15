const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");

document.querySelector("button[type='button']").addEventListener("click", () => {
  let isValid = true;

// Validar email
const emailValue = emailInput.value.trim();
if (emailValue === "") {
  emailError.textContent = "Por favor ingrese una dirección de correo electrónico.";
  emailInput.classList.add("invalid");
  emailInput.classList.remove("valid");
  isValid = false;
} else if (!emailValue.includes("@")) {
  emailError.textContent = "El correo electrónico debe contener un '@'.";
  emailInput.classList.add("invalid");
  emailInput.classList.remove("valid");
  isValid = false;
} else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailValue)) {
  emailError.textContent = "El correo electrónico no es válido. Ejemplo: usuario@dominio.com";
  emailInput.classList.add("invalid");
  emailInput.classList.remove("valid");
  isValid = false;
} else {
  emailError.textContent = "";
  emailInput.classList.add("valid");
  emailInput.classList.remove("invalid");
}


  // Validar contraseña
  const passwordValue = passwordInput.value.trim();
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])?.{8,}$/;

  if (passwordValue === "") {
    passwordError.textContent = "La contraseña es obligatoria.";
    passwordInput.classList.add("invalid");
    passwordInput.classList.remove("valid");
    isValid = false;
  } else if (!passwordRegex.test(passwordValue)) {
    passwordError.textContent = "La contraseña debe tener al menos 8 caracteres, una mayúscula y un número. El carácter especial es opcional.";
    passwordInput.classList.add("invalid");
    passwordInput.classList.remove("valid");
    isValid = false;
  } else {
    passwordError.textContent = "";  // Limpiar el mensaje de error si la contraseña es válida
    passwordInput.classList.add("valid"); // Asegurarse de agregar la clase "valid"
    passwordInput.classList.remove("invalid"); // Eliminar la clase "invalid"
  }

  if (isValid) {
    alert("Formulario válido. Aquí podrías iniciar sesión.");
  }
});
