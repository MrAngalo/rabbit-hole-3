from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.request import Request
from api.models import Scene
from api.serializers import SceneSerializer

# Create your views here.


@csrf_exempt
@api_view(["GET"])
def fetchScene(request: Request, id):
    scenes = Scene.objects.get_safe(id=id)
    if scenes == None:
        return Response(
            {"error", "Scene not found"}, status=status.HTTP_400_BAD_REQUEST
        )
    scenes_serializer = SceneSerializer(scenes)
    return Response(scenes_serializer.data, status=status.HTTP_200_OK)


@csrf_exempt
@api_view(["GET"])
def sceneGlobals(request: Request):
    maxId = Scene.objects.latest("id").id
    count = Scene.objects.count()
    return Response({"maxId": maxId, "count": count}, status=status.HTTP_200_OK)


@csrf_exempt
@api_view(["GET"])
def notImplemented(request: Request):
    return Response({"error": "Not Implemented"}, status=status.HTTP_400_BAD_REQUEST)
