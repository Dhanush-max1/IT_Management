from django.contrib import admin
from .models import InventoryItem


@admin.register(InventoryItem)
class InventoryItemAdmin(admin.ModelAdmin):
    list_display = ('item_name', 'quantity', 'threshold')
    search_fields = ('item_name',)
    ordering = ('item_name',)