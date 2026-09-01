from django.urls import path
from .views import ai_agent


urlpatterns = [
    path('', ai_agent, name='ai_agent'),
]