from django.urls import re_path
from userauth.views import (
    LoginView,
    LogoutView,
    RegisterView,
    UserInfoView,
)

urlpatterns = [
    re_path(r"^login/$", LoginView.as_view()),
    re_path(r"^register/$", RegisterView.as_view()),
    re_path(r"^logout/$", LogoutView.as_view()),
    re_path(r"^user-info/$", UserInfoView.as_view()),
]
