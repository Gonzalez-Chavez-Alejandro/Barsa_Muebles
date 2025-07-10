from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('autentication.urls')),
    path('', include('admin_tienda.urls')),
    path('categorias/', include('categorias.urls')),
    path('productos/', include('productos.urls')),
    path('encargos/', include('encargos.urls')),
    path('api/footer/', include('footer.urls')),
    path('catalogos/', include('catalogos.urls')),
    path('password_reset/', include('password_reset.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])
