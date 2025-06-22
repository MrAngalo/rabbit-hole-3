from django.urls import re_path
from api.views import (
    CreateSceneView,
    FetchSettingsView,
    NotImplementedView,
    FetchSceneView,
    FetchUserView,
)

urlpatterns = [
    # Scene
    re_path(r"^scene/$", FetchSceneView.as_view()),
    re_path(r"^scene/(?P<id>[0-9]+)$", FetchSceneView.as_view()),
    re_path(r"^create/$", CreateSceneView.as_view()),
    re_path(r"^create/(?P<parentId>[0-9]+)$", CreateSceneView.as_view()),
    # Rating
    re_path(r"^rate/$", NotImplementedView.as_view()),
    re_path(r"^rate/(?P<id>[0-9]+)$", NotImplementedView.as_view()),
    # Authentication Mailer
    re_path(r"^verify/$", NotImplementedView.as_view()),
    re_path(r"^pwreset/$", NotImplementedView.as_view()),
    re_path(r"^pwnew/$", NotImplementedView.as_view()),
    # User
    re_path(r"^user/(?P<username>\w+)$", FetchUserView.as_view()),
    re_path(r"^account/$", FetchSettingsView.as_view()),
]
