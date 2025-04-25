from rest_framework import serializers
from categorias.models import Categorias

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categorias
        fields = ['nameCategory', 'descriptionCategory']