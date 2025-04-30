from django.urls import path

from comentarios.views import CommentView

urlpatterns=[
    path('comentar/<int:furniture_id>/', CommentView.as_view(), name='comentario'),
]