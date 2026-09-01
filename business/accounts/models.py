from django.db import models
from django.contrib.auth.models import User


class Employee(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    employee_id = models.CharField(max_length=20)
    department = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)

    def __str__(self):
        return self.user.username
