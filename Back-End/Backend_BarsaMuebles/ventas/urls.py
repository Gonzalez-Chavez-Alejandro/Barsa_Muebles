from django.urls import path

from ventas.views import VentasView

urlpatterns=[
    path('registro/<int:furniture_id/>', VentasView.as_view(), name='ventas'),
]