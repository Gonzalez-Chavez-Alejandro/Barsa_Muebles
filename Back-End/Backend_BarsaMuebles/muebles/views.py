from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from muebles.models import Muebles
from muebles.serializers import FurnitureSerializer

class FurnitureView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        serializer = FurnitureSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(userID=request.user)
            return Response({"message": "Mueble correctamente guardado"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FurnitureListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        furniture = Muebles.objects.all()
        serializer = FurnitureSerializer(furniture, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)