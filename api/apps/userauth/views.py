from django.contrib.auth import (
    authenticate,
    login as django_login,
    logout as django_logout,
)

from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.views import APIView


from apps.core import settings
from apps.core.utils import send_password_reset_email

from .models import User, UserToken
from userauth.serializers import (
    UserInfoSerializer,
    UserLoginSerializer,
    UserRegisterSerializer,
)

from django.utils import timezone
from datetime import timedelta


class LoginView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        user = authenticate(request, email=email, password=password)
        if user == None:
            return Response(
                {"error": "User not found."}, status=status.HTTP_404_NOT_FOUND
            )

        # Creates session cookie
        django_login(request, user)
        serializer = UserLoginSerializer(instance=user)
        return Response({"user": serializer.data})


class RegisterView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            User.objects.create_user(**serializer.data)  # type: ignore
            return Response({"user": serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            django_logout(request)
        except:
            pass
        return Response(
            {"success": "Successfully logged out."}, status=status.HTTP_200_OK
        )


class UserInfoView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request: Request):
        serializer = UserInfoSerializer(instance=request.user)
        return Response({"user": serializer.data}, status=status.HTTP_200_OK)


class PasswordCodeView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        data: dict[str, str] = request.data  # type: ignore

        email: str = data["email"].strip()
        user = User.objects.get(email=email)
        if user == None:
            print("Failed to send email - User Does Not Exist")
            return Response(
                {
                    "status": "We have sent you a code via your email if it matches with our system."
                },
                status=status.HTTP_200_OK,
            )

        now = timezone.now()

        # Check if more than 1 minute have passed
        if user.last_received_email != None and (
            now - user.last_received_email
        ) < timedelta(minutes=1):
            print(
                f"Failed to send email - Too Many Requests (delta={now - user.last_received_email})"
            )
            return Response(
                {
                    "status": "We have sent you a code via your email if it matches with our system."
                },
                status=status.HTTP_200_OK,
            )

        token = UserToken.objects.get(user=user)
        if token == None:
            token = UserToken.objects.create(
                user=user, expires_at=now + timedelta(minutes=15)
            )
        else:
            lifetime = token.expires_at - token.created_at
            halfway = token.created_at + (lifetime / 2)
            if halfway < now:
                token.delete()
                token = UserToken.objects.create(
                    user=user, expires_at=now + timedelta(minutes=15)
                )

        user.last_received_email = timezone.now()
        user.save()

        send_password_reset_email(email, user.username, token.token)
        return Response({"status": "ok"}, status=status.HTTP_200_OK)


class PasswordNewView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        data: dict[str, str] = request.data  # type: ignore

        email: str = data["email"].strip()
        password1: str = data["password1"].strip()
        password2: str = data["password2"].strip()
        token: str = data["token"].strip()

        print(email)
        print(password1)
        print(password2)
        print(token)

        return Response({"status": "ok"}, status=status.HTTP_200_OK)
