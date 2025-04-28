from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from categorias.models import Categorias
from categorias.serializers import CategoriaSerializer

class CategoryView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        serializer = CategoriaSerializer(data=request.data)
        if serializer.is_valid():
            category = serializer.save()
            return Response({"message": "La categoria se guardo con exito"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CategoryListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        category = Categorias.objects.all()
        serializer = CategoriaSerializer(category, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)