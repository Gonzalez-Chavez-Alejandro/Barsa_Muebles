document.addEventListener("DOMContentLoaded", () => {
    let pedidos = JSON.parse(localStorage.getItem("encargos")) || [];
    const container = document.getElementById("pedidos-container");
    const inputBuscar = document.getElementById("um-input-buscar");

    // Función para crear HTML de cada pedido
    function crearPedidoHTML(pedido) {
        const usuario = pedido.usuario || {};
        const productosHTML = pedido.productos.map(p => {
            const imgUrl = p.imagen ? p.imagen.split(",")[0] : 'https://via.placeholder.com/100';
            return `
                <li class="um-producto-item">
                    <img src="${imgUrl}" alt="${p.nombre}" class="um-producto-img">
                    <div class="um-producto-info">
                        <h4>${p.nombre}</h4>
                        <span class="um-producto-detalle">${p.cantidad} × $${Number(p.precio).toFixed(2)}</span>
                    </div>
                </li>
            `;
        }).join('');

        return `
            <article class="um-pedido-card" data-id="${pedido.id}">
                <header class="um-pedido-header">
                    <div class="um-pedido-id">#${pedido.id}</div>
                    <time>${new Date(pedido.fecha).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}</time>
                </header>
                
                <div class="um-usuario-info">
                    <div class="um-info-item">
                        <i class="fas fa-user um-fas"></i>
                        ${usuario.nombre || 'Desconocido'}
                    </div>
                    <div class="um-info-item">
                        <i class="fas fa-envelope um-fas"></i>
                        ${usuario.correo || 'No proporcionado'}
                    </div>
                    <div class="um-info-item">
                        <i class="fas fa-phone um-fas"></i>
                        ${usuario.telefono || 'No proporcionado'}
                    </div>
                </div>

                <ul class="um-productos-lista">${productosHTML}</ul>

                <footer class="um-pedido-footer">
                    <button class="um-btn-pdf" data-id="${pedido.id}">
                        <i class="fas fa-file-pdf"></i> Generar PDF
                    </button>
                    <button class="um-btn-eliminar" data-id="${pedido.id}">
                        <i class="fas fa-check-circle"></i> Completado
                    </button>
                    <div class="um-total-container">
                        <span class="um-total-label">Total:</span>
                        <span class="um-total-precio">$${Number(pedido.total).toFixed(2)}</span>
                    </div>
                </footer>
            </article>
        `;
    }
container.addEventListener('click', (e) => {
    if (e.target.closest('.um-btn-eliminar')) {
        const boton = e.target.closest('.um-btn-eliminar');
        const id = parseInt(boton.dataset.id); // ¡Asegúrate de convertirlo a número!

        if (!isNaN(id)) {
            eliminarPedido(id);
            renderPedidos(pedidos); // Vuelve a renderizar tras eliminar
        } else {
            console.warn("ID inválido:", boton.dataset.id);
        }
    }
});

   function eliminarPedido(id) {
    console.log("Eliminando ID:", id);
    pedidos = pedidos.filter(p => parseInt(p.id) !== parseInt(id));
    console.log("Pedidos restantes:", pedidos);
    localStorage.setItem("encargos", JSON.stringify(pedidos));
}


    // Función para renderizar pedidos
    function renderPedidos(pedidosFiltrados) {
        container.innerHTML = '';
        
        if (pedidosFiltrados.length === 0) {
            container.innerHTML = `<p class="um-empty-state">📭 No se encontraron pedidos</p>`;
            return;
        }

        pedidosFiltrados.forEach(pedido => {
            const pedidoDiv = document.createElement('div');
            pedidoDiv.innerHTML = crearPedidoHTML(pedido);
            container.appendChild(pedidoDiv.firstElementChild);
        });
    }

    // Función para filtrar pedidos
    function filtrarPedidos(texto) {
        const busqueda = texto.toLowerCase().trim();
        return pedidos.filter(pedido => {
            const usuario = pedido.usuario || {};
            return (
                pedido.id.toString().includes(busqueda) ||
                (usuario.nombre || '').toLowerCase().includes(busqueda) ||
                (usuario.correo || '').toLowerCase().includes(busqueda) ||
                (usuario.telefono || '').includes(busqueda)
            );
        });
    }
    });
/*
// Configuración común
const configPDF = {
    logoUrl: 'https://res.cloudinary.com/dacrpsl5p/image/upload/v1745430695/Logo-Negro_nfvywi.png',
    logoConfig: {
        x: 15,  // Posición desde la izquierda
        y: 12,  // Posición desde arriba
        width: 40,  // Ancho en puntos (1cm ≈ 28.35 puntos)
        height: 15  // Alto proporcional (mantiene relación de aspecto)
    },
    margins: { left: 45, right: 15, top: 40 },
    colors: {
        primary: '#2d3748',
        secondary: '#4a5568',
        accent: '#4a5568'
    }
};

// Función auxiliar para cargar imágenes
function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(new Error('Error al cargar el logo'));
        img.src = url + '?v=' + Date.now(); // Cache buster
    });
}

async function generarPDFIndividual(pedido) {
    const doc = new jspdf.jsPDF();
    const logo = await loadImage(configPDF.logoUrl);
    
    // Calcular dimensiones del logo
    const aspectRatio = logo.width / logo.height;
    const logoHeight = configPDF.logoConfig.width / aspectRatio;

    // Encabezado profesional
    doc.addImage(
        logo,
        'PNG',
        configPDF.logoConfig.x,
        configPDF.logoConfig.y,
        configPDF.logoConfig.width,
        logoHeight
    );

    // Título principal
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(configPDF.colors.primary);
    doc.text(`Pedido #${pedido.id}`, configPDF.margins.left, 40);

    // Sección de información del cliente
    let y = 50;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(configPDF.colors.accent);
    doc.text('INFORMACIÓN DEL CLIENTE', configPDF.margins.left, y);
    y += 10;

    // Detalles del cliente
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(configPDF.colors.primary);
    const clienteInfo = [
        `Nombre: ${pedido.usuario.nombre || 'Desconocido'}`,
        `Correo: ${pedido.usuario.correo || 'No proporcionado'}`,
        `Teléfono: ${pedido.usuario.telefono || 'No proporcionado'}`,
        `Fecha: ${new Date(pedido.fecha).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}`
    ];

    clienteInfo.forEach(info => {
        doc.text(info, configPDF.margins.left, y);
        y += 8;
    });
    y += 15;

    // Tabla de productos (mismo estilo que reporte completo)
    const headers = [['Producto', 'Cantidad', 'P. Unitario', 'Total']];
    const rows = pedido.productos.map(p => [
        p.nombre,
        p.cantidad,
        `$${p.precio.toFixed(2)}`,
        `$${(p.cantidad * p.precio).toFixed(2)}`
    ]);

    doc.autoTable({
        startY: y,
        head: headers,
        body: rows,
        margin: { left: configPDF.margins.left },
        styles: {
            fontSize: 10,
            cellPadding: 3,
            textColor: configPDF.colors.primary,
            lineColor: configPDF.colors.secondary
        },
        headStyles: {
            fillColor: configPDF.colors.accent,
            textColor: '#ffffff',
            fontStyle: 'bold'
        },
        alternateRowStyles: {
            fillColor: '#f8fafc'
        }
    });

    // Total alineado a la derecha
    const finalY = doc.autoTable.previous.finalY + 15;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(configPDF.colors.accent);
    doc.text(`TOTAL: $${pedido.total.toFixed(2)}`, 160, finalY, { align: 'right' });

    // Pie de página idéntico al reporte completo
    doc.setFontSize(8);
    doc.setTextColor(configPDF.colors.secondary);
    const footerY = doc.internal.pageSize.height - 10;
    doc.text('© Barsa Muebles - Todos los derechos reservados', 15, footerY);

    // Línea decorativa superior al pie de página
    doc.setLineWidth(0.2);
    doc.setDrawColor(configPDF.colors.secondary);
    doc.line(15, footerY - 5, 195, footerY - 5);

    doc.save(`Pedido_${pedido.id}_${new Date().toISOString().split('T')[0]}.pdf`);
}

async function generarPDFTodos() {
    const doc = new jspdf.jsPDF();
    const logo = await loadImage(configPDF.logoUrl);
    let y = configPDF.margins.top;
    let pageNumber = 1;

    // Función para agregar encabezado con logo
    const addHeader = () => {
        // Calcular dimensiones manteniendo proporción
        const aspectRatio = logo.width / logo.height;
        const logoHeight = configPDF.logoConfig.width / aspectRatio;
        
        // Agregar logo
        doc.addImage(
            logo,
            'PNG',
            configPDF.logoConfig.x,
            configPDF.logoConfig.y,
            configPDF.logoConfig.width,
            logoHeight
        );
        
        // Texto del encabezado
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(configPDF.colors.primary);
        doc.text(`Reporte de Pedidos - Página ${pageNumber}`, configPDF.margins.left, 40);
        
        // Reiniciar posición Y
        y = 50;
    };

    // Encabezado inicial
    addHeader();

    pedidos.forEach((pedido, index) => {
        // Verificar espacio para nuevo pedido
        if (y > 250) {
            doc.addPage();
            pageNumber++;
            addHeader();
        }

        // Encabezado del pedido
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(configPDF.colors.accent);
        doc.text(`Pedido #${pedido.id}`, configPDF.margins.left, y);
        y += 8;

        // Información del cliente
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(configPDF.colors.primary);
        doc.text(`• Cliente: ${pedido.usuario.nombre || 'Desconocido'}`, configPDF.margins.left, y);
        y += 7;
        doc.text(`• Fecha: ${new Date(pedido.fecha).toLocaleDateString('es-ES')}`, configPDF.margins.left, y);
        y += 10;

        // Tabla de productos
        const headers = [['Producto', 'Cantidad', 'P. Unitario', 'Total']];
        const rows = pedido.productos.map(p => [
            p.nombre,
            p.cantidad,
            `$${p.precio.toFixed(2)}`,
            `$${(p.cantidad * p.precio).toFixed(2)}`
        ]);

        doc.autoTable({
            startY: y,
            head: headers,
            body: rows,
            margin: { left: configPDF.margins.left },
            styles: {
                fontSize: 10,
                cellPadding: 2,
                textColor: configPDF.colors.primary,
                lineColor: configPDF.colors.secondary
            },
            headStyles: {
                fillColor: configPDF.colors.secondary,
                textColor: '#ffffff',
                fontStyle: 'bold'
            },
            alternateRowStyles: {
                fillColor: '#f8fafc'
            }
        });

        // Total del pedido
        y = doc.autoTable.previous.finalY + 10;
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(`Total Pedido: $${pedido.total.toFixed(2)}`, 160, y, { align: 'right' });
        y += 15;

        // Línea divisoria estilizada
        doc.setLineWidth(0.3);
        doc.setDrawColor(configPDF.colors.accent);
        doc.line(15, y, 195, y);
        y += 12;
    });

    doc.save('Reporte_Completo_Pedidos.pdf');
}

    // Event Listeners
    inputBuscar.addEventListener('input', (e) => {
        renderPedidos(filtrarPedidos(e.target.value));
    });

    container.addEventListener('click', (e) => {
        // Eliminar pedido
        if (e.target.closest('.um-btn-eliminar')) {
            const id = Number(e.target.closest('.um-btn-eliminar').dataset.id);
            eliminarPedido(id);
            renderPedidos(pedidos);
        }
        
        // Generar PDF individual
        if (e.target.closest('.um-btn-pdf')) {
            const id = Number(e.target.closest('.um-btn-pdf').dataset.id);
            const pedido = pedidos.find(p => p.id === id);
            if (pedido) generarPDFIndividual(pedido);
        }
    });

    document.getElementById('um-exportar-todos').addEventListener('click', generarPDFTodos);

    // Carga inicial
    renderPedidos(pedidos);
});
*/