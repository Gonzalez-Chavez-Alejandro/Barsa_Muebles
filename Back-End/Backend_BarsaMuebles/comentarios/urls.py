from django.urls import path

from comentarios.views import CommentView

urlpatterns=[
    path('comentar/', CommentView.as_view(), name='comentario'),
]