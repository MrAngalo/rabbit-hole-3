from django.urls import re_path
from tenor.views import posts, search

urlpatterns = [re_path(r"^posts/$", posts), re_path(r"^search/$", search)]
