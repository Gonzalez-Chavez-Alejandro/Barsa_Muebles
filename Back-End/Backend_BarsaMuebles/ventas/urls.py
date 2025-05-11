from django.urls import path

from ventas.views import VentasView

urlpatterns=[
    path('registro/', VentasView.as_view(), name='ventas'),
]