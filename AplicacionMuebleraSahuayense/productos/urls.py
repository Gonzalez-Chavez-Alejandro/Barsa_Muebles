#url producto
from django.urls import path
from productos.views import  administrador_agregar_producto, eliminar_producto, vista_agregar_producto
from productos.views import ProductosListView, administrador_editar_producto

urlpatterns=[
    path('Listar/', ProductosListView.as_view(), name='productos'),
    path('editar-producto/<int:id>/', administrador_editar_producto, name='editar_producto'),
    path('eliminar-producto/<int:id>/', eliminar_producto, name='eliminar_producto'),
    path('administrador_agregar_producto/', administrador_agregar_producto, name='administrador_agregar_producto'),  # HTML
    path('api/vista_agregar_producto/', vista_agregar_producto, name='vista_agregar_producto'),     # API
]