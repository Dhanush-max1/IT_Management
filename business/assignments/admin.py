from django.contrib import admin
from .models import Assignment

@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ('employee', 'asset', 'date_assigned', 'date_returned')
    list_filter = ('date_assigned',)