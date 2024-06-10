from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.request import Request
from userauth.authentication import ExpiringTokenAuthentication
from api.models import Scene
from api.serializers import SceneSerializer

# Create your views here.


@csrf_exempt
@api_view(["GET"])
def fetchScene(request: Request, id):
    scene = Scene.objects.get_safe(id=id)
    if scene == None:
        return Response(
            {"error", "Scene not found"}, status=status.HTTP_400_BAD_REQUEST
        )
    scene_serializer = SceneSerializer(scene)
    return Response(scene_serializer.data, status=status.HTTP_200_OK)


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


@csrf_exempt
@api_view(["POST"])
@authentication_classes([SessionAuthentication, ExpiringTokenAuthentication])
@permission_classes([IsAuthenticated])
def createScene(request: Request, id):
    print(request.data)
    return Response({"status", "Success"}, status=status.HTTP_200_OK)
