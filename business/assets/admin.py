from django.contrib import admin
from .models import Asset

@admin.register(Asset)
class AssetAdmin(admin.ModelAdmin):
    list_display = ('name', 'asset_type', 'serial_number', 'status', 'purchase_date')
    search_fields = ('name', 'serial_number')
    list_filter = ('asset_type', 'status')
    ordering = ('name',)