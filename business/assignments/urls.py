from django.urls import path
from .import views
from .views import (
    AssignmentListCreateView,
    AssignmentDetailView,
)

urlpatterns = [
    path(
        "",
        AssignmentListCreateView.as_view(),
        name="assignment_list",
    ),
    path(
        "<int:pk>/",
        AssignmentDetailView.as_view(),
        name="assignment-detail",
    ),
]