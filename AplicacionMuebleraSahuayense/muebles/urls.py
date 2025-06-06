from django.urls import path

from muebles.views import FurnitureView, FurnitureListView

urlpatterns=[
    path('registro/', FurnitureView.as_view(), name='muebles'),
    path('lista/', FurnitureListView.as_view(), name='lista_muebles'),
]