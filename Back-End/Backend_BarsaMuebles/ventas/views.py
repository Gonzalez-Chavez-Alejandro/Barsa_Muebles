from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from ventas.serializers import VentasSerializer


class VentasView(APIView):
    def post(self, request, furniture_id):
        data = request.data
        data['furnitureID'] = furniture_id
        data['userID'] = request.user.id
        serializer = VentasSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Venta guardada"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)