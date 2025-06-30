function mostrarToast(mensaje, tipo = "info") {
  const toast = document.getElementById("toast");
  const icon = document.getElementById("toastIcon");
  const texto = document.getElementById("toastMessage");

  // Cambiar mensaje
  texto.textContent = mensaje;

  // Limpiar clases anteriores
  toast.className = ""; 
  toast.classList.add(tipo, "visible");

  // Cambiar ícono
  if (tipo === "success") {
    icon.className = "fas fa-check-circle";
  } else if (tipo === "error") {
    icon.className = "fas fa-times-circle";
  } else {
    icon.className = "fas fa-info-circle";
  }

  // Mostrar
  toast.style.display = "flex";
  toast.style.opacity = 1;

  // Ocultar después de 3 segundos
  setTimeout(() => {
    toast.style.opacity = 0;
    toast.classList.remove("visible");  // Desactiva pointer-events
    setTimeout(() => {
      toast.style.display = "none";
    }, 300);
  }, 3000);
}


