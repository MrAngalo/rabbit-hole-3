from datetime import datetime, timezone
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.request import Request


from api.models import User
from userauth.serializers import UserSerializer
from userauth.authentication import ExpiringTokenAuthentication

# Create your views here.


@csrf_exempt
@api_view(["POST"])
def login(request: Request):
    user = User.objects.get_safe(email=request.data["email"])
    if user == None:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
    if not user.check_password(request.data["password"]):
        return Response(
            {"error": "Incorrect Password."}, status=status.HTTP_404_NOT_FOUND
        )

    token, created = Token.objects.get_or_create(user=user)
    if not created:
        utc_now = datetime.now(timezone.utc)
        # Regenerate token if it used more than half of its lifetime
        if token.created < utc_now - settings.TOKEN_EXPIRE_TIME / 2:
            token.delete()
            token = Token.objects.create(user=user)

    serializer = UserSerializer(instance=user, fields=("username", "email"))
    return Response({"token": token.key, "user": serializer.data})


@csrf_exempt
@api_view(["POST"])
def register(request: Request):
    serializer = UserSerializer(
        data=request.data, fields=("username", "password", "email")
    )
    if serializer.is_valid():
        user = User.objects.create_user(**serializer.data)
        token = Token.objects.create(user=user)
        return Response({"token": token.key, "user": serializer.data})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["POST"])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
# Does not validate if token is expired, just tries to delete information given
def logout(request: Request):
    try:
        request.user.auth_token.delete()
    except:
        pass
    return Response({"error": "Successfully logged out."}, status=status.HTTP_200_OK)


@csrf_exempt
@api_view(["GET"])
@authentication_classes([SessionAuthentication, ExpiringTokenAuthentication])
@permission_classes([IsAuthenticated])
def testToken(request: Request):
    return Response(
        {"error", f"passed for {request.user.email}"}, status=status.HTTP_200_OK
    )
