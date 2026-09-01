from django.contrib import admin
from .models import RepairTicket


@admin.register(RepairTicket)
class RepairTicketAdmin(admin.ModelAdmin):
    list_display = ('asset', 'employee', 'status', 'assigned_technician')
    list_filter = ('status',)
    search_fields = ('assigned_technician',)