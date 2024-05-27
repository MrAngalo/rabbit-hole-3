from django.urls import re_path
from tenor.views import posts

urlpatterns = [
    re_path(r"^posts/$", posts),
]
