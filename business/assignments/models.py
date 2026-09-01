from django.db import models
from accounts.models import Employee
from assets.models import Asset


class Assignment(models.Model):

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)

    asset = models.ForeignKey(Asset, on_delete=models.CASCADE)

    date_assigned = models.DateField(auto_now_add=True)

    date_returned = models.DateField(null=True, blank=True)

    STATUS_CHOICES = (
        ('Assigned', 'Assigned'),
        ('Returned', 'Returned'),
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Assigned'
    )


    def __str__(self):
        return f"{self.employee} - {self.asset}"