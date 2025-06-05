from django.contrib.auth import (
    authenticate,
    login as django_login,
    logout as django_logout,
)
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.views import APIView


from api.models import User
from userauth.serializers import UserSerializer


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
        serializer = UserSerializer(instance=user, fields=("username", "email"))
        return Response({"user": serializer.data})


class RegisterView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = UserSerializer(
            data=request.data, fields=("username", "password", "email")
        )
        if serializer.is_valid():
            User.objects.create_user(**serializer.data)
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


class TestTokenView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(
            {"success", f"passed for {request.user.email}"}, status=status.HTTP_200_OK
        )


class UserInfoView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request: Request):
        serializer = UserSerializer(instance=request.user, fields=("username", "email"))
        return Response({"user": serializer.data}, status=status.HTTP_200_OK)
