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
              <p>Precio original: ${
                precioOriginal === 0 ? 'Póngase en contacto con la empresa' : `$${precioOriginal.toFixed(2)}`
              }</p>
              <p>Descuento: ${porcentajeDescuento}%</p>
              <p>Precio con descuento: $${precioConDescuento.toFixed(2)}</p>
            </div>
          </div>`;
      }).join('');

      const encargoElement = document.createElement('div');
      encargoElement.className = 'encargo-card';
      const encargoId = encargo.id.toString();
      const idDisplay = encargoId.includes('-') ? encargoId.split('-')[0] : encargoId;
      const estadoMostrar = (encargo.estado === 'procesado') ? 'procesando' : (encargo.estado || 'desconocido');

      // Aquí se añade el estado visible en la cabecera
      encargoElement.innerHTML = `
        <div class="encargo-header">
          <div>
            <h3>Encargo #${idDisplay}</h3>
            <h3>Estado:
            <p class="encargo-estado estado-${estadoMostrar.toLowerCase()}">
  <strong>${estadoMostrar.charAt(0).toUpperCase() + estadoMostrar.slice(1)}</strong>
</p>

            <small class="encargo-id">${encargoId}</small>
            </h3>

          </div>
          <span class="encargo-fecha">${new Date(encargo.fecha).toLocaleDateString()}</span>
        </div>
        <div class="encargo-productos">${productosHTML}</div>
        <div class="encargo-total">Total: $${Number(encargo.total).toFixed(2)}</div>
        <div class="encargo-acciones">
          <button class="btn-pdf" data-encargo='${encodeURIComponent(JSON.stringify(encargo))}'>
            <i class="fas fa-file-pdf"></i> PDF
          </button>
          <button class="btn-cancelar" data-encargo-id="${encargo.id}">
            <i class="fas fa-times-circle"></i> Cancelar pedido
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
// Evento global para delegar acciones
document.addEventListener('click', async (e) => {
  const btnPDF = e.target.closest('.btn-pdf');
  const btnCancelar = e.target.closest('.btn-cancelar');

  // Generar PDF
  if (btnPDF) {
    const encargo = JSON.parse(decodeURIComponent(btnPDF.dataset.encargo));
    generarPDF(encargo);
    return;
  }

  // Cancelar pedido
  if (btnCancelar) {
    const id = btnCancelar.getAttribute('data-encargo-id');
    if (!confirm('¿Estás seguro de que quieres cancelar este pedido?')) return;

    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`/encargos/${id}/cambiar-estado/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ estado: 'cancelado' })
      });

      if (!res.ok) throw new Error('Error al cancelar el pedido');
      alert('Pedido cancelado correctamente');
      cargarEncargosUsuario();  // recargar lista
    } catch (err) {
      console.error(err);
      alert('Hubo un error al cancelar el pedido.');
    }
  }
});


async function generarPDF(encargo) {
  console.log('usuarioActual:', usuarioActual);
  
  // Obtener datos del footer desde la API
  let footerData = null;
  try {
    const response = await fetch('/api/footer/');
    if (response.ok) {
      footerData = await response.json();
    }
  } catch (error) {
    console.error('Error al obtener datos del footer:', error);
  }

  const doc = new window.jspdf.jsPDF();
  const lineHeight = 7;
  const pageHeight = doc.internal.pageSize.height;
  const config = {
    logoUrl: 'https://res.cloudinary.com/dacrpsl5p/image/upload/v1745430695/Logo-Negro_nfvywi.png',
    logoConfig: { x: 15, y: 12, width: 40, height: 15 },
    margins: { left: 45, right: 15, top: 50, bottom: 30 },
    colors: { 
      primary: '#000000',
      secondary: '#4a5568',
      accent: '#4a5568',
      clientData: '#000000',  // Color para datos del cliente
      companyContact: '#000000' // Color para contacto de la empresa
    },
    companyName: "Distribuidora mueblera sahuayense Barsa muebles",
    pageWidth: 210
  };

  // Encabezado con logo y nombre de la empresa
  doc.addImage(config.logoUrl, 'PNG', config.logoConfig.x, config.logoConfig.y, config.logoConfig.width, config.logoConfig.height);
  doc.setFontSize(10).setTextColor(config.colors.secondary);
  doc.text(config.companyName, config.logoConfig.x + 50, config.logoConfig.y + 5);

  let y = config.logoConfig.y + config.logoConfig.height + 10;
  
  // Sección de Información del Cliente
  doc.setFontSize(15).setTextColor(config.colors.primary).setFont("helvetica", "bold");
  doc.text("INFORMACIÓN DEL CLIENTE", config.margins.left, y);
  y += 7;

  doc.setFont("helvetica", "normal").setFontSize(10);
  // Nombre del cliente
  doc.setTextColor(config.colors.clientData);
  doc.text(`Nombre: ${usuarioActual?.nombre || 'No especificado'}`, config.margins.left, y);
  y += 7;
  
  // Correo del cliente (destacado)
  doc.setFont("helvetica", "bold");
  doc.text(`Correo: `, config.margins.left, y);
  doc.setFont("helvetica", "normal");
  doc.text(`${usuarioActual?.correo || 'No especificado'}`, config.margins.left + 20, y);
  y += 7;
  
  // Teléfono del cliente
  doc.text(`Teléfono: ${usuarioActual?.telefono || 'No especificado'}`, config.margins.left, y);
  y += 15;

  // Detalles del encargo
  doc.setFontSize(18).setTextColor(config.colors.primary).setFont("helvetica", "bold");
  doc.text(`ENCARGO #${encargo.id}`, config.margins.left, y);
  y += 10;

  doc.setFontSize(12).setFont("helvetica", "normal");
  doc.text(`Fecha: ${new Date(encargo.fecha).toLocaleDateString()}`, config.margins.left, y);
  y += 10;

  // Tabla de productos
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

    if (precioOriginal === 0) {
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
    
    if (y > pageHeight - 30) {
      doc.addPage();
      y = config.margins.top;
    }
  });

  // Total del encargo
  y += 10;
  doc.setFont("helvetica", "bold").setFontSize(12);

  if (tieneProductoConPrecioCero) {
    doc.setTextColor('#ff0000');
    doc.text("Total: Póngase en contacto con la empresa para aclarar el precio.", config.margins.left, y);
  } else {
    doc.setTextColor(config.colors.primary);
    doc.text(`Total: $${Number(encargo.total).toFixed(2)}`, 150, y);
  }

  // FOOTER - INFORMACIÓN DE CONTACTO DE LA EMPRESA
  y += 20; // Espacio antes del footer
  
  // Línea separadora
  doc.setDrawColor(200);
  doc.line(config.margins.left, y, config.pageWidth - config.margins.right, y);
  y += 10;

  // Título "CONTACTO DE LA EMPRESA"
  doc.setFontSize(10).setTextColor(config.colors.companyContact).setFont("helvetica", "bold");
  doc.text("CONTACTO DE LA EMPRESA", config.margins.left, y);
  y += 7;

// Información de contacto de la empresa
doc.setFontSize(10).setTextColor(config.colors.companyContact).setFont("helvetica", "normal");

if (footerData) {
  // Filtrar el correo del cliente si aparece en los datos del footer
  const companyEmails = footerData.emails ? 
    footerData.emails.filter(email => email !== usuarioActual?.correo) : [];
  
  // Mostrar emails de la empresa con manejo de texto multilínea
  if (companyEmails.length > 0) {
    const emailText = `Email: ${companyEmails.join(' | ')}`;
    const emailLines = doc.splitTextToSize(emailText, config.pageWidth - config.margins.left - config.margins.right);
    emailLines.forEach(line => {
      if (y > pageHeight - 15) { // Verificar espacio para el footer
        doc.addPage();
        y = config.margins.top;
      }
      doc.text(line, config.margins.left, y);
      y += 5;
    });
  }

  // Mostrar teléfonos de la empresa con manejo de texto multilínea
  if (footerData.phones && footerData.phones.length > 0) {
    const phoneText = `Teléfono: ${footerData.phones.join(' | ')}`;
    const phoneLines = doc.splitTextToSize(phoneText, config.pageWidth - config.margins.left - config.margins.right);
    phoneLines.forEach(line => {
      if (y > pageHeight - 15) {
        doc.addPage();
        y = config.margins.top;
      }
      doc.text(line, config.margins.left, y);
      y += 5;
    });
  }

  // Mostrar ubicaciones de la empresa con manejo de texto multilínea
  if (footerData.locations && footerData.locations.length > 0) {
    const locationText = `Ubicación: ${footerData.locations.join(' | ')}`;
    const locationLines = doc.splitTextToSize(locationText, config.pageWidth - config.margins.left - config.margins.right);
    locationLines.forEach(line => {
      if (y > pageHeight - 15) {
        doc.addPage();
        y = config.margins.top;
      }
      doc.text(line, config.margins.left, y);
      y += 5;
    });
  }
} else {
  // Datos por defecto con manejo de texto multilínea
  const defaultEmail = 'Email: barsa@gmail.com';
  const defaultPhone = 'Tel3333333éfono: +52 000 111 5522';
  const defaultLocation = 'Ubicación: Carretera Sahuayo La Barca KM 5.4 | Juárez #100 Sahuayo Mich | Circunvalación #Jiquilpa';

  [defaultEmail, defaultPhone, defaultLocation].forEach(text => {
    const lines = doc.splitTextToSize(text, config.pageWidth - config.margins.left - config.margins.right);
    lines.forEach(line => {
      if (y > pageHeight - 15) {
        doc.addPage();
        y = config.margins.top;
      }
      doc.text(line, config.margins.left, y);
      y += 5;
    });
  });
}

  doc.save(`encargo-${encargo.id}.pdf`);
}




// Al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
  await cargarUsuarioActual();
  await cargarEncargosUsuario();
});
