# encargos/urls.py
from django.urls import path
from .views import PedidoListCreateAPIView

urlpatterns = [
    path('pedidos/', PedidoListCreateAPIView.as_view(), name='pedidos-list-create'),
]
