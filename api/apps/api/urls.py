from django.urls import re_path
from api.views import createScene, notImplemented, FetchSceneView

urlpatterns = [
    # Scene
    re_path(r"^scene/$", FetchSceneView.as_view()),
    re_path(r"^scene/(?P<id>[0-9]+)$", FetchSceneView.as_view()),
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
