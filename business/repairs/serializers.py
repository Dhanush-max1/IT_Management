from rest_framework import serializers
from .models import RepairTicket


class RepairTicketSerializer(serializers.ModelSerializer):
    asset_name = serializers.SerializerMethodField()
    employee_name = serializers.SerializerMethodField()

    class Meta:
        model = RepairTicket
        fields = [
            "id",
            "asset",
            "asset_name",
            "issue",
            "status",
            "assigned_technician",
            "employee_name",
        ]

    def get_asset_name(self, obj):
        return obj.asset.name if obj.asset else ""

    def get_employee_name(self, obj):
        if obj.employee:
            return obj.employee.user.username
        return ""