from rest_framework import serializers

from ventas.models import DetalleVenta, Ventas

class DetalleVentaSerializer(serializers.Serializer):
    class Meta:
        model = DetalleVenta
        fields = ['productID', 'productName', 'productPrice', 'subtotal', 'cantidad']
        read_only_fields = ['productName', 'productPrice', 'subtotal']

class VentaSerializer(serializers.Serializer):
    detalle_venta = DetalleVentaSerializer(many=True, read_only=True)

    class Meta:
        model = Ventas
        fields = ['ventaID', 'dateSale', 'total', 'stateSale']
        read_only_fields = ['ventaID', 'dateSale', 'total', 'stateSale']

class DetalleVentaCreateSerializer(serializers.Serializer):
    class Meta:
        model = DetalleVenta
        fields = ['productID', 'cantidad']

class VentaCreateSerializer(serializers.Serializer):
    detalles = DetalleVentaCreateSerializer(many=True)

    class Meta:
        model = Ventas
        fields = ['detalles']

    def create(self, validated_data):
        detalles_data = validated_data.pop('detalles')
        user = self.context['request'].user

        venta = Ventas.objects.create(userID=user, **validated_data)

        total = 0
        for detalle in detalles_data:
            product_id = detalle['productID']
            cantidad = detalle['cantidad']
            subtotal = product_id.priceFurniture * cantidad

            DetalleVenta(
                venta=venta,
                product_id=product_id,
                cantidad=cantidad,
                productPrice=product_id.priceFurniture,
                productName=product_id.nameFurniture,
                subtotal=subtotal,
            )
            total += subtotal

        venta.total = total
        venta.save()
        return venta