from django.urls import re_path
from userauth.views import (
    LoginView,
    LogoutView,
    RegisterView,
    UserInfoView,
    PasswordCodeView,
    PasswordNewView,
)

urlpatterns = [
    #
    # Authentication
    #
    re_path(r"^login/$", LoginView.as_view()),
    re_path(r"^register/$", RegisterView.as_view()),
    re_path(r"^logout/$", LogoutView.as_view()),
    re_path(r"^user-info/$", UserInfoView.as_view()),
    #
    # Authentication Mailer
    #
    # re_path(r"^verify/$", NotImplementedView.as_view()),
    re_path(r"^pwcode/$", PasswordCodeView.as_view()),
    re_path(r"^pwnew/$", PasswordNewView.as_view()),
]
