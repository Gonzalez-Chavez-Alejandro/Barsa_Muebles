const usernameInput = document.getElementById("text"); 
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const repitPasswordInput = document.getElementById("repit-password");
const telefonoInput = document.getElementById("telefono");
const termsCheckbox = document.getElementById("user_signup[marketing_consent]");

const usernameError = document.getElementById("text-error");
const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");
const repitPasswordError = document.getElementById("repit-password-error");
const telefonoError = document.getElementById("telefono-error");

document.querySelector("button[type='button']").addEventListener("click", () => {
  let isValid = true;

  // Validar nombre de usuario
  const username = usernameInput.value.trim();
  if (username === "") {
    usernameError.textContent = "Por favor ingrese un nombre de usuario.";
    usernameInput.classList.add("invalid");
    usernameInput.classList.remove("valid");
    isValid = false;
  } else {
    usernameError.textContent = "";
    usernameInput.classList.add("valid");
    usernameInput.classList.remove("invalid");
  }

// Validar correo
const emailValue = emailInput.value.trim();
if (emailValue === "") {
  emailError.textContent = "Por favor ingrese un correo electrónico.";
  emailInput.classList.add("invalid");
  emailInput.classList.remove("valid");
  isValid = false;
} else if (!/\S+@\S+\.\S+/.test(emailValue)) {
  if (!emailValue.includes('@')) {
    emailError.textContent = "El correo electrónico debe contener una arroba (@).";
  } else {
    emailError.textContent = "El correo electrónico no es válido.";
  }
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
    passwordError.textContent = "Debe tener al menos 8 caracteres, una mayúscula y un número.";
    passwordInput.classList.add("invalid");
    passwordInput.classList.remove("valid");
    isValid = false;
  } else {
    passwordError.textContent = "";
    passwordInput.classList.add("valid");
    passwordInput.classList.remove("invalid");
  }

  // Validar repetir contraseña
  const repitPasswordValue = repitPasswordInput.value.trim();
  if (repitPasswordValue === "") {
    repitPasswordError.textContent = "Repetir la contraseña.";
    repitPasswordInput.classList.add("invalid");
    repitPasswordInput.classList.remove("valid");
    isValid = false;
  } else if (repitPasswordValue !== passwordValue) {
    repitPasswordError.textContent = "Las contraseñas no coinciden.";
    repitPasswordInput.classList.add("invalid");
    repitPasswordInput.classList.remove("valid");
    isValid = false;
  } else {
    repitPasswordError.textContent = "";
    repitPasswordInput.classList.add("valid");
    repitPasswordInput.classList.remove("invalid");
  }

  // Validar teléfono (10 dígitos)
  let telefonoValue = telefonoInput.value.trim().replace(/\D/g, ''); // Elimina todo lo que no es número

  if (telefonoValue.length > 10) {
    telefonoValue = telefonoValue.slice(0, 10); // Limita a 10 dígitos
  }

  if (telefonoValue.length !== 10) {
    telefonoError.textContent = "Ingrese 10 dígitos.";
    telefonoInput.classList.add("invalid");
    telefonoInput.classList.remove("valid");
    isValid = false;
  } else {
    telefonoError.textContent = "";
    telefonoInput.classList.add("valid");
    telefonoInput.classList.remove("invalid");
  }

  telefonoInput.value = telefonoValue.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'); // Formatea con guiones

  // Validar términos y condiciones
  if (!termsCheckbox.checked) {
    alert("Debe aceptar los términos y condiciones.");
    isValid = false;
  }

  if (isValid) {
    alert("Registro exitoso. Aquí podrías enviar los datos al servidor.");
  }
});

// Añadir un evento para que solo se ingresen números en el teléfono
telefonoInput.addEventListener("input", function() {
  let currentValue = this.value.replace(/[^0-9]/g, ''); // Elimina cualquier carácter que no sea número
  if (currentValue.length > 10) {
    currentValue = currentValue.slice(0, 10); // Limita a 10 dígitos
  }
  this.value = currentValue.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'); // Formatea con guiones
});
