from django.shortcuts import render
from django.http import HttpResponse

from . import settings


def home(request):
    context = settings.ANGULAR_FILES
    return render(request, "home.html", context)
