from django.urls import re_path
from userauth.views import login, logout, register, testToken

urlpatterns = [
    re_path(r"^login/$", login),
    re_path(r"^register/$", register),
    re_path(r"^logout/$", logout),
    re_path(r"^test_token/$", testToken),
]
