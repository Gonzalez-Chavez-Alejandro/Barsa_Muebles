let usuarioActual = null;  // variable global para guardar usuario completo

// Función para cargar info del usuario desde API
async function cargarUsuarioActual() {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    alert('No estás autenticado. Inicia sesión primero.');
    window.location.href = '/login';
    return null;
  }

  try {
    const res = await fetch('/api/user-info/', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('No autorizado');

    const user = await res.json();
    usuarioActual = user;  // guardamos para usar luego

    // Guardamos info del usuario también en localStorage para PDF (opcional)
    localStorage.setItem('usuarioLogueado', JSON.stringify({
      nombre: user.nombre || user.username || '',
      correo: user.email || user.correo || '',
      telefono: user.phoneUser || user.telefono || ''
    }));

    return user;
  } catch (error) {
    alert('Error al obtener información del usuario.');
    console.error(error);
    return null;
  }
}

// Función para cargar y mostrar encargos del usuario actual
async function cargarEncargosUsuario() {
  const user = await cargarUsuarioActual();
  if (!user) return; // si no hay usuario, no continuar

  const encargos = JSON.parse(localStorage.getItem('encargos')) || [];

  // Filtrar encargos por email del usuario actual
  const emailUsuario = user.email || user.correo || '';
  const encargosUsuario = encargos
    .filter(encargo => encargo.usuario.email === emailUsuario || encargo.usuario.correo === emailUsuario)
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  const contenedor = document.getElementById('lista-encargos');
  contenedor.innerHTML = '';

  if (encargosUsuario.length === 0) {
    contenedor.innerHTML = `
      <div class="encargo-card">
        <p class="messaje-no-tienes-encargos-registrados">
          <i class="fas fa-box-open"></i>
          No tienes encargos registrados
        </p>
      </div>
    `;
    return;
  }

  encargosUsuario.forEach(encargo => {
    const encargoId = encargo.id.toString();
    const idDisplay = encargoId.includes('-') ? encargoId.split('-')[0] : encargoId;

    const productosHTML = encargo.productos.map(producto => {
      const imagenValida = producto.imagen && typeof producto.imagen === 'string';
      const imagenes = imagenValida ? producto.imagen.split(',') : [];
      const primeraImagen = imagenes[0] ? imagenes[0].trim() : 'https://via.placeholder.com/100';

      return `
        <div class="producto-encargo">
          <img src="${primeraImagen}" 
               alt="${producto.nombre}" 
               class="producto-imagen"
               onerror="this.src='https://via.placeholder.com/100'">
          <div>
            <p>${producto.nombre}</p>
            <p>${producto.cantidad} x $${producto.precio?.toFixed(2) || '0.00'}</p>
          </div>
        </div>
      `;
    }).join('');

    const encargoElement = document.createElement('div');
    encargoElement.className = 'encargo-card';
    encargoElement.innerHTML = `
      <div class="encargo-header">
        <div>
          <h3>Encargo #${idDisplay}</h3>
          <small class="encargo-id">${encargoId}</small>
        </div>
        <span class="encargo-fecha">${new Date(encargo.fecha).toLocaleDateString()}</span>
      </div>
      <div class="encargo-productos">${productosHTML}</div>
      <div class="encargo-total">
        Total: $${encargo.total?.toFixed(2) || '0.00'}
      </div>
      <div class="encargo-acciones">
        <button class="btn-pdf" data-encargo='${JSON.stringify(encargo)}'>
          <i class="fas fa-file-pdf"></i> PDF
        </button>
        <button class="btn-eliminar" data-encargo-id="${encargo.id}">
          <i class="fas fa-trash-alt"></i> Eliminar
        </button>
      </div>
    `;

    contenedor.appendChild(encargoElement);
  });
}

// Evento delegado para botones PDF y eliminar
document.addEventListener('click', (e) => {
  // PDF
  if (e.target.closest('.btn-pdf')) {
    const btn = e.target.closest('.btn-pdf');
    const encargo = JSON.parse(btn.dataset.encargo);
    generarPDF(encargo);
  }

  // Eliminar
  if (e.target.closest('.btn-eliminar')) {
    const btn = e.target.closest('.btn-eliminar');
    const encargoId = btn.dataset.encargoId;
    if (confirm('¿Estás seguro de querer eliminar este encargo?')) {
      let encargos = JSON.parse(localStorage.getItem('encargos')) || [];
      encargos = encargos.filter(e => e.id !== encargoId);
      localStorage.setItem('encargos', JSON.stringify(encargos));

      // Remover del DOM
      const card = btn.closest('.encargo-card');
      if (card) card.remove();

      // Si ya no hay encargos, mostrar mensaje
      const contenedor = document.getElementById('lista-encargos');
      if (!contenedor.querySelector('.encargo-card')) {
        contenedor.innerHTML = `
          <div class="encargo-card">
            <p class="messaje-no-tienes-encargos-registrados">
              <i class="fas fa-box-open"></i>
              No tienes encargos registrados
            </p>
          </div>
        `;
      }
    }
  }
});

// Al cargar DOM
document.addEventListener('DOMContentLoaded', cargarEncargosUsuario);


// PDF config y función
const configPDF = {
  logoUrl: 'https://res.cloudinary.com/dacrpsl5p/image/upload/v1745430695/Logo-Negro_nfvywi.png',
  logoConfig: { x: 15, y: 12, width: 40, height: 15 },
  margins: { left: 45, right: 15, top: 50 },
  colors: { primary: '#2d3748', secondary: '#4a5568', accent: '#4a5568' },
  companyName: "Distribuidora mueblera sahuayense Barsa muebles",
  pageWidth: 210
};

function generarPDF(encargo) {
  const doc = new window.jspdf.jsPDF();
  const lineHeight = 7;

  // Logo
  doc.addImage(
    configPDF.logoUrl,
    'PNG',
    configPDF.logoConfig.x,
    configPDF.logoConfig.y,
    configPDF.logoConfig.width,
    configPDF.logoConfig.height
  );

  // Información empresa
  doc.setFontSize(10);
  doc.setTextColor(configPDF.colors.secondary);
  doc.text(
    configPDF.companyName,
    configPDF.logoConfig.x + configPDF.logoConfig.width + 10,
    configPDF.logoConfig.y + 5
  );

  // Obtener datos del usuario guardados
  const usuario = JSON.parse(localStorage.getItem('usuarioLogueado')) || {};

  // Información del cliente
  let yPosition = configPDF.logoConfig.y + configPDF.logoConfig.height + 10;
  doc.setFontSize(12);
  doc.setTextColor(configPDF.colors.primary);
  doc.setFont("helvetica", "bold");
  doc.text("Información del Cliente:", configPDF.margins.left, yPosition);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  yPosition += 7;
  doc.text(`Nombre: ${usuario.nombre || ''}`, configPDF.margins.left, yPosition);
  yPosition += 7;
  doc.text(`Correo: ${usuario.correo || ''}`, configPDF.margins.left, yPosition);
  yPosition += 7;
  doc.text(`Teléfono: ${usuario.telefono || ''}`, configPDF.margins.left, yPosition);

  // Encabezado del encargo
  yPosition += 15;
  doc.setFontSize(18);
  doc.setTextColor(configPDF.colors.primary);
  doc.setFont("helvetica", "bold");
  const encargoText = `Encargo #${encargo.id}`;
  const maxWidth = configPDF.pageWidth - configPDF.margins.left - configPDF.margins.right;
  const encargoLines = doc.splitTextToSize(encargoText, maxWidth);
  doc.text(encargoLines, configPDF.margins.left, yPosition);

  // Fecha
  const fechaYPosition = yPosition + (encargoLines.length * lineHeight) + 5;
  doc.setFontSize(12);
  doc.text(
    `Fecha: ${new Date(encargo.fecha).toLocaleDateString()}`,
    configPDF.margins.left,
    fechaYPosition
  );

  // Tabla encabezado
  let y = fechaYPosition + 10;
  doc.setFillColor(configPDF.colors.accent);
  doc.rect(
    configPDF.margins.left - 5,
    y,
    configPDF.pageWidth - configPDF.margins.left - configPDF.margins.right + 10,
    8,
    'F'
  );

  // Encabezados tabla
  doc.setFontSize(12);
  doc.setTextColor(255);
  doc.text('Producto', configPDF.margins.left, y + 6);
  doc.text('Cantidad', 100, y + 6);
  doc.text('Precio', 150, y + 6);

  // Contenido tabla
  y += 12;
  doc.setFontSize(10);
  doc.setTextColor(configPDF.colors.primary);

  encargo.productos.forEach(producto => {
    const productLines = doc.splitTextToSize(producto.nombre, 60);
    const productHeight = productLines.length * lineHeight;

    doc.text(productLines, configPDF.margins.left, y);
    doc.text(producto.cantidad.toString(), 100, y);
    doc.text(`$${producto.precio.toFixed(2)}`, 150, y);

    y += productHeight > 8 ? productHeight : 8;
  });

  // Total
  y += 10;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`Total: $${encargo.total.toFixed(2)}`, 150, y);

  doc.save(`encargo-${encargo.id}.pdf`);
}

