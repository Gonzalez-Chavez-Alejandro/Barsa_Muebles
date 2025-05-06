from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from comentarios.models import Comentarios
from comentarios.serializers import CommentSerializer

class CommentView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, furniture_id):
        data = request.data.copy()
        data['userID']=request.user.id
        data['furnitureID']=furniture_id
        serializer = CommentSerializer(data=data)
        if serializer.is_valid():
            serializer.save(userID=request.user)
            return Response({"message":"Comentario guardado exitosamente"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CommentReturnView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        comment = Comentarios.objects.all()
        serializer = CommentSerializer(comment, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)