#Models/foother
from django.db import models

class FooterData(models.Model):
    emails = models.JSONField(default=list)
    phones = models.JSONField(default=list)
    locations = models.JSONField(default=list)
    socials = models.JSONField(default=dict)

    def __str__(self):
        return f"FooterData #{self.id}"
