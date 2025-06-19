#catalogo/serializers.py
from rest_framework import serializers
from .models import CatalogoURL

class CatalogoURLSerializer(serializers.ModelSerializer):
    class Meta:
        model = CatalogoURL
        fields = ['id', 'url', 'fecha_actualizacion']
