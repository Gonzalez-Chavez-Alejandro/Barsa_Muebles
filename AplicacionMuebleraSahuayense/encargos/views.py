from django.shortcuts import render

# Create your views here.
# encargos/views.py
from rest_framework import generics, permissions
from .models import Pedido, PedidoProducto
from .serializer import PedidoSerializer, CrearPedidoSerializer
from productos.models import Productos
from rest_framework.response import Response
from rest_framework import status

class PedidoListCreateAPIView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        pedidos = Pedido.objects.filter(usuario=request.user)
        serializer = PedidoSerializer(pedidos, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CrearPedidoSerializer(data=request.data)
        if serializer.is_valid():
            productos_data = serializer.validated_data['productos']
            total = serializer.validated_data['total']

            pedido = Pedido.objects.create(usuario=request.user, total=total)

            for item in productos_data:
                try:
                    producto = Productos.objects.get(id=item['producto_id'])
                except Productos.DoesNotExist:
                    pedido.delete()
                    return Response({"error": f"Producto id {item['producto_id']} no existe"}, status=status.HTTP_400_BAD_REQUEST)
                
                PedidoProducto.objects.create(
                    pedido=pedido,
                    producto=producto,
                    cantidad=item['cantidad']
                )
            return Response(PedidoSerializer(pedido).data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
