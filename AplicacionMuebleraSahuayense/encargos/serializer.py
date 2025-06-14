# encargos/serializers.py
from rest_framework import serializers
from .models import Encargo, ProductoEncargado
from productos.serializer import ProductoSerializer

class ProductoEncargadoSerializer(serializers.ModelSerializer):
    producto = ProductoSerializer()  # Incluye datos completos del producto
    imagen = serializers.SerializerMethodField()  # <- necesitas declarar esto

    class Meta:
        model = ProductoEncargado
        fields = ['producto', 'cantidad', 'precio_unitario', 'imagen']

    def get_imagen(self, obj):
        imagenes = obj.producto.imageFurniture.split(",") if obj.producto.imageFurniture else []
        return imagenes[0].strip() if imagenes else 'https://via.placeholder.com/100'


class EncargoSerializer(serializers.ModelSerializer):
    productos_encargados = ProductoEncargadoSerializer(many=True, read_only=True)

    class Meta:
        model = Encargo
        fields = ['id', 'usuario', 'fecha', 'total', 'productos_encargados']
