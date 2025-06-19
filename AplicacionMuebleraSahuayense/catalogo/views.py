
#catalogo/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import CatalogoURL
from .serializers import CatalogoURLSerializer

class CatalogoURLAPIView(APIView):
    def get(self, request):
        catalogo = CatalogoURL.objects.last()
        if catalogo:
            serializer = CatalogoURLSerializer(catalogo)
            return Response(serializer.data)
        return Response({'url': None})

    def post(self, request):
        CatalogoURL.objects.all().delete()  # Guarda solo uno
        serializer = CatalogoURLSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
