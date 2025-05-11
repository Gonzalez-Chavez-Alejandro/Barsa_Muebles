from rest_framework import serializers

from ventas.models import Ventas

class VentasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ventas
        fields = ['furnitureID', 'userID', 'dateSale', 'amountSale', 'stateSale']
        read_only_fields = ['furnitureID', 'userID', 'dateSale', 'stateSale']