from django.urls import path
from . import views

urlpatterns = [
    path('administrador/', views.administrador, name='administrador'),
    
   
    path('generate_signature/', views.generate_signature, name='generate_signature'),
     path('gestionar_carpetas/', views.gestionar_carpetas, name='gestionar_carpetas'),
]




