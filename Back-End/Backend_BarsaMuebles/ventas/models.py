from django.db import models

from autenticacion.models import CustomUser
from muebles.models import Muebles

class Ventas(models.Model):
    userID = models.ForeignKey(CustomUser, on_delete=models.PROTECT, related_name='ventas')
    dateSale = models.DateField(auto_now=True)
    total = models.DecimalField(max_digits=100, decimal_places=2, default=0)
    stateSale = models.BooleanField(default=True)

class DetalleVenta(models.Model):
    ventaID = models.ForeignKey(Ventas, on_delete=models.PROTECT, related_name='detalle_venta')
    productID = models.ForeignKey(Muebles, on_delete=models.PROTECT, related_name='detalle_venta')
    productName = models.CharField(max_length=100)
    productPrice = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    cantidad = models.PositiveIntegerField(default=0)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    def save(self, *args, **kwargs):
        self.productName = self.productID.nameFurniture
        self.productPrice = self.productID.priceFurniture
        self.subtotal = self.productPrice * self.cantidad
        super().save(*args, **kwargs)