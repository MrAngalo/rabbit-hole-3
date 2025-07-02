import re
import requests

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.request import Request
from tenor.views import API_KEY, API_URL, CLIENT_KEY

from urllib.parse import quote
from userauth.models import User

from .models import Scene
from .serializers import (
    CreateSceneSerializer,
    FetchSceneSerializer,
    FetchUserSerializer,
    FetchSettingsSerializer,
)
from .models import SceneStatus


class NotImplementedView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request, **kwargs):
        return Response(
            {"error": "Not Implemented."}, status=status.HTTP_400_BAD_REQUEST
        )


class FetchSceneView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request: Request, id=0):
        scene = Scene.objects.get(id=id)
        if scene == None:
            return Response(
                {"error": "Scene not found."}, status=status.HTTP_400_BAD_REQUEST
            )
        scene_serializer = FetchSceneSerializer(scene)
        return Response(scene_serializer.data, status=status.HTTP_200_OK)


class CreateSceneView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, parentId=0):
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

        parent = Scene.objects.get(id=parentId)
        if parent == None:
            return Response(
                {
                    "error": f"The scene id={parentId} does not exist or has been removed."
                },
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
                {"error": "Tenor GIF ID is invalid!"},
                status=status.HTTP_400_BAD_REQUEST,
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

        scene_serializer = CreateSceneSerializer(scene)
        return Response(scene_serializer.data, status=status.HTTP_200_OK)


class FetchUserView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response(
                {"error": f"User {username} not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = FetchUserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class FetchSettingsView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = FetchSettingsSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        data: dict[str, str] = request.data  # type: ignore

        gifId: str = data["gifId"].strip()
        biography: str = data["biography"].strip()
        awaiting_review: str = data["awaiting_review"]

        if not ("gifId" in data and "biography" in data and "awaiting_review" in data):
            return Response(
                {"error": "At least one of the fields is empty!"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not (len(biography) < 400):
            return Response(
                {"error": "Biography must be less than 400 characters!"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if type(awaiting_review) is not bool:
            return Response(
                {"error": "Awaiting Review must be a boolean!"},
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
                {"error": "Tenor GIF ID is invalid!"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user: User = request.user

        user.ppf_gifId = gifId
        user.bio = biography
        user.view_await_review = awaiting_review

        user.save()

        return Response({"status": "ok"}, status=status.HTTP_200_OK)
