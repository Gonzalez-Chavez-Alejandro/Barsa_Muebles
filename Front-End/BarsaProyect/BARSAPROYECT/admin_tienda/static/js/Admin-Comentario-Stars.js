function generarTablaHTML(filtro = "") {
  const tbody = document.getElementById("tabla-usuarios-comentarios");
  tbody.innerHTML = "";

  const usuariosProductos = new Set(
    window.comentarios.map(c => `${c.usuarioId}-${c.productoId}`)
  );

  let contador = 1;

  usuariosProductos.forEach(key => {
    const [usuarioId, productoId] = key.split("-").map(Number);
    const usuario = window.usuarios.find(u => u.id === usuarioId);
    const producto = window.productos.find(p => p.id === productoId);

    const nombreUsuario = usuario.nombre.toLowerCase();
    const nombreProducto = producto.nombre.toLowerCase();
    const filtroLower = filtro.toLowerCase();

    // Si no coincide con el filtro, no mostrar
    if (!nombreUsuario.includes(filtroLower) && !nombreProducto.includes(filtroLower)) return;

    const comentarios = window.comentarios
      .filter(c => c.usuarioId === usuarioId && c.productoId === productoId)
      .map(c => c.texto)
      .join(" | ");

    const calificacion = window.comentarios.find(
      c => c.usuarioId === usuarioId && c.productoId === productoId && typeof c.estrellas !== "undefined"
    )?.estrellas ?? "Sin calificación";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${contador++}</td>
      <td>${usuario.nombre}</td>
      <td>${producto.nombre}</td>
      <td>${comentarios}</td>
      <td>${calificacion}</td>
      <td>
        <button class="btn-admin-desing-delete" data-usuario-id="${usuarioId}" data-producto-id="${productoId}">
          <i class="fas fa-trash-alt"></i>
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });
}
// Mostrar tabla completa al inicio
generarTablaHTML();

// Filtro en tiempo real
document.getElementById("buscador-comentarios").addEventListener("input", function () {
  const filtro = this.value;
  generarTablaHTML(filtro);
});
