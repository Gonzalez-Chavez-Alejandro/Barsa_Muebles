from django.db import models

class Contenido(models.Model):
    parts = models.IntegerField(default=1)
    color = models.CharField(max_length=100)