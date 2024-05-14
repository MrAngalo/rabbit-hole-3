from django.urls import re_path
from api.views import notImplemented, sceneApi

urlpatterns = [
    # Scene
    re_path(r"^scene/$", sceneApi),
    re_path(r"^scene/([0-9]+)$", sceneApi),
    re_path(r"^create/$", notImplemented),
    re_path(r"^create/([0-9]+)$", notImplemented),

    # Rating
    re_path(r"^rate/$", notImplemented),
    re_path(r"^rate/([0-9]+)$", notImplemented),

    # Authentication
    re_path(r"^login/$", notImplemented),
    re_path(r"^register/$", notImplemented),
    re_path(r"^logout/$", notImplemented),
    
    # Authentication Mailer
    re_path(r"^verify/$", notImplemented),
    re_path(r"^pwreset/$", notImplemented),
    re_path(r"^pwnew/$", notImplemented),
]