# productos/serializers.py
from rest_framework import serializers
from productos.models import Productos

class ProductoSerializer(serializers.ModelSerializer):
    PrecioOferta = serializers.SerializerMethodField()

    class Meta:
        model = Productos
        fields = [
            'id',
            'categoryID',
            'nameFurniture',
            'descriptionFurniture',
            'priceFurniture',
            'porcentajeDescuento',
            'stateFurniture',
            'userID',
            'imageFurniture',
            'PrecioOferta',
        ]

    def get_PrecioOferta(self, obj):
        descuento = obj.porcentajeDescuento or 0
        return obj.priceFurniture * (1 - descuento / 100)

    def get_imagenes(self, obj):
        if obj.imageFurniture:
            return [url.strip() for url in obj.imageFurniture.split(',')]
        return []
