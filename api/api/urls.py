from django.urls import re_path
from api.views import notImplemented, scene

urlpatterns = [
    # Scene
    re_path(r"^scene/$", scene),
    re_path(r"^scene/([0-9]+)$", scene),
    re_path(r"^create/$", notImplemented),
    re_path(r"^create/([0-9]+)$", notImplemented),
    # Rating
    re_path(r"^rate/$", notImplemented),
    re_path(r"^rate/([0-9]+)$", notImplemented),
    # Authentication Mailer
    re_path(r"^verify/$", notImplemented),
    re_path(r"^pwreset/$", notImplemented),
    re_path(r"^pwnew/$", notImplemented),
]
