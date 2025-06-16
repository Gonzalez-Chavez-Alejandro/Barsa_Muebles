let usuarioActual = null;

// Carga datos del usuario desde la API y guarda en usuarioActual
async function cargarUsuarioActual() {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    alert('No estás autenticado. Inicia sesión primero.');
    window.location.href = '/login';
    return;
  }

  try {
    const res = await fetch('/api/user-info/', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!res.ok) throw new Error('Error al obtener usuario');

    const data = await res.json();

    usuarioActual = {
      nombre: data.nameUser || data.nombre || '',
      correo: data.email || data.correo || '',
      telefono: data.phoneUser || data.telefono || ''
    };
  } catch (error) {
    console.error('Error al cargar usuario:', error);
    alert('No se pudo cargar la información del usuario.');
  }
}

// Carga encargos del usuario y los muestra en el contenedor
async function cargarEncargosUsuario() {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    alert('No estás autenticado. Inicia sesión primero.');
    window.location.href = '/login';
    return;
  }

  try {
    const res = await fetch('/encargos/mis-encargos/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    if (!res.ok) throw new Error('Error al cargar encargos');

    const encargosUsuario = await res.json();
    const contenedor = document.getElementById('lista-encargos');
    contenedor.innerHTML = '';

    if (!Array.isArray(encargosUsuario) || encargosUsuario.length === 0) {
      contenedor.innerHTML = `
        <div class="encargo-card">
          <p class="messaje-no-tienes-encargos-registrados">
            <i class="fas fa-box-open"></i> No tienes encargos registrados
          </p>
        </div>`;
      return;
    }

    encargosUsuario.forEach(encargo => {
      const productosHTML = (encargo.productos_encargados || []).map(item => {
        const imagen = item.imagen || 'https://via.placeholder.com/100';
        const nombre = (item.producto && item.producto.nameFurniture) || 'Producto';
        const cantidad = Number(item.cantidad) || 0;
        let precio = Number(item.precio_unitario);
        if (isNaN(precio)) precio = 0;

        return `
          <div class="producto-encargo">
            <img src="${imagen}" alt="${nombre}" class="producto-imagen" onerror="this.src='https://via.placeholder.com/100'">
            <div>
              <p>${nombre}</p>
              <p>${cantidad} x $${precio.toFixed(2)}</p>
            </div>
          </div>`;
      }).join('');

      const encargoElement = document.createElement('div');
      encargoElement.className = 'encargo-card';
      const encargoId = encargo.id.toString();
      const idDisplay = encargoId.includes('-') ? encargoId.split('-')[0] : encargoId;

      encargoElement.innerHTML = `
        <div class="encargo-header">
          <div>
            <h3>Encargo #${idDisplay}</h3>
            <small class="encargo-id">${encargoId}</small>
          </div>
          <span class="encargo-fecha">${new Date(encargo.fecha).toLocaleDateString()}</span>
        </div>
        <div class="encargo-productos">${productosHTML}</div>
        <div class="encargo-total">Total: $${Number(encargo.total).toFixed(2)}</div>
        <div class="encargo-acciones">
          <button class="btn-pdf" data-encargo='${encodeURIComponent(JSON.stringify(encargo))}'>
            <i class="fas fa-file-pdf"></i> PDF
          </button>
          <button class="btn-eliminar" data-encargo-id="${encargo.id}">
            <i class="fas fa-trash-alt"></i> Eliminar
          </button>
        </div>`;
      contenedor.appendChild(encargoElement);
    });

  } catch (error) {
    console.error(error);
    alert('Error al cargar los encargos del usuario.');
  }
}

// Escucha eventos para generar PDF y eliminar encargos
document.addEventListener('click', async (e) => {
  if (e.target.closest('.btn-pdf')) {
    const btn = e.target.closest('.btn-pdf');
    const encargo = JSON.parse(decodeURIComponent(btn.dataset.encargo));
    generarPDF(encargo);
  }

  if (e.target.closest('.btn-eliminar')) {
    const btn = e.target.closest('.btn-eliminar');
    const encargoId = btn.dataset.encargoId;

    if (confirm('¿Estás seguro de eliminar este encargo?')) {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('No estás autenticado.');
        window.location.href = '/login';
        return;
      }

      try {
        const res = await fetch(`/encargos/eliminar/${encargoId}/`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) throw new Error('No se pudo eliminar');

        btn.closest('.encargo-card').remove();

        const contenedor = document.getElementById('lista-encargos');
        if (!contenedor.querySelector('.encargo-card')) {
          contenedor.innerHTML = `
            <div class="encargo-card">
              <p class="messaje-no-tienes-encargos-registrados">
                <i class="fas fa-box-open"></i> No tienes encargos registrados
              </p>
            </div>`;
        }
      } catch (error) {
        console.error(error);
        alert('Error al eliminar encargo.');
      }
    }
  }
});

// Genera PDF con jsPDF
function generarPDF(encargo) {
  const doc = new window.jspdf.jsPDF();
  const lineHeight = 7;
  const config = {
    logoUrl: 'https://res.cloudinary.com/dacrpsl5p/image/upload/v1745430695/Logo-Negro_nfvywi.png',
    logoConfig: { x: 15, y: 12, width: 40, height: 15 },
    margins: { left: 45, right: 15, top: 50 },
    colors: { primary: '#2d3748', secondary: '#4a5568', accent: '#4a5568' },
    companyName: "Distribuidora mueblera sahuayense Barsa muebles",
    pageWidth: 210
  };

  doc.addImage(config.logoUrl, 'PNG', config.logoConfig.x, config.logoConfig.y, config.logoConfig.width, config.logoConfig.height);
  doc.setFontSize(10).setTextColor(config.colors.secondary);
  doc.text(config.companyName, config.logoConfig.x + 50, config.logoConfig.y + 5);

  let y = config.logoConfig.y + config.logoConfig.height + 10;
  doc.setFontSize(12).setTextColor(config.colors.primary).setFont("helvetica", "bold");
  doc.text("Información del Cliente:", config.margins.left, y);

  doc.setFont("helvetica", "normal").setFontSize(10);
  y += 7;
  doc.text(`Nombre: ${usuarioActual?.nombre || ''}`, config.margins.left, y);
  y += 7;
  doc.text(`Correo: ${usuarioActual?.correo || ''}`, config.margins.left, y);
  y += 7;
  doc.text(`Teléfono: ${usuarioActual?.telefono || ''}`, config.margins.left, y);

  y += 15;
  doc.setFontSize(18).setFont("helvetica", "bold");
  doc.text(`Encargo #${encargo.id}`, config.margins.left, y);

  y += 10;
  doc.setFontSize(12).setFont("helvetica", "normal");
  doc.text(`Fecha: ${new Date(encargo.fecha).toLocaleDateString()}`, config.margins.left, y);

  y += 10;
  doc.setFillColor(config.colors.accent);
  doc.rect(config.margins.left - 5, y, config.pageWidth - config.margins.left - config.margins.right + 10, 8, 'F');
  doc.setTextColor(255).setFontSize(12);
  doc.text('Producto', config.margins.left, y + 6);
  doc.text('Cantidad', 100, y + 6);
  doc.text('Precio', 150, y + 6);

  y += 12;
  doc.setFontSize(10).setTextColor(config.colors.primary);

  (encargo.productos_encargados || []).forEach(item => {
    const nombre = (item.producto && item.producto.nameFurniture) || 'Producto';
    const cantidad = Number(item.cantidad) || 0;

    let precio = Number(item.precio_unitario);
    if (isNaN(precio)) precio = 0;

    const productLines = doc.splitTextToSize(nombre, 60);
    const productHeight = productLines.length * lineHeight;

    doc.text(productLines, config.margins.left, y);
    doc.text(cantidad.toString(), 100, y);
    doc.text(`$${precio.toFixed(2)}`, 150, y);

    y += Math.max(productHeight, 8);
  });

  y += 10;
  doc.setFont("helvetica", "bold").setFontSize(12);
  doc.text(`Total: $${Number(encargo.total).toFixed(2)}`, 150, y);

  doc.save(`encargo-${encargo.id}.pdf`);
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
  await cargarUsuarioActual();
  await cargarEncargosUsuario();
});

