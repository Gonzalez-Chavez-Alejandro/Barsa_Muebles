from django.urls import path

from ventas.views import VentasView

urlpatterns=[
    path('registro/<int:mueble_id>/', VentasView.as_view(), name='crear_ventas'),
]