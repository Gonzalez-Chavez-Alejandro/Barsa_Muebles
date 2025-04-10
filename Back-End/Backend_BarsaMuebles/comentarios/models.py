from django.db import models

from autenticacion.models import CustomUser

class Comentarios(models.Model):
    userID = models.ForeignKey(CustomUser, on_delete=models.PROTECT, related_name='comentarios')
    contentComment = models.CharField(max_length=200)
    dateComment = models.DateField(auto_now=True)

    def __str__(self):
        return self.contentComment
