from api.models import User
from rest_framework import serializers


class UserLoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "email"]


class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "email", "password"]


class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "email"]
