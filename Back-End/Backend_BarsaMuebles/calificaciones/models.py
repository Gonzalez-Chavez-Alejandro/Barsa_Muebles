from django.db import models

from muebles.models import Muebles

class Calificaciones(models.Model):
    FurnitureID = models.OneToOneField(Muebles, on_delete=models.PROTECT, related_name='calificaciones')
    ratings = models.DecimalField(max_digits=5, decimal_places=2, default=0)
