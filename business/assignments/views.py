from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Assignment
from .serializers import AssignmentSerializer
from django.shortcuts import render
from .models import Assignment


def assignment_list(request):
    assignments = Assignment.objects.all()
    return render(
        request,
        "assignments/assignment_list.html",
        {"assignments": assignments},
    )

class AssignmentListCreateView(generics.ListCreateAPIView):
    queryset = Assignment.objects.all().order_by("-id")
    serializer_class = AssignmentSerializer
    permission_classes = [IsAuthenticated]


class AssignmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
    permission_classes = [IsAuthenticated]