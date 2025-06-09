from django.urls import path

from productos.views import ProductosListView

urlpatterns=[
    path('Listar/', ProductosListView.as_view(), name='productos'),
]