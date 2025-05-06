from django.db import models

from autenticacion.models import CustomUser
from muebles.models import Muebles


class Comentarios(models.Model):
    userID = models.ForeignKey(CustomUser, on_delete=models.PROTECT, related_name='comentarios')
    furnitureID = models.ForeignKey(Muebles, on_delete=models.PROTECT, related_name='comentarios')
    contentComment = models.CharField(max_length=200)
    ratings = models.PositiveSmallIntegerField(default=0)
    dateComment = models.DateField(auto_now=True)

    def __str__(self):
        return self.contentComment
