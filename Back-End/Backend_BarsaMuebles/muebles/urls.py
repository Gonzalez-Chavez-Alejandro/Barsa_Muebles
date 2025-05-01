from django.urls import path

from muebles.views import FurnitureView

urlpattern=[
    path('registro/', FurnitureView.as_view(), name='muebles'),
]