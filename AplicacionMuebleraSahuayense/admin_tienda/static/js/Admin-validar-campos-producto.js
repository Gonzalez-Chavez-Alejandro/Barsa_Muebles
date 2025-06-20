function validarAgregarProductos(){
    // constantes que muestran errores y obtienen el valor de los campos
    const errorName = document.getElementById('error-nameFurniture');
    const errorDescripcion = document.getElementById('error-descriptionFurniture');
    const errorPrice = document.getElementById('error-priceFurniture');
    const errorDescuento = document.getElementById('error-porcentajeDescuento');
    const nameData = document.getElementById('nameFurniture').value.trim();
    const descripcionData = document.getElementById('descriptionFurniture').value.trim();
    const priceData = document.getElementById('priceFurniture').value.trim();
    const descuentoData = document.getElementById('porcentajeDescuento').value.trim();

    // Limpiar errores
    errorName.style.display = 'none';
    errorName.textContent = '';
    errorDescripcion.style.display = 'none';
    errorDescripcion.textContent = '';
    errorPrice.style.display = 'none';
    errorPrice.textContent = '';
    errorDescuento.style.display = 'none';
    errorDescuento.textContent = '';

    // variable de control
    var ban = true;

    // validar que el nombre tenga caracteres correctos
    const validarName = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(nameData);

    // if de control de errores
    if(!validarName){
        // Mostrar errores
        errorName.style.display = 'block';
        errorName.textContent = 'El nombre no debe de contener caracteres como @ - . ,';
        // evita que se guarden datos erroneos
        ban = false;
    }
    // límite de caracteres en descripción 1500, control
    if(descripcionData.length > 1500){
        // Mostrar errores
        errorDescripcion.style.display = 'block';
        errorDescripcion.textContent = 'No se pueden agregar mas de 1500 caracteres';
        // evita que se guarden datos erroneos
        ban = false;
    }
    // control de que el precio sea un número
    const numero = parseInt(priceData);
    // if de control del número
    if(isNaN(numero)){
        // Mostrar errores
        errorPrice.style.display = 'block';
        errorPrice.textContent = 'Solo se pueden agregar números';
        // evita que se guarden datos erroneos
        ban = false;
    }
    // if de control para que el precio sea mayor a 0
    if(numero <= 0){
        // Mostrar errores
        errorPrice.style.display = 'block';
        errorPrice.textContent = 'Tienes que agregar un precio mayor a 0';
        // evita que se guarden datos erroneos
        ban = false;
    }
    // control para asegurar que sea un número el descuento
    const descuentoNum = parseInt(descuentoData);
    // if de control para asegurar que sea un número
    if(isNaN(descuentoNum)){
        // Mostrar errores
        errorDescuento.style.display = 'block';
        errorDescuento.textContent = 'Solo se pueden agregar números';
        // evita que se guarden datos erroneos
        ban = false;
    }
    // if de control para que este dentro del rango de 0 a 100
    if(descuentoNum < 0 || descuentoNum > 100){
        // Mostrar errores
        errorDescuento.style.display = 'block';
        errorDescuento.textContent = 'Tiene que ser un descuento entre 0 y 100';
        // evita que se guarden datos erroneos
        ban = false;
    }
    // en caso de no tener error regresa true
    return ban;
}