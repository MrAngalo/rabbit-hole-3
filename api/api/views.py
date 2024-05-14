from django.shortcuts import render
from django.http import HttpRequest
from django.views.decorators.csrf import csrf_exempt
from django.http.response import JsonResponse

from api.models import Scene
from api.serializers import SceneSerializer

# Create your views here.


@csrf_exempt
def sceneApi(request: HttpRequest, id=0):
    if request.method == "GET":
        scenes = Scene.objects.get_safe(id=id)
        scenes_serializer = SceneSerializer(scenes)
        return JsonResponse(scenes_serializer.data, safe=False)
    return None


@csrf_exempt
def notImplemented(request: HttpRequest):
    if request.method == "GET":
        return JsonResponse("Not Implemented", safe=False)
    return None
