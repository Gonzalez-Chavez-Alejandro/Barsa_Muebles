const submenu = document.getElementById("submenu-categorias");

categorias.forEach(categoria => {
  const li = document.createElement("li");
  li.classList.add("submenu-item");

  const link = document.createElement("a");
  link.href = "#"; // Puedes personalizar el href según tu estructura
  link.textContent = categoria.nombre;

  li.appendChild(link);
  submenu.appendChild(li);
});