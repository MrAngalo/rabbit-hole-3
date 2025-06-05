from django.contrib.auth import authenticate, login as django_login
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.views import APIView


from api.models import User
from userauth.serializers import UserSerializer
from userauth.authentication import ExpiringTokenAuthentication

# Create your views here.


class LoginView(APIView):
    authentication_classes = []
    permission_classes = []

    # Optional: disable CSRF for login
    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

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


@api_view(["POST"])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
# Does not validate if token is expired, just tries to delete information given
def logout(request: Request):
    try:
        request.user.auth_token.delete()
    except:
        pass
    return Response({"success": "Successfully logged out."}, status=status.HTTP_200_OK)


@api_view(["GET"])
@authentication_classes([SessionAuthentication, ExpiringTokenAuthentication])
@permission_classes([IsAuthenticated])
def testToken(request: Request):
    return Response(
        {"success", f"passed for {request.user.email}"}, status=status.HTTP_200_OK
    )


@api_view(["GET"])
@authentication_classes([SessionAuthentication, ExpiringTokenAuthentication])
@permission_classes([IsAuthenticated])
def userInfo(request: Request):
    serializer = UserSerializer(instance=request.user, fields=("username", "email"))
    return Response({"user": serializer.data}, status=status.HTTP_200_OK)
