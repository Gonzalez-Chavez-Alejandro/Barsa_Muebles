from django.urls import path

from comentarios.views import CommentView

urlpatterns=[
    path('registro/', CommentView.as_view(), name='comentarios'),
]