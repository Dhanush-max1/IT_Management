from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import InventoryItem
from .serializers import InventoryItemSerializer


class InventoryItemViewSet(viewsets.ModelViewSet):
    queryset = InventoryItem.objects.all().order_by("id")
    serializer_class = InventoryItemSerializer
    permission_classes = [IsAuthenticated]