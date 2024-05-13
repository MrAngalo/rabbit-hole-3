from django.shortcuts import render
from django.http import HttpRequest
from django.views.decorators.csrf import csrf_exempt
from django.http.response import JsonResponse

from rest_framework.decorators import api_view
# from rest_framework.parsers import JSONParser

from api.models import Scene
from api.serializers import SceneSerializer

# Create your views here.

@csrf_exempt
@api_view(['GET'])
def sceneApi(request: HttpRequest, id=0):
    scenes = Scene.objects.get_safe(id=id)
    scenes_serializer = SceneSerializer(scenes)
    return JsonResponse(scenes_serializer.data, safe=False)
    
    # elif request.method == "POST":
    #     scene_data = JSONParser().parse(request)
    #     scenes_serializer = SceneSerializer(data=scene_data)
    #     if scenes_serializer.is_valid():
    #         scenes_serializer.save()
    #         return JsonResponse("Added Successfully", safe=False)
    #     else:
    #         return JsonResponse("Failed to Add", safe=False)