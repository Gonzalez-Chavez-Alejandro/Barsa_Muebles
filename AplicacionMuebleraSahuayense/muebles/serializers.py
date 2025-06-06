from rest_framework import serializers

from muebles.models import Muebles


class FurnitureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Muebles
        fields = ['categoryID', 'nameFurniture', 'descriptionFurniture', 'priceFurniture', 'stateFurniture', 'imageFurniture', 'userID']
        read_only_fields = ['stateFurniture', 'userID']