from django.urls import re_path
from userauth.views import (
    LoginView,
    LogoutView,
    UserInfoView,
    RegisterCodeView,
    RegisterView,
    PasswordCodeView,
    PasswordResetView,
)

urlpatterns = [
    #
    # Authentication
    #
    re_path(r"^login/$", LoginView.as_view()),
    re_path(r"^logout/$", LogoutView.as_view()),
    re_path(r"^user-info/$", UserInfoView.as_view()),
    #
    # Authentication Mailer
    #
    # re_path(r"^verify/$", NotImplementedView.as_view()),
    re_path(r"^rgcode/$", RegisterCodeView.as_view()),
    re_path(r"^register/$", RegisterView.as_view()),
    re_path(r"^pwcode/$", PasswordCodeView.as_view()),
    re_path(r"^pwreset/$", PasswordResetView.as_view()),
]
