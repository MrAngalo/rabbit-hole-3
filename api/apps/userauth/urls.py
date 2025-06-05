from django.urls import re_path
from userauth.views import LoginView, logout, register, testToken, userInfo

urlpatterns = [
    re_path(r"^login/$", LoginView.as_view()),
    re_path(r"^register/$", register),
    re_path(r"^logout/$", logout),
    re_path(r"^test-token/$", testToken),
    re_path(r"^user-info/$", userInfo),
]
