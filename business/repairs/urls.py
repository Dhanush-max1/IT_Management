from django.urls import path

from .views import (
    RepairTicketListCreateView,
    RepairTicketDetailView,
)

urlpatterns = [
    path(
        "",
        RepairTicketListCreateView.as_view(),
        name="repair-list-create",
    ),
    path(
        "<int:pk>/",
        RepairTicketDetailView.as_view(),
        name="repair-detail",
    ),
]