from rest_framework import serializers

from ventas.models import Ventas

class VentasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ventas
        fields = ['dateVenta', 'stateVenta', 'totalVenta', 'userID', 'muebleID', 'muebleName', 'mueblePrice', 'cantidadMuebles']
        read_only_fields = ['dateVenta', 'stateVenta', 'totalVenta', 'userID', 'muebleID', 'muebleName', 'mueblePrice']

    def create(self, validated_data):
        mueble = validated_data['muebleID']
        validated_data['muebleName'] = mueble.nameFurniture
        validated_data['mueblePrice'] = mueble.priceFurniture
        validated_data['totalVenta'] = mueble.priceFurniture * validated_data.get('cantidadMuebles', 1)
        return Ventas.objects.create(**validated_data)