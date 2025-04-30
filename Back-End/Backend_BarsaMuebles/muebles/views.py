from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from muebles.serializers import FurnitureSerializer

class FurnitureView(APIView):
    authentication_classes = [IsAuthenticated]
    def post(self, request):
        serializer = FurnitureSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Mueble correctamente guardado"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)