from django.db import models

from autenticacion.models import CustomUser
from muebles.models import Muebles

class Ventas(models.Model):
    dateVenta = models.DateField(auto_now=True)
    stateVenta = models.BooleanField(default=True)
    totalVenta = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    userID = models.ForeignKey(CustomUser, on_delete=models.PROTECT)
    muebleID = models.ForeignKey(Muebles, on_delete=models.PROTECT)
    muebleName = models.CharField(max_length=100)
    mueblePrice = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    cantidadMuebles = models.PositiveIntegerField(default=1)

    def save(self, *args, **kwargs):
        self.muebleName = self.muebleID.nameFurniture
        self.mueblePrice = self.muebleID.priceFurniture
        self.totalVenta = self.mueblePrice * self.cantidadMuebles