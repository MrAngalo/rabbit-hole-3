"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, re_path
from django.urls import include

from .views import home

urlpatterns = [
    # Angular routes
    path("", home),
    re_path(r"^scene/$", home),
    re_path(r"^scene/[0-9]+/$", home),
    re_path(r"^create/$", home),
    re_path(r"^create/[0-9]+/$", home),
    re_path(r"^login/$", home),
    re_path(r"^test_token/$", home),
    # Admin routes
    path("admin/", admin.site.urls),
    # API routes
    path("api/", include("api.urls")),
    path("api/auth/", include("userauth.urls")),
    path("api/tenor/", include("tenor.urls")),
]
