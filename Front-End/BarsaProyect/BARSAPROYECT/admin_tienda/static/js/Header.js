function toggleMenuUsuario() {
    const menu = document.getElementById("menu-usuario");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}

window.addEventListener('click', function(e) {
    const usuario = document.querySelector('.usuario-container');
    const menu = document.getElementById("menu-usuario");
    if (!usuario.contains(e.target)) {
        menu.style.display = "none";
    }
});


