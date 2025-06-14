#serializer/encargos
from rest_framework import serializers
from .models import Pedido, PedidoProducto

from autentication.serializers import UserListSerializer  # Ya lo tienes

from productos.serializer import ProductoSerializer

class PedidoProductoSerializer(serializers.ModelSerializer):
    producto = ProductoSerializer(read_only=True)

    class Meta:
        model = PedidoProducto
        fields = ['producto', 'cantidad']

class PedidoSerializer(serializers.ModelSerializer):
    productos = serializers.SerializerMethodField()
    usuario = serializers.SerializerMethodField()

    class Meta:
        model = Pedido
        fields = ['id', 'fecha', 'usuario', 'productos', 'total']

    def get_productos(self, obj):
        productos = PedidoProducto.objects.filter(pedido=obj)
        return PedidoProductoSerializer(productos, many=True).data

    def get_usuario(self, obj):
        return UserListSerializer(obj.usuario).data

# Para registrar nuevos pedidos
class CrearPedidoProductoSerializer(serializers.Serializer):
    producto_id = serializers.IntegerField()
    cantidad = serializers.IntegerField()

class CrearPedidoSerializer(serializers.Serializer):
    productos = CrearPedidoProductoSerializer(many=True)
    total = serializers.DecimalField(max_digits=10, decimal_places=2)
