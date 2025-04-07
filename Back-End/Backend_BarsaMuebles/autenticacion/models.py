from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ageUser = models.PositiveIntegerField()
    phoneUser = models.CharField(max_length=11)
    stateUser = models.BooleanField(default=True)