from django.db import models
from cloudinary.models import CloudinaryField

from autentication.models import CustomUser
from categorias.models import Categorias

# Create your models here.
class Productos(models.Model):
    categoryID = models.ForeignKey(Categorias, on_delete=models.PROTECT, related_name='categorias')
    nameFurniture = models.CharField(max_length=100)
    descriptionFurniture = models.CharField(max_length=225)
    priceFurniture = models.DecimalField(max_digits=100, decimal_places=2, default=0)
    porcentajeDescuento= models.DecimalField(max_digits=3, decimal_places=0, default=0)
    stateFurniture = models.BooleanField(default=True)
    imageFurniture = CloudinaryField(
        'image',
        folder='Productos/',
        overwrite=True,
        resource_type='image',
    )
    userID = models.ForeignKey(CustomUser, on_delete=models.PROTECT, related_name='users')