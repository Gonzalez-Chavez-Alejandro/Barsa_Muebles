from django.urls import path, include
from django.contrib import admin
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('autentication.urls')),
<<<<<<< HEAD
    path('', include('admin_tienda.urls')),
   
    path('categorias/', include('categorias.urls'))
=======
    path('categorias/', include('categorias.urls')),
    path('muebles/', include('muebles.urls'))
>>>>>>> 1dcb339 (Muebles)
]
