from django.urls import path
from . import views
from .views import asset_data

urlpatterns = [
    path("", asset_data, name="asset_api"),
    path("data/", asset_data, name="asset_data"),

    path("add/", views.add_asset, name="add_asset"),
    path("edit/<int:id>/", views.edit_asset, name="edit_asset"),
    path("delete/<int:id>/", views.delete_asset, name="delete_asset"),
]