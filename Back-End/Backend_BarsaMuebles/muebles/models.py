from cloudinary.models import CloudinaryField
from django.db import models

from autenticacion.models import CustomUser
from categorias.models import Categorias

class Muebles(models.Model):
    categoryID = models.ForeignKey(Categorias, on_delete=models.PROTECT, related_name='categorias')
    nameFurniture = models.CharField(max_length=100)
    descriptionFurniture = models.CharField(max_length=225)
    priceFurniture = models.DecimalField(max_digits=100, decimal_places=2, default=0)
    stateFurniture = models.BooleanField(default=True)
    imageFurniture = CloudinaryField(
        'image',
        folder='muebles/',
        overwrite=True,
        resource_type='image',
    )
    userID = models.ManyToManyField(CustomUser)

    def save(self, *args, **kwargs):
        if self.imageFurniture:
            self.imageFurniture.public_id = f"muebles/{self.nameFurniture.replace(' ', '_')}"
        super().save(*args, **kwargs)