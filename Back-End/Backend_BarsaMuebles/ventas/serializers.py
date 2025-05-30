from rest_framework import serializers

from ventas.models import Ventas

class VentasSerializer(serializers.Serializer):
    class Meta:
        model = Ventas
        fields = ['dateVenta', 'stateVenta', 'totalVenta', 'userID', 'muebleID', 'muebleName', 'mueblePrice', 'cantidadMuebles']
        read_only_fields = ['dateVenta', 'stateVenta', 'totalVenta', 'userID', 'muebleID', 'muebleName', 'mueblePrice']