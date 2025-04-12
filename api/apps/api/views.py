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
from tenor.views import API_KEY, API_URL, CLIENT_KEY
from userauth.authentication import ExpiringTokenAuthentication
from api.models import Scene
from api.serializers import SceneSerializer
from api.models import SceneStatus
import requests
from urllib.parse import quote
import re
from userauth.models import User

# Create your views here.


@csrf_exempt
@api_view(["GET"])
def notImplemented(request: Request):
    return Response({"error": "Not Implemented."}, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["GET"])
def fetchScene(request: Request, id=0):
    scene = Scene.objects.get_safe(id=id)
    if scene == None:
        return Response(
            {"error": "Scene not found."}, status=status.HTTP_400_BAD_REQUEST
        )
    scene_serializer = SceneSerializer(scene)
    return Response(scene_serializer.data, status=status.HTTP_200_OK)


@csrf_exempt
@api_view(["POST"])
@authentication_classes([SessionAuthentication, ExpiringTokenAuthentication])
@permission_classes([IsAuthenticated])
def createScene(request: Request, parentId=0):
    data: dict[str, str] = request.data  # type: ignore
    if not ("title" in data and "desc" in data and "gifId" in data):
        return Response(
            {"error": "At least one of the fields is empty!"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Clean up data

    title: str = data["title"].strip()
    desc: str = data["desc"].strip()
    gifId: str = data["gifId"]

    title = re.sub(r"\s{2,}", " ", title)

    desc = re.sub(r"^[ ]+|[ ]+$", "", desc, flags=re.MULTILINE)
    desc = re.sub(r"[ ]{2,}", " ", desc)
    desc = re.sub(r"[\r\n\t\f\v]+", "\\n", desc)

    if not (5 < len(title) < 40):
        return Response(
            {"error": "Title must be between 5 and 40 characters!"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if not (80 < len(desc) < 2000):
        return Response(
            {"error": "Description must be between 80 and 2000 characters!"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    parent = Scene.objects.get_safe(id=parentId)
    if parent == None:
        return Response(
            {"error": f"The scene id={parentId} does not exist or has been removed."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if parent.status != SceneStatus.PUBLIC.value:
        return Response(
            {"error": f"The scene id={parentId} is not open to the public yet!"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if parent.children.count() >= 3:
        return Response(
            {
                "error": f"There are no more children available for parent scene id={parentId}!",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    full_url = (
        f"{API_URL}/posts/?key={API_KEY}&client_key={CLIENT_KEY}&ids={quote(gifId)}"
    )
    try:
        response = requests.get(full_url)
        response.raise_for_status()
        json = response.json()
        if len(json["results"]) == 0:
            raise ValueError()
    except:
        return Response(
            {"error": "Tenor GIF ID is invalid!"}, status=status.HTTP_400_BAD_REQUEST
        )

    user: User = request.user
    sceneStatus = (
        SceneStatus.PUBLIC.value
        if user.has_perm("api.bypass_approval")
        else SceneStatus.AWAITING_REVIEW.value
    )

    scene = Scene.objects.create(
        parent=parent,
        creator=user,
        creator_name=user.username,
        title=title,
        description=desc,
        gifId=gifId,
        status=sceneStatus,
    )

    scene_serializer = SceneSerializer(scene)

    return Response(scene_serializer.data, status=status.HTTP_200_OK)
