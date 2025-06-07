from django.urls import path, include
from django.contrib import admin
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('autentication.urls')),
    path('', include('admin_tienda.urls')),
    path('categorias/', include('categorias.urls')),
  #  path('muebles/', include('muebles.urls')),
]
