from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import FoodSerializer
from .models import Food
from json import dumps

# Create your views here.

class ListFoodView(APIView):
    def get(self, request):
        food = Food.objects.all()
        serializer = FoodSerializer(food, many=True)

        return(Response(serializer.data))

