from django.db import models

# Create your models here.
from django.db import models
from assets.models import Asset
from accounts.models import Employee


class RepairTicket(models.Model):
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    issue = models.TextField()
    status = models.CharField(max_length=20)
    assigned_technician = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.asset} - {self.status}"