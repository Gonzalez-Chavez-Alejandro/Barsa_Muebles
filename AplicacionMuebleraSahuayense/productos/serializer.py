# productos/serializers.py
from rest_framework import serializers
from productos.models import Productos

class ProductoSerializer(serializers.ModelSerializer):
    PrecioOferta = serializers.SerializerMethodField()  # Campo calculado

    class Meta:
        model = Productos
        fields = [
            'categoryID', 
            'nameFurniture', 
            'descriptionFurniture', 
            'priceFurniture', 
            'porcentajeDescuento', 
            'stateFurniture', 
            'imageFurniture', 
            'PrecioOferta'
        ]

    def get_PrecioOferta(self, obj):
        """Calcula el precio con descuento aplicado"""
        descuento = obj.porcentajeDescuento or 0  # Maneja None como 0
        return obj.priceFurniture * (1 - descuento/100)