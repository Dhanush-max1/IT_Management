from django.db import models

class Asset(models.Model):
    name = models.CharField(max_length=100)
    asset_type = models.CharField(max_length=50)
    serial_number = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=20)
    purchase_date = models.DateField()

    def __str__(self):
        return self.name