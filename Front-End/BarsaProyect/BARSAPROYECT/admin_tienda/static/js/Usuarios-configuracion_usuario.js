const usuario = JSON.parse(localStorage.getItem('usuarioLogueado')) || {
    nombre: '',
    correo: '',
    telefono: '',
    contrasena: ''
};

// Cargar datos de usuario
document.getElementById('nombre').value = usuario.nombre;
document.getElementById('correo').value = usuario.correo;
document.getElementById('telefono').value = usuario.telefono;
document.getElementById('contrasena').value = usuario.contrasena;

// Guardar datos de usuario
document.getElementById('form-configuracion').addEventListener('submit', (e) => {
    e.preventDefault();

    usuario.nombre = document.getElementById('nombre').value;
    usuario.correo = document.getElementById('correo').value;
    usuario.telefono = document.getElementById('telefono').value;
    usuario.contrasena = document.getElementById('contrasena').value;

    localStorage.setItem('usuarioLogueado', JSON.stringify(usuario));
    alert('Cambios guardados exitosamente');
    window.location.href = "{% url 'h' %}";
});

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

    // Encabezado
    doc.setFontSize(18);
    doc.setTextColor(configPDF.colors.primary);
    doc.setFont("helvetica", "bold");
    
    const encargoText = `Encargo #${encargo.id}`;
    const maxWidth = configPDF.pageWidth - configPDF.margins.left - configPDF.margins.right;
    const encargoLines = doc.splitTextToSize(encargoText, maxWidth);
    
    doc.text(encargoLines, configPDF.margins.left, configPDF.margins.top);

    // Información empresa
    doc.setFontSize(10);
    doc.setTextColor(configPDF.colors.secondary);
    doc.text(
        configPDF.companyName,
        configPDF.logoConfig.x + configPDF.logoConfig.width + 10,
        configPDF.logoConfig.y + 5
    );

    // Fecha
    const fechaYPosition = configPDF.margins.top + (encargoLines.length * lineHeight) + 5;
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