
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

def administrador_editar_producto(request, id):  # <- ¡IMPORTANTE!
    print(f"Vista ejecutada con id={id}")  # ← aquí sí sirve
    print("== Vista correcta ejecutándose ==")
    producto = get_object_or_404(Productos, id=id)
    categorias = Categorias.objects.all()
    
    if request.method == 'POST':
        producto.nameFurniture = request.POST.get('nameFurniture', '')
        producto.descriptionFurniture = request.POST.get('descriptionFurniture', '')
        producto.priceFurniture = request.POST.get('priceFurniture', 0)
        producto.porcentajeDescuento = request.POST.get('porcentajeDescuento', 0)
        producto.stateFurniture = request.POST.get('stateFurniture') == 'on'
        producto.imageFurniture = request.POST.get('imageFurniture', '')
        producto.save()

        categorias_seleccionadas = request.POST.getlist('categoryID')
        producto.categoryID.set(categorias_seleccionadas)

        messages.success(request, "Producto actualizado correctamente.")
        return redirect('administrador')
    
    return render(request, 'admin_tienda/Administrador-Editar-producto.html', {
        'producto': producto,
        'categorias': categorias
    })

