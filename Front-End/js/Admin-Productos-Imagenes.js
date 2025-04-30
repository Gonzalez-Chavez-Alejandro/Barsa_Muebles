const cloudName = 'dacrpsl5p'; // Tu nombre de Cloudinary
const uploadPreset = 'prueba'; // Tu upload preset

const fileInput = document.getElementById('fileInput');
const uploadButton = document.getElementById('uploadButton');
const preview = document.getElementById('preview');
const imageUrl = document.getElementById('imageUrl');

const linkSubir = document.getElementById('linkSubir');
const linkOtro = document.getElementById('linkOtro');
const sectionSubir = document.getElementById('subir');
const sectionOtro = document.getElementById('otro');

let lastUploadedFileName = null;

// Cambiar entre menús
linkSubir.addEventListener('click', () => {
  sectionSubir.classList.add('active');
  sectionOtro.classList.remove('active');
  linkSubir.classList.add('active');
  linkOtro.classList.remove('active');
});

linkOtro.addEventListener('click', () => {
  sectionSubir.classList.remove('active');
  sectionOtro.classList.add('active');
  linkOtro.classList.add('active');
  linkSubir.classList.remove('active');
});

// Subir imagen
uploadButton.addEventListener('click', async () => {
  const file = fileInput.files[0];

  if (!file) {
    alert('Por favor selecciona una imagen');
    return;
  }

  if (file.name === lastUploadedFileName) {
    const confirmacion = confirm('¿Estás seguro de subir la misma imagen otra vez?');
    if (!confirmacion) {
      return;
    }
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  try {
    preview.innerHTML = `<div class="spinner">🔄</div>`;
    preview.classList.remove('subido');
    imageUrl.value = '';

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    console.log('Respuesta completa:', data);

    if (data.secure_url) {
      preview.innerHTML = `<img src="${data.secure_url}" alt="Imagen subida">`;
      preview.classList.add('subido');
      imageUrl.value = data.secure_url;
      lastUploadedFileName = file.name;
    } else {
      preview.innerHTML = `<p>Error al subir: ${data.error.message}</p>`;
      preview.classList.remove('subido');
      console.error('Error de Cloudinary:', data.error.message);
    }

  } catch (error) {
    console.error('Error de red o de JavaScript:', error);
    preview.innerHTML = `<p>Error al subir imagen</p>`;
    preview.classList.remove('subido');
    imageUrl.value = '';
  }
});