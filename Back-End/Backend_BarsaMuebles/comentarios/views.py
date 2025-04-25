from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from comentarios.serializers import CommentSerializer

class CommentView(APIView):
    def post(self, request):
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(userID=request.user)
            return Response({"message":"Comentario guardado exitosamente"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)