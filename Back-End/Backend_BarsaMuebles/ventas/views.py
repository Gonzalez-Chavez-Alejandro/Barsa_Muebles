from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from ventas.serializers import VentasSerializer


class VentasView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, mueble_id):
        data = request.data
        data['userID'] = request.user.id
        data['muebleID'] = mueble_id
        serializer = VentasSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Venta correctamente realizada"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)