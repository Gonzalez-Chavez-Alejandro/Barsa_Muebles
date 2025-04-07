from django.db import models

from autenticacion.models import CustomUser
from categorias.models import Categorias

class Muebles(models.Model):
    categoryID = models.ForeignKey(Categorias, on_delete=models.PROTECT, related_name='categorias')
    nameFurniture = models.CharField(max_length=100)
    descriptionFurniture = models.CharField(max_length=225)
    priceFurniture = models.DecimalField(max_digits=100, decimal_places=2, default=0)
    stateFurniture = models.BooleanField(default=True)
    userID = models.ManyToManyField(CustomUser)