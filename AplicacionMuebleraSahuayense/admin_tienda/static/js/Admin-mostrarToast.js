function mostrarToast(mensaje, tipo = "info") {
  const toast = document.getElementById("toast");
  const icon = document.getElementById("toastIcon");
  const texto = document.getElementById("toastMessage");

  // Cambiar mensaje
  texto.textContent = mensaje;

  // Estilos según tipo
  toast.className = ""; // Limpia clases anteriores
  if (tipo === "success") {
    toast.classList.add("success");
    icon.className = "fas fa-check-circle";
  } else if (tipo === "error") {
    toast.classList.add("error");
    icon.className = "fas fa-times-circle";
  } else {
    toast.classList.add("info");
    icon.className = "fas fa-info-circle";
  }

  // Mostrar
  toast.style.display = "flex";
  toast.style.opacity = 1;

  // Ocultar después de 3 segundos
  setTimeout(() => {
    toast.style.opacity = 0;
    setTimeout(() => {
      toast.style.display = "none";
    }, 300);
  }, 3000);
}

