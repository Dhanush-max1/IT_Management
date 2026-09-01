from rest_framework import serializers
from .models import Assignment


class AssignmentSerializer(serializers.ModelSerializer):
    employee_name = serializers.SerializerMethodField()
    asset_name = serializers.SerializerMethodField()

    class Meta:
        model = Assignment
        fields = [
            "id",
            "employee",
            "employee_name",
            "asset",
            "asset_name",
            "date_assigned",
            "date_returned",
            "status",
        ]

    def get_employee_name(self, obj):
        if obj.employee:
            return obj.employee.user.username
        return ""

    def get_asset_name(self, obj):
        if obj.asset:
            return obj.asset.name
        return ""