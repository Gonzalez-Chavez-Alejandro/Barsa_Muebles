// Admin-Catalogo-link.js
const STORAGE_KEY = 'pdfConfig';

// Función para formatear enlaces de Google Drive
function formatearEnlace(link) {
    // Expresión regular para convertir cualquier formato de enlace a /preview
    return link.replace(/\/d\/([a-zA-Z0-9-_]+)\/.*/, '/d/$1/preview')
              .replace(/\/view\?usp=sharing$/, '/preview')
              .replace(/\/edit\?usp=sharing$/, '/preview');
}
 
// Función para validar enlaces de Google Drive
function validarEnlace(link) {
    const pattern = /^https:\/\/drive\.google\.com\/file\/d\/[a-zA-Z0-9-_]+\/preview$/;
    return pattern.test(link);
}

// Cargar configuración inicial
function cargarConfiguracion() {
    const guardado = localStorage.getItem(STORAGE_KEY);
    if (guardado) {
        const enlaceFormateado = formatearEnlace(guardado);
        if (validarEnlace(enlaceFormateado)) {
            document.getElementById('nuevoEnlace').value = enlaceFormateado;
            localStorage.setItem(STORAGE_KEY, enlaceFormateado); // Actualizar formato si es necesario
        }
    }
}

// Actualizar PDF con verificación y formato automático
function actualizarPDF() {
    let nuevoEnlace = document.getElementById('nuevoEnlace').value;
    
    // Formatear el enlace antes de validar
    nuevoEnlace = formatearEnlace(nuevoEnlace);
    
    if (!validarEnlace(nuevoEnlace)) {
        alert('Enlace inválido. Ejemplo válido:\nhttps://drive.google.com/file/d/TU_ID/preview');
        return;
    }

    // Actualizar el campo con la versión formateada
    document.getElementById('nuevoEnlace').value = nuevoEnlace;
    
    // Guardar y notificar cambios
    localStorage.setItem(STORAGE_KEY, nuevoEnlace);
    window.dispatchEvent(new StorageEvent('storage', {
        key: STORAGE_KEY,
        newValue: nuevoEnlace
    }));
    
    toggleAdmin();
    alert('Catálogo actualizado correctamente:\n' + nuevoEnlace);
}

// Toggle panel admin
function toggleAdmin() {
    const panel = document.getElementById('adminPanel');
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    cargarConfiguracion();
    
    // Escuchar cambios externos y formatear
    window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY) {
            const enlaceFormateado = formatearEnlace(e.newValue);
            document.getElementById('nuevoEnlace').value = enlaceFormateado;
        }
    });

    // Validación en tiempo real
    document.getElementById('nuevoEnlace').addEventListener('input', function(e) {
        this.value = formatearEnlace(this.value);
    });
});
function limpiarCampo() {
  document.getElementById('nuevoEnlace').value = '';
}
