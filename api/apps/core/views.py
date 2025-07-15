from rest_framework.views import APIView
from django.shortcuts import render
from api.models import Scene

from . import settings


class HomeView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        context = {
            "main_js": settings.ANGULAR_FILES["main_js"],
            "polyfills_js": settings.ANGULAR_FILES["polyfills_js"],
            "styles_css": settings.ANGULAR_FILES["styles_css"],
            "data": {
                "maxId": Scene.objects.latest("id").id,
                "count": Scene.objects.count(),
            },
        }
        return render(request, "home.html", context)


def preview_verification_email(request):
    return render(
        request,
        "emails/password_reset_email.html",
        {
            "username": "Alice",
            "verification_code": "123456",
            "verification_link": "https://example.com/verify?token=abc123",
        },
    )
