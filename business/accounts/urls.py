from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    EmployeeViewSet,
    employee_data,
    dashboard,
    RegisterView,
)

router = DefaultRouter()

router.register(
    r"employees",
    EmployeeViewSet,
    basename="employee"
)

urlpatterns = [
    path("dashboard/", dashboard, name="dashboard"),

    path("", include(router.urls)),

    path("data/", employee_data, name="employee-data"),

    # API registration
    path("register/", RegisterView.as_view(), name="auth_register"),
]