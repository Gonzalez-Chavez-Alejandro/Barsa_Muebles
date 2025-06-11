from django.urls import path

from productos.views import ProductosListView, administrador_editar_producto

urlpatterns=[
    path('Listar/', ProductosListView.as_view(), name='productos'),
    path('editar-producto/<int:id>/', administrador_editar_producto, name='editar_producto'),
]