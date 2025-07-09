document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("/api/footer/");
    if (!res.ok) throw new Error("No se pudo obtener datos del footer");

    const data = await res.json();

    // Correos dinámicos
    const emailList = document.getElementById("dynamic-emails");
    emailList.innerHTML = '';  // Limpiar

    // Si tienes un arreglo 'emails' en el JSON, recorremos
    (data.emails || []).forEach(email => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = `mailto:${email}`;
      a.textContent = email;
      li.appendChild(a);
      emailList.appendChild(li);
    });

    // Lista de teléfonos
    const phoneList = document.getElementById("dynamic-phones");
    phoneList.innerHTML = '';
    (data.phones || []).forEach(phone => {
      const li = document.createElement("li");
      li.textContent = phone;
      phoneList.appendChild(li);
    });

    // Lista de ubicaciones
    const locationList = document.getElementById("dynamic-locations");
    locationList.innerHTML = '';
    (data.locations || []).forEach(loc => {
      const li = document.createElement("li");
      li.textContent = loc;
      locationList.appendChild(li);
    });

    // Redes sociales con íconos
    const socialContainer = document.getElementById("dynamic-social");
    socialContainer.innerHTML = '';
    for (const [platform, url] of Object.entries(data.socials || {})) {
      if (!url) continue;

      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';

      let iconClass = platform === 'whatsapp' ? 'fab fa-whatsapp' :
                      platform === 'email' ? 'fas fa-envelope' :
                      `fab fa-${platform.toLowerCase()}`;

      a.innerHTML = `<i class="${iconClass}"></i>`;
      socialContainer.appendChild(a);
    }

  } catch (err) {
    console.error("Error cargando footer:", err);
    //mostrarToast("Error cargando datos del footer.", "error");
    
  }
});