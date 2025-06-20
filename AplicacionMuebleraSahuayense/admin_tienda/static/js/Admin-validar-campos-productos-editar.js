document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('validar-formulario');
    form.addEventListener("submit", function (e){
        if(!validarFormulario()){
            e.preventDefault();
        }
    });
});

function validarFormulario(){
    const errorName = document.getElementById('errorNombreP');
    const errorDescripcion = document.getElementById('errorDescripcion');
    const errorPrecio = document.getElementById('errorPrecio');
    const errorDescuento = document.getElementById('errorDescuento');
    const nameData = document.getElementById('nameData').value.trim();
    const descripcionData = document.getElementById('descripcionData').value.trim();
    const priceData = document.getElementById('priceData').value.trim();
    const descuentoData = document.getElementById('descuentoData').value.trim();

    errorName.style.display = 'none';
    errorName.textContent = '';
    errorDescripcion.style.display = 'none';
    errorDescripcion.textContent = '';
    errorPrecio.style.display = 'none';
    errorPrecio.textContent = '';
    errorDescuento.style.display = 'none';
    errorDescuento.textContent = '';

    var ban = true;

    const validarName = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(nameData);

    if(!validarName){
        errorName.style.display = 'block';
        errorName.textContent = 'El nombre no debe de contener caracteres como @ - . ,';
        ban = false;
    }

    if(descripcionData.length > 1500){
        errorDescripcion.style.display = 'block';
        errorDescripcion.textContent = 'La descripción no debe tener más de 1500 caracteres';
        ban = false;
    }

    const numero = parseInt(priceData);

    if(isNaN(numero)){
        errorPrecio.style.display = 'block';
        errorPrecio.textContent = 'Solo se admiten números';
        ban = false;
    }

    if(numero <= 0){
        errorPrecio.style.display = 'block';
        errorPrecio.textContent = 'El precio debe de ser mayor a 0';
        ban = false;
    }

    const descuentoNum = parseInt(descuentoData);

    if(isNaN(descuentoNum)){
        errorDescuento.style.display = 'block';
        errorDescuento.textContent = 'Solo se admiten números';
        ban = false;
    }

    if(descuentoNum < 0 || descuentoNum > 100){
        errorDescuento.style.display = 'block';
        errorDescuento.textContent = 'El descuento debe ser entre 0 y 100';
        ban = false;
    }

    return ban;

}
