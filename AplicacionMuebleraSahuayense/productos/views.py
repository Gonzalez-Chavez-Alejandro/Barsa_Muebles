from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from productos.models import Productos
from productos.serializer import ProductoSerializer

class ProductosListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        productos = Productos.objects.all()  # no hay relaciones a prefetch
        serializer = ProductoSerializer(productos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
