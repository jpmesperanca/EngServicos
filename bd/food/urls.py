from django.urls import path
from .views import ListFoodView

urlpatterns = [
    path('list', ListFoodView.as_view())
]
