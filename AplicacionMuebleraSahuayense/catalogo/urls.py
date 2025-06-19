#catalogo/urls.py
from django.urls import path
from .views import CatalogoURLAPIView

urlpatterns = [
    path('catalogo-url/', CatalogoURLAPIView.as_view(), name='catalogo-url'),
]
