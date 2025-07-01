const API_URL = '/catalogos/catalogo-api/';

async function actualizarPDF() {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        alert("No estás autenticado.");
        return;
    }

    const nuevoEnlace = document.getElementById('nuevoEnlace').value.trim();

    if (!esURLValida(nuevoEnlace)) {
        alert("Por favor ingresa una URL válida.");
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ url_pdf: nuevoEnlace })
        });

        let data;
        const text = await response.text();

        try {
            data = JSON.parse(text);
        } catch {
            throw new Error("Respuesta inesperada del servidor: " + text);
        }

        if (!response.ok) {
            throw new Error(data.error || 'Error al guardar el catálogo en el servidor');
        }

        alert('Catálogo actualizado correctamente.\nSe abrirá el PDF en una pestaña nueva.');
        window.open(data.url_pdf, '_blank');  // Aquí abrimos en pestaña nueva

    } catch (error) {
        alert('Error al actualizar el catálogo:\n' + error.message);
        console.error(error);
    }
}


function limpiarCampo() {
    document.getElementById('nuevoEnlace').value = '';
}

function esURLValida(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}