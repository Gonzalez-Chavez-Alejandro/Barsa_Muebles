from django.contrib import admin
from django.urls import path, include

urlpatterns = [
        path('admin/', admin.site.urls),
        path('api/', include('autenticacion.urls')),
        path('categorias/', include('categorias.urls')),
        path('muebles/', include('muebles.urls')),
        path('ventas/', include('ventas.urls')),
        path('comentarios/', include('comentarios.urls')),
]
