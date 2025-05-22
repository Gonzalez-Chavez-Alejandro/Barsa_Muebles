from django.http import JsonResponse
from django.shortcuts import render
import cloudinary
import cloudinary.utils
import os
import time
import json

from django.views.decorators.csrf import csrf_exempt
from flask import app, render_template



cloudinary.config(
    cloud_name='dacrpsl5p',
    api_key='793629269656468',
    api_secret='McJk0x5SWIouN2WWdO77WM8mPIA'
)


DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'



# Ruta base para las carpetas (si las necesitas en el sistema de archivos)
BASE_DIR_CARPETAS = os.path.join(os.getcwd(), 'carpetas')  # Ajusta si es otra ruta

# Asegurar que la carpeta base exista
os.makedirs(BASE_DIR_CARPETAS, exist_ok=True)


ARCHIVO = 'carpetas.txt'

# ========================
# Generación de firma Cloudinary
# ========================
def generate_signature(request):
    public_id = request.GET.get('public_id')
    if not public_id:
        return JsonResponse({'error': 'public_id es necesario'}, status=400)

    timestamp = str(int(time.time()))
    params = {
        'timestamp': timestamp,
        'upload_preset': 'formulario',
        'public_id': public_id
    }

    signature = cloudinary.utils.api_sign_request(params, cloudinary.config().api_secret)

    return JsonResponse({
        'signature': signature,
        'timestamp': timestamp
    })



# ========================
# Vista principal (administrador)
# ========================
def administrador(request):
    carpetas = leer_carpetas()  # Leer carpetas desde el archivo
    return render(request, 'admin_tienda/Administrador.html', {'carpetas': carpetas})


# ========================
# Funciones para gestionar las carpetas
# ========================

# Función para leer las carpetas desde el archivo
def leer_carpetas():
    if not os.path.exists(ARCHIVO):
        return []
    with open(ARCHIVO, 'r') as f:
        contenido = f.read().strip()
        return contenido.split(',') if contenido else []


def guardar_carpeta(nombre):
    nombre = nombre.strip()
    carpetas = leer_carpetas()
    if nombre and nombre not in carpetas:
        carpetas.append(nombre)
        with open(ARCHIVO, 'w') as f:
            f.write(','.join(carpetas))

@csrf_exempt
def gestionar_carpetas(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            nombre = data.get('carpeta')
            if nombre:
                guardar_carpeta(nombre)
                return JsonResponse({'mensaje': 'Carpeta guardada', 'carpetas': leer_carpetas()})
        except json.JSONDecodeError:
            return JsonResponse({'error': 'JSON inválido'}, status=400)
    else:
        return JsonResponse({'carpetas': leer_carpetas()})


def mostrar_carpetas(request):
    carpetas = leer_carpetas()
    return render(request, 'carpetas.html', {'carpetas': carpetas})


# ========================
# Vista opcional para otra página que use carpetas
# ========================
def index(request):
    carpetas = leer_carpetas()  # Leer carpetas desde el archivo
    return render(request, 'index.html', {'carpetas': carpetas})



def home(request):
    return render(request, 'admin_tienda/Home.html')  # Ruta correcta de la plantilla

def login(request):
    return render(request, 'admin_tienda/Login.html')

def nosotros(request):
    return render(request, 'admin_tienda/Nosotros.html')

def registro(request):
    return render(request, 'admin_tienda/Registro.html')

def productos(request):
    return render(request, 'admin_tienda/Productos.html')

def productos_vista(request):
    return render(request, 'admin_tienda/Producto-vista-solo.html')

