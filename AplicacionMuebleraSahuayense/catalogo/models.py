#catalogo/models.py
from django.db import models

class CatalogoURL(models.Model):
    url = models.URLField()
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.url
