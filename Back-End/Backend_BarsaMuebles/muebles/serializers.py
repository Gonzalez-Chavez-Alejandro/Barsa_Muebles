from rest_framework import serializers

from muebles.models import Muebles


class FurnitureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Muebles
        fields = ['categoryID', 'nameFurniture', 'descriptionFurniture', 'priceFurniture', 'stateFurniture', 'imageFurniture']
        read_only_fields = ['stateFurniture']