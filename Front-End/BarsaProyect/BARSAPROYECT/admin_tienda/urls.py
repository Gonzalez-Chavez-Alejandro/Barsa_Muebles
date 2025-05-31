from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='h'),  
    path('administrador/', views.administrador, name='administrador'),
    path('nosotros/', views.nosotros, name='nosotros'),
    path('registro/', views.registro, name='registro'),
    path('productos/', views.productos, name='productos'),
    path('productos_vista/', views.productos_vista, name='productos_vista'),
    path('login/', views.login, name='login'),
    path('catalogo/', views.catalogo, name='catalogo'),
    path('administrador_agregar_producto/', views.administrador_agregar_producto, name='administrador_agregar_producto'),
    path('configuracion_usuario/', views.configuracion_usuario, name='configuracion_usuario'),
    path('generate_signature/', views.generate_signature, name='generate_signature'),
    path('gestionar_carpetas/', views.gestionar_carpetas, name='gestionar_carpetas'),
    
]




