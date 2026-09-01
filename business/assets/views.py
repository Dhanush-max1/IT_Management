from django.shortcuts import render, redirect, get_object_or_404
from .models import Asset
from .forms import AssetForm
from rest_framework import viewsets, filters
from .serializers import AssetSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from openai import OpenAI


def asset_list(request):
    assets = Asset.objects.all().order_by('name')
    return render(request, 'assets/asset_list.html', {'assets': assets})


def add_asset(request):
    if request.method == 'POST':
        form = AssetForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('asset_list')
    else:
        form = AssetForm()

    return render(request, 'assets/add_asset.html', {'form': form})


def edit_asset(request, id):
    asset = get_object_or_404(Asset, id=id)

    if request.method == 'POST':
        form = AssetForm(request.POST, instance=asset)
        if form.is_valid():
            form.save()
            return redirect('asset_list')
    else:
        form = AssetForm(instance=asset)

    return render(request, 'assets/edit_asset.html', {'form': form})


def delete_asset(request, id):
    asset = get_object_or_404(Asset, id=id)

    if request.method == 'POST':
        asset.delete()
        return redirect('asset_list')

    return render(request, 'assets/delete_asset.html', {'asset': asset})


@api_view(["GET"])
def asset_data(request):
    assets = Asset.objects.all()

    data = []

    for asset in assets:
        data.append({
            "id": asset.id,
            "name": asset.name,
            "asset_type": asset.asset_type,
            "serial_number": asset.serial_number,
            "status": asset.status,
            "purchase_date": str(asset.purchase_date),
        })

    return Response({
        "count": assets.count(),
        "assets": data
    })

class AssetViewSet(viewsets.ModelViewSet):
    queryset = Asset.objects.all()
    serializer_class = AssetSerializer

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]

    search_fields = [
        'name',
        'asset_type',
        'serial_number',
        'status',
    ]

    ordering_fields = [
        'name',
        'purchase_date',
        'status',
    ]

    ordering = ['name']

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def protected_api(request):
    return Response({
        "message": "You are authenticated!",
        "user": request.user.username
    })

@api_view(['POST'])
@permission_classes([])
def ai_assistant(request):
    prompt = request.data.get("prompt")

    if not prompt:
        return Response({
            "error": "Prompt is required"
        }, status=400)

    client = OpenAI()

    response = client.responses.create(
        model="gpt-5-mini",
        input=prompt
    )

    return Response({
        "prompt": prompt,
        "response": response.output_text
    })