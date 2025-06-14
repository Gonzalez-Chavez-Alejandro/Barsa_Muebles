# encargos/urls.py
from django.urls import path
from encargos.views import actualizar_cantidad_producto_en_encargo, agregar_producto_a_encargo, crear_encargo, listar_encargos_usuario

urlpatterns = [
    path('mis-encargos/', listar_encargos_usuario, name='mis-encargos'),
    path('crear/', crear_encargo, name='crear-encargo'),
    path('agregar/<int:encargo_id>/', agregar_producto_a_encargo, name='agregar-producto-a-encargo'),
    path('actualizar-cantidad/<int:encargo_id>/', actualizar_cantidad_producto_en_encargo, name='actualizar-cantidad-producto'),

]
