from django.shortcuts import render
from django.http import HttpResponse

from api.models import Scene

from . import settings


def home(request):
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
