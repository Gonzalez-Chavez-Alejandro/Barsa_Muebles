from django.db import models

class Categorias(models.Model):
    nameCategory = models.CharField(max_length=100)
    descriptionCategory = models.CharField(max_length=225)

    def __str__(self):
        return self.nameCategory
