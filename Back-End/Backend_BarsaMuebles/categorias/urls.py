from django.urls import path

from categorias.views import CategoryView, CategoryListView

urlpatterns=[
    path('registro/', CategoryView.as_view(), name='categoria'),
    path('consulta/', CategoryListView.as_view(), name='categoriasList')
]