from django.db import models

class Comentarios(models.Model):
    contentComment = models.CharField(max_length=200)
    dateComment = models.DateField()
