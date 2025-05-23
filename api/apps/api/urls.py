from django.urls import re_path
from api.views import createScene, notImplemented, fetchScene

urlpatterns = [
    # Scene
    re_path(r"^scene/$", fetchScene),
    re_path(r"^scene/(?P<id>[0-9]+)$", fetchScene),
    re_path(r"^create/$", createScene),
    re_path(r"^create/(?P<parentId>[0-9]+)$", createScene),
    # Rating
    re_path(r"^rate/$", notImplemented),
    re_path(r"^rate/(?P<id>[0-9]+)$", notImplemented),
    # Authentication Mailer
    re_path(r"^verify/$", notImplemented),
    re_path(r"^pwreset/$", notImplemented),
    re_path(r"^pwnew/$", notImplemented),
]
