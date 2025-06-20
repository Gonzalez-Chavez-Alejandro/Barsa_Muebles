// Es la función que se ejecuta al guardar el boton
function validarYGuardar() {
    // En esta línea obtengo todos los elementos del front para validarlos
    const errorName = document.getElementById('errorNombre');
    const errorAnos = document.getElementById('erroranos');
    const errorCorreo = document.getElementById('errorCorreo');
    const errorTelefono = document.getElementById('errorTelefono');
    const nameData = document.getElementById('nombreEditar').value.trim();
    const ageData = document.getElementById('apellidoEditar').value.trim();
    const correoData = document.getElementById('correoEditar').value.trim();
    const telefonoData = document.getElementById('telefonoEditar').value.trim();

    // Limpiar errores
    errorName.style.display = 'none';
    errorName.textContent = '';
    errorAnos.style.display = 'none';
    errorAnos.textContent = '';
    errorCorreo.style.display = 'none';
    errorCorreo.textContent = '';
    errorTelefono.style.display = 'none';
    errorTelefono.textContent = '';

    var ban = true;

    // --------------------- Validar Nombre ------------------------
    // Válido que el contenido solo tenga letras
    const validar = /^[A-Za-z]+$/.test(nameData);
    // con el if negado realizo la acción de mostrar el error o no
    if(!validar){
        // esto muestra el error
        errorName.style.display = 'block';
        errorName.textContent = 'Solo se pueden agregar letras no caracteres como: - @ , .';
        // esto evita que se guarde
        ban = false;
    }
    // --------------------- Validar Edad ------------------------
    // validar que sea un numero
    const number = parseInt(ageData, 10);
    // if para validar el tipo
    if(isNaN(number)){
        // muestra error de entrada
        errorAnos.style.display = 'block';
        errorAnos.textContent = 'Solo se pueden agregar números';
        // evita guardar
        ban = false;
    }
    // if para rango de número
    if(number <= 10 || number >= 100) {
        // muestra mensaje de rango de edades
        errorAnos.style.display = 'block';
        errorAnos.textContent = 'Solo se aceptan edades reales';
        // evita guardar
        ban = false;
    }
    // --------------------- Validar Correo ------------------------
    // Se valida que sea un correo valido
    const validarCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(correoData);
    // if para validar correo
    if(!validarCorreo){
        // muestra mensaje correo erroneo
        errorCorreo.style.display = 'block';
        errorCorreo.textContent = 'Ingresa un correo valido';
        // evita guardar
        ban = false;
    }
    // --------------------- Validar Telefono ------------------------
    // se valida que sea un número
    const telefonoNumero = parseInt(telefonoData);
    // if validar que sea un numero
    if(isNaN(telefonoNumero)){
        // muestra mensaje error de entrada
        errorTelefono.style.display = 'block';
        errorTelefono.textContent = 'Ingresa un numero';
        // evita guardar
        ban = false;
    }
    // se valida que sea válido el telefono
    const validarTelefono = /^[0-9]{10}$/.test(telefonoData);
    // if para validar telefono
    if(!validarTelefono){
        // muestra mensaje telefono erroneo
        errorTelefono.style.display = 'block';
        errorTelefono.textContent = 'Ingresa un numero de telefono valido';
        // evita guardar
        ban = false;
    }

    if(ban){
        // si brinca el if guarda los cambios con el metodo
        guardarCambios();
    }
}
// en esta parte es para limpiar los errores en caso de cancelar
const cancelar = document.getElementById('btnCancelar');
// aquí escucha el evento del boton cancelar
cancelar.addEventListener('click', function () {
    // obtengo el error
    const errorName = document.getElementById('errorNombre');
    const errorAnos = document.getElementById('erroranos');
    const errorCorreo = document.getElementById('errorCorreo');
    const errorTelefono = document.getElementById('errorTelefono');
    // Limpiar errores
    errorName.style.display = 'none';
    errorName.textContent = '';
    errorAnos.style.display = 'none';
    errorAnos.textContent = '';
    errorCorreo.style.display = 'none';
    errorCorreo.textContent = '';
    errorTelefono.style.display = 'none';
    errorTelefono.textContent = '';
});