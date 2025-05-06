from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('admin_tienda.urls')),  # Incluye las URLs de admin_tienda
]
