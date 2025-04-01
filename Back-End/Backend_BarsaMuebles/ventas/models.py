from django.db import models

from muebles.models import Muebles

class Ventas(models.Model):
    furnitureID = models.ForeignKey(Muebles, on_delete=models.PROTECT, related_name='ventas')
    dateSale = models.DateField()
    amountSale = models.DecimalField(max_digits=100, decimal_places=2, default=0)

