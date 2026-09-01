from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import RepairTicket
from .serializers import RepairTicketSerializer


class RepairTicketListCreateView(generics.ListCreateAPIView):
    queryset = RepairTicket.objects.all().order_by("-id")
    serializer_class = RepairTicketSerializer
    permission_classes = [IsAuthenticated]


class RepairTicketDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = RepairTicket.objects.all()
    serializer_class = RepairTicketSerializer
    permission_classes = [IsAuthenticated]