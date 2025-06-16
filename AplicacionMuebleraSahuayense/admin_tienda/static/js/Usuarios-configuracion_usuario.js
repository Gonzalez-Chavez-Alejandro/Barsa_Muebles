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
      nombre: data.nameUser || data.nombre || data.username || '',
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
        const producto = item.producto || {};
        const imagen = item.imagen || 'https://via.placeholder.com/100';
        const nombre = producto.nameFurniture || 'Producto';
        const cantidad = Number(item.cantidad) || 0;
        const precioOriginal = Number(producto.priceFurniture) || 0;
        const porcentajeDescuento = producto.porcentajeDescuento || 0;
        const precioConDescuento = Number(producto.PrecioOferta) || precioOriginal;

        return `
          <div class="producto-encargo">
            <img src="${imagen}" alt="${nombre}" class="producto-imagen" onerror="this.src='https://via.placeholder.com/100'">
            <div>
              <p><strong>${nombre}</strong></p>
              <p>Cantidad: ${cantidad}</p>
              <p>Precio original: $${precioOriginal.toFixed(2)}</p>
              <p>Descuento: ${porcentajeDescuento}%</p>
              <p>Precio con descuento: $${precioConDescuento.toFixed(2)}</p>
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

function generarPDF(encargo) {
  console.log('usuarioActual:', usuarioActual);
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
  doc.rect(config.margins.left - 1, y, config.pageWidth - config.margins.left - config.margins.right + 10, 8, 'F');
  doc.setTextColor(255).setFontSize(12);
  doc.text('Producto', config.margins.left, y + 6);
  doc.text('Cantidad', 90, y + 6);
  doc.text('Precio original', 125, y + 6);
  doc.text('Precio con descuento', 160, y + 6);

  y += 12;
  doc.setFontSize(10).setTextColor(config.colors.primary);

  let tieneProductoConPrecioCero = false;

  (encargo.productos_encargados || []).forEach(item => {
    const nombre = (item.producto && item.producto.nameFurniture) || 'Producto';
    const cantidad = Number(item.cantidad) || 0;
    const precioOriginal = Number(item.producto?.priceFurniture) || 0;
    const precioConDescuento = Number(item.producto?.PrecioOferta) || 0;

    if (precioOriginal === 0 || precioConDescuento === 0) {
      tieneProductoConPrecioCero = true;
    }

    const textoPrecioOriginal = precioOriginal === 0 ? "No definido" : `$${precioOriginal.toFixed(2)}`;
    const textoPrecioConDescuento = precioConDescuento === 0 ? "No definido" : `$${precioConDescuento.toFixed(2)}`;

    const productLines = doc.splitTextToSize(nombre, 60);
    const productHeight = productLines.length * lineHeight;

    doc.text(productLines, config.margins.left, y);
    doc.text(cantidad.toString(), 90, y);
    doc.text(textoPrecioOriginal, 125, y);
    doc.text(textoPrecioConDescuento, 170, y);

    y += Math.max(productHeight, 8);
  });

  y += 10;
  doc.setFont("helvetica", "bold").setFontSize(12);

  if (tieneProductoConPrecioCero) {
    doc.setTextColor('#ff0000');
    doc.text("Total: Póngase en contacto con la empresa para aclarar el precio.", config.margins.left, y);
  } else {
    doc.setTextColor(config.colors.primary);
    doc.text(`Total: $${Number(encargo.total).toFixed(2)}`, 150, y);
  }

  doc.save(`encargo-${encargo.id}.pdf`);
}


// Al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
  await cargarUsuarioActual();
  await cargarEncargosUsuario();
});
