from django.db import models


class InventoryItem(models.Model):
    item_name = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField()
    threshold = models.PositiveIntegerField()

    def __str__(self):
        return self.item_name