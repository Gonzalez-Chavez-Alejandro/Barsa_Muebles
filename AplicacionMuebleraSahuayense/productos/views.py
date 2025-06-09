from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from productos.models import Productos
from productos.serializer import ProductoSerializer
from rest_framework import status



# Create your views here.
class ProductosListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        furniture = Productos.objects.all()
        serializer = ProductoSerializer(furniture, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)