from rest_framework import serializers

from comentarios.models import Comentarios


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comentarios
        fields = ['contentComment', 'dateComment']
        read_only_fields = ['dateComment']