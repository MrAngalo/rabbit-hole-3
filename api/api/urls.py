from django.urls import re_path
from api.views import sceneApi

urlpatterns = [
    re_path(r"^scene/$", sceneApi),
    re_path(r"^scene/([0-9]+)$", sceneApi)
]