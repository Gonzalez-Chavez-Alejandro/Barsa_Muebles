from django.db import models

# Create your models here.
from django.db import models

class CatalogoURL(models.Model):
    url_pdf = models.URLField(max_length=500)
    uploaded_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.url_pdf
