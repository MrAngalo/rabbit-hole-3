from django.urls import re_path
from api.views import login, logout, notImplemented, register, scene, testToken

urlpatterns = [
    # Scene
    re_path(r"^scene/$", scene),
    re_path(r"^scene/([0-9]+)$", scene),
    re_path(r"^create/$", notImplemented),
    re_path(r"^create/([0-9]+)$", notImplemented),
    # Rating
    re_path(r"^rate/$", notImplemented),
    re_path(r"^rate/([0-9]+)$", notImplemented),
    # Authentication
    re_path(r"^login/$", login),
    re_path(r"^register/$", register),
    re_path(r"^logout/$", logout),
    re_path(r"^test_token/$", testToken),
    # Authentication Mailer
    re_path(r"^verify/$", notImplemented),
    re_path(r"^pwreset/$", notImplemented),
    re_path(r"^pwnew/$", notImplemented),
]
