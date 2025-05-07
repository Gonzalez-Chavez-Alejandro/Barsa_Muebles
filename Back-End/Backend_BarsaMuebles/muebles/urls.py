from django.urls import path

from muebles.views import FurnitureView

urlpatterns=[
    path('registro/', FurnitureView.as_view(), name='muebles'),
]