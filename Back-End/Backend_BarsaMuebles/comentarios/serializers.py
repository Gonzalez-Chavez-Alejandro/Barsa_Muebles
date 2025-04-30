from rest_framework import serializers

from comentarios.models import Comentarios


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comentarios
        fields = ['contentComment', 'dateComment', 'ratings', 'userID', 'furnitureID']
        read_only_fields = ['dateComment', 'userID', 'furnitureID']

    def validate_ratings(self, value):
        if not (1 <= value <= 5):
            raise serializers.ValidationError('La calificación debe estar entre 1 y 5')
        return value