from django.urls import path 

from categorias.views import CategoryView, CategoryListView, CategoryUpdateView

urlpatterns=[
    path('registro/', CategoryView.as_view(), name='categoria'),
    path('consulta/', CategoryListView.as_view(), name='categoriasList'),
    path('actualizar/<str:nameCategory>/', CategoryUpdateView.as_view(), name='categoriaUpdate'),
]