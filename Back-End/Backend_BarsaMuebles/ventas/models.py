from django.db import models

from autenticacion.models import CustomUser
from muebles.models import Muebles

class Ventas(models.Model):
    furnitureID = models.ForeignKey(Muebles, on_delete=models.PROTECT, related_name='ventas')
    userID = models.ForeignKey(CustomUser, on_delete=models.PROTECT, related_name='ventas')
    dateSale = models.DateField()
    amountSale = models.DecimalField(max_digits=100, decimal_places=2, default=0)
    stateSale = models.BooleanField(default=True)