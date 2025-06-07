let usuarioOriginal = null;  // variable global para guardar datos completos del usuario

async function cargarUsuarioLogueado() {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    alert('No estás autenticado. Inicia sesión primero.');
    window.location.href = '/login';
    return;
  }

  try {
    const response = await fetch('/api/user-info/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      alert('No se pudo obtener la información del usuario. Código: ' + response.status);
      console.error('No se pudo obtener la información del usuario:', response.statusText);
      return;
    }

    const user = await response.json();

    // Guardamos el usuario completo para usar luego en la actualización
    usuarioOriginal = user;

    document.getElementById('nombre').value = user.username || '';
    document.getElementById('telefono').value = user.phoneUser || '';
    const inputCorreo = document.getElementById('correo');
    inputCorreo.value = user.email || '';
    inputCorreo.dispatchEvent(new Event('input'));

    // Guardamos el ID para la actualización
    document.getElementById('form-configuracion').dataset.userId = user.id;

  } catch (error) {
    alert('Error al cargar datos del usuario. Revisa la consola para más detalles.');
    console.error('Error al cargar datos del usuario:', error);
  }
}

async function actualizarUsuarioLogueado(event) {
  event.preventDefault();

  const token = localStorage.getItem('accessToken');
  if (!token) {
    alert('No estás autenticado. Inicia sesión primero.');
    window.location.href = '/login';
    return;
  }

  const form = event.target;
  const userId = form.dataset.userId;

  if (!userId) {
    alert('No se encontró el ID del usuario para actualizar.');
    return;
  }

  if (!usuarioOriginal) {
    alert('No se cargaron los datos originales del usuario.');
    return;
  }

  // Clonamos el objeto original para no modificarlo directamente
  const data = { ...usuarioOriginal };

  // Sobrescribimos con los valores nuevos (o iguales)
  data.username = document.getElementById('nombre').value.trim() || data.username;
  data.phoneUser = document.getElementById('telefono').value.trim() || data.phoneUser;
  data.email = document.getElementById('correo').value.trim() || data.email;

  try {
    const response = await fetch(`/api/users/${userId}/`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      alert('Usuario actualizado correctamente');
      await cargarUsuarioLogueado();
    } else {
      let errText = await response.text();
      try {
        const errJson = JSON.parse(errText);
        errText = errJson.detail || JSON.stringify(errJson);
      } catch {
        // no es JSON, dejamos el texto tal cual
      }
      alert('Error al actualizar usuario: ' + errText);
      console.error('Error al actualizar usuario:', errText);
    }
  } catch (error) {
    alert('Error al actualizar usuario. Revisa la consola para más detalles.');
    console.error('Error al actualizar usuario:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  cargarUsuarioLogueado();
  document.getElementById('form-configuracion').addEventListener('submit', actualizarUsuarioLogueado);
});


/* 



// Cargar encargos
document.addEventListener("DOMContentLoaded", cargarEncargosUsuario);

function cargarEncargosUsuario() {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));
    if (!usuario) {
        window.location.href = "{% url 'h' %}";
        return;
    }

    const encargos = JSON.parse(localStorage.getItem('encargos')) || [];
    const encargosUsuario = encargos
        .filter(encargo => encargo.usuario.correo === usuario.correo)
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
            
            <div class="encargo-productos">
                ${encargo.productos.map(producto => {
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
                }).join('')}
            </div>
            
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

    // Event listeners para botones
    document.addEventListener('click', (e) => {
        // Manejar PDF
        if (e.target.closest('.btn-pdf')) {
            const button = e.target.closest('.btn-pdf');
            const encargo = JSON.parse(button.dataset.encargo);
            generarPDF(encargo);
        }
        
        // Manejar eliminación
        if (e.target.closest('.btn-eliminar')) {
            const button = e.target.closest('.btn-eliminar');
            const encargoId = button.dataset.encargoId;
            
            if (confirm('¿Estás seguro de querer eliminar este encargo?, asegurese de contactarnos para la verificacion.')) {
                // Actualizar localStorage
                const encargos = JSON.parse(localStorage.getItem('encargos')) || [];
                const nuevosEncargos = encargos.filter(e => e.id !== encargoId);
                localStorage.setItem('encargos', JSON.stringify(nuevosEncargos));
                
                // Eliminar del DOM
                const encargoCard = button.closest('.encargo-card');
                encargoCard.remove();
                
                // Mostrar mensaje si no hay encargos
                if (!document.querySelector('.encargo-card')) {
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
}

const configPDF = {
    logoUrl: 'https://res.cloudinary.com/dacrpsl5p/image/upload/v1745430695/Logo-Negro_nfvywi.png',
    logoConfig: {
        x: 15,
        y: 12,
        width: 40,
        height: 15
    },
    margins: { 
        left: 45, 
        right: 15, 
        top: 50
    },
    colors: {
        primary: '#2d3748',
        secondary: '#4a5568',
        accent: '#4a5568'
    },
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

    // Obtener datos del usuario
    const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));
    
    // Información del cliente
    let yPosition = configPDF.logoConfig.y + configPDF.logoConfig.height + 10;
    doc.setFontSize(12);
    doc.setTextColor(configPDF.colors.primary);
    doc.setFont("helvetica", "bold");
    doc.text("Información del Cliente:", configPDF.margins.left, yPosition);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    yPosition += 7;
    doc.text(`Nombre: ${usuario.nombre}`, configPDF.margins.left, yPosition);
    yPosition += 7;
    doc.text(`Correo: ${usuario.correo}`, configPDF.margins.left, yPosition);
    yPosition += 7;
    doc.text(`Teléfono: ${usuario.telefono}`, configPDF.margins.left, yPosition);
    
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

    // Tabla
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




*/

