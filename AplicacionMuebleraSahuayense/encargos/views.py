# encargos/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Encargo, ProductoEncargado
from .serializer import EncargoSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listar_encargos_usuario(request):
    usuario = request.user
    encargos = Encargo.objects.filter(usuario=usuario).order_by('-fecha')
    serializer = EncargoSerializer(encargos, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def crear_encargo(request):
    usuario = request.user
    productos = request.data.get('productos', [])
    total = 0
    encargo = Encargo.objects.create(usuario=usuario, total=0)

    for p in productos:
        producto_id = p.get('producto_id')
        cantidad = p.get('cantidad')
        precio_unitario = p.get('precio_unitario')

        if not all([producto_id, cantidad, precio_unitario]):
            continue  # puedes manejar errores si falta algún dato

        ProductoEncargado.objects.create(
            encargo=encargo,
            producto_id=producto_id,
            cantidad=cantidad,
            precio_unitario=precio_unitario
        )
        total += cantidad * float(precio_unitario)

    encargo.total = total
    encargo.save()
    serializer = EncargoSerializer(encargo)
    return Response(serializer.data, status=201)


@api_view(['PATCH'])  # o POST si prefieres
@permission_classes([IsAuthenticated])
def agregar_producto_a_encargo(request, encargo_id):
    try:
        encargo = Encargo.objects.get(id=encargo_id, usuario=request.user)
    except Encargo.DoesNotExist:
        return Response({"detail": "Encargo no encontrado"}, status=404)

    producto_id = request.data.get('producto_id')
    cantidad = int(request.data.get('cantidad', 1))
    precio_unitario = float(request.data.get('precio_unitario', 0))

    if not producto_id or cantidad <= 0 or precio_unitario < 0:
     return Response({"detail": "Datos inválidos"}, status=400)


    # Buscar si ya hay producto en el encargo
    producto_encargado, creado = ProductoEncargado.objects.get_or_create(
        encargo=encargo,
        producto_id=producto_id,
        defaults={'cantidad': cantidad, 'precio_unitario': precio_unitario}
    )

    if not creado:
        producto_encargado.cantidad += cantidad
        producto_encargado.save()

    # Recalcular total
    total = sum(p.cantidad * p.precio_unitario for p in encargo.productos_encargados.all())
    encargo.total = total
    encargo.save()

    serializer = EncargoSerializer(encargo)
    return Response(serializer.data)

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Encargo, ProductoEncargado
from .serializer import EncargoSerializer

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def actualizar_cantidad_producto_en_encargo(request, encargo_id):
    try:
        encargo = Encargo.objects.get(id=encargo_id, usuario=request.user)
    except Encargo.DoesNotExist:
        return Response({"detail": "Encargo no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    producto_id = request.data.get('producto_id')
    nueva_cantidad = request.data.get('cantidad')

    if producto_id is None or nueva_cantidad is None:
        return Response({"detail": "producto_id y cantidad son requeridos"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        nueva_cantidad = int(nueva_cantidad)
        if nueva_cantidad < 0:
            raise ValueError
    except ValueError:
        return Response({"detail": "Cantidad inválida"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        producto_encargado = ProductoEncargado.objects.get(encargo=encargo, producto_id=producto_id)
    except ProductoEncargado.DoesNotExist:
        return Response({"detail": "Producto no encontrado en el encargo"}, status=status.HTTP_404_NOT_FOUND)

    if nueva_cantidad == 0:
        # Eliminar el producto del encargo
        producto_encargado.delete()
    else:
        # Actualizar cantidad
        producto_encargado.cantidad = nueva_cantidad
        producto_encargado.save()

    # Recalcular total del encargo
    total = sum(p.cantidad * p.precio_unitario for p in encargo.productos_encargados.all())
    encargo.total = total
    encargo.save()

    serializer = EncargoSerializer(encargo)
    return Response(serializer.data)
