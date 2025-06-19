from django.http import HttpResponse, HttpResponseRedirect
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import CatalogoURL

def descargar_catalogo(request):
    try:
        catalogo = CatalogoURL.objects.latest('uploaded_at')
        return HttpResponseRedirect(catalogo.url_pdf)
    except CatalogoURL.DoesNotExist:
        return HttpResponse("No hay catálogo disponible.", status=404)

class CatalogoURLAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            url = request.data.get('url_pdf')
            if not url:
                return Response({'error': 'No se proporcionó una URL.'}, status=status.HTTP_400_BAD_REQUEST)

            CatalogoURL.objects.all().delete()
            catalogo = CatalogoURL.objects.create(url_pdf=url)
            return Response({'mensaje': 'Catálogo guardado correctamente.', 'url_pdf': catalogo.url_pdf}, status=status.HTTP_201_CREATED)
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
