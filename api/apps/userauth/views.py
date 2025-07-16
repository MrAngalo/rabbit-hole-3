import re

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

from apps.core.utils import (
    send_password_reset_email,
    send_registration_verification_email,
)

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


class RegisterCodeView(APIView):
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

        send_registration_verification_email(email, user.username, token.token)
        return Response({"status": "ok"}, status=status.HTTP_200_OK)


class RegisterView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        data: dict[str, str] = request.data  # type: ignore

        email: str = data["email"].strip()
        username: str = data["username"].strip()
        password1: str = data["password1"].strip()
        password2: str = data["password2"].strip()

        if password1 != password2:
            return Response(
                {
                    "error": "Passwords do not match.",
                    "validators": {"": {"passwordsMismatch": True}},
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if len(password1) < 8:
            return Response(
                {
                    "error": "Password must have at least 8 characters.",
                    "validators": {"": {"passwordFewCharacters": 8}},
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not re.search(r"\d", password1):
            return Response(
                {
                    "error": "Password must have at least 1 number.",
                    "validators": {"": {"passwordNoNumbers": 1}},
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not re.search(r"[A-Za-z]", password1):
            return Response(
                {
                    "error": "Password must have at least 1 letter.",
                    "validators": {"": {"passwordNoLetter": 1}},
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = User.objects.get(email=email.lower())
        if user != None:
            return Response(
                {
                    "error": "There is already an account with this email.",
                    "validators": {"email": {"emailInUse": True}},
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = User.objects.get(username_lower=username.lower())
        if user != None:
            return Response(
                {
                    "error": "There is already an account with this username.",
                    "validators": {"username": {"usernameInUse": True}},
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        now = timezone.now()
        user = User(
            username_lower=username.lower(),
            username=username,
            email=email.lower(),
            last_received_email=now,
        )
        user.set_password(password1)
        user.save()

        token = UserToken.objects.create(
            user=user, expires_at=now + timedelta(minutes=15)
        )

        send_registration_verification_email(user.email, user.username, token.token)
        return Response(
            {"status": "Successfully created your account, please verify your email."},
            status=status.HTTP_200_OK,
        )


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


class PasswordResetView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        data: dict[str, str] = request.data  # type: ignore

        email: str = data["email"].strip()
        password1: str = data["password1"].strip()
        password2: str = data["password2"].strip()
        token: str = data["token"].strip()

        if password1 != password2:
            return Response(
                {
                    "error": "Passwords do not match.",
                    "validators": {"": {"passwordsMismatch": True}},
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if len(password1) < 8:
            return Response(
                {
                    "error": "Password must have at least 8 characters.",
                    "validators": {"": {"passwordFewCharacters": 8}},
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not re.search(r"\d", password1):
            return Response(
                {
                    "error": "Password must have at least 1 number.",
                    "validators": {"": {"passwordNoNumbers": 1}},
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not re.search(r"[A-Za-z]", password1):
            return Response(
                {
                    "error": "Password must have at least 1 letter.",
                    "validators": {"": {"passwordNoLetter": 1}},
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        token_obj = UserToken.objects.get(token=token)
        if token_obj == None:
            return Response(
                {
                    "error": "Token is invalid or expired.",
                    "validators": {"token": {"tokenInvalid": True}},
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        now = timezone.now()
        if token_obj.expires_at < now:
            return Response(
                {
                    "error": "Token is invalid or expired.",
                    "validators": {"token": {"tokenInvalid": True}},
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = token_obj.user
        if user == None:
            return Response(
                {
                    "error": "Token is invalid or expired.",
                    "validators": {"token": {"tokenInvalid": True}},
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if user.email != email:
            return Response(
                {
                    "error": "Token is invalid or expired.",
                    "validators": {"token": {"tokenInvalid": True}},
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(password1)
        user.save()
        token_obj.delete()

        return Response(
            {"status": "Your password has been successfully changed!"},
            status=status.HTTP_200_OK,
        )
