
#views productos
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from productos.models import Productos
from productos.serializer import ProductoSerializer

class ProductosListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        productos = Productos.objects.all()  # no hay relaciones a prefetch
        serializer = ProductoSerializer(productos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)



from django.shortcuts import render, get_object_or_404, redirect
from productos.models import Productos
from categorias.models import Categorias
from django.contrib import messages
from cloudinary.uploader import upload
import json

def administrador_editar_producto(request, id):
    producto = get_object_or_404(Productos, id=id)
    categorias = Categorias.objects.all()

    if request.method == 'POST':
        producto.nameFurniture = request.POST.get('nameFurniture', '')
        producto.descriptionFurniture = request.POST.get('descriptionFurniture', '')
        producto.priceFurniture = request.POST.get('priceFurniture', 0)
        producto.porcentajeDescuento = request.POST.get('porcentajeDescuento', 0)
        producto.stateFurniture = request.POST.get('stateFurniture') == 'on'

        # Obtener lista actual de imágenes
        imagenes_actuales = producto.imageFurniture.split(",") if producto.imageFurniture else []

        # Filtrar imágenes eliminadas
        imagenes_a_eliminar = request.POST.getlist('eliminar_imagenes[]')
        imagenes_actuales = [img for img in imagenes_actuales if img not in imagenes_a_eliminar]

        # Si se subieron nuevas imágenes, agregarlas
        imagenes_subidas = request.FILES.getlist('imageFurniture')
        print("Archivos subidos:", imagenes_subidas)
        for nueva_imagen in imagenes_subidas:
            resultado = upload(nueva_imagen)
            nueva_url = resultado.get('secure_url')
            imagenes_actuales.append(nueva_url)

        # Guardar la nueva lista de imágenes como string separado por comas
        producto.imageFurniture = ",".join(imagenes_actuales)

        producto.save()
        producto.categoryID.set(request.POST.getlist('categoryID[]'))

        messages.success(request, "Producto actualizado correctamente.")
        return redirect('administrador')

    return render(request, 'admin_tienda/Administrador-Editar-producto.html', {
        'producto': producto,
        'categorias': categorias
    })


from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from productos.models import Productos

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def eliminar_producto(request, id):
    try:
        producto = Productos.objects.get(id=id)
        producto.delete()
        return Response({'success': True})
    except Productos.DoesNotExist:
        return Response({'error': 'Producto no encontrado'}, status=404)



