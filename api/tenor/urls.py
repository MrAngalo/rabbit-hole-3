from django.urls import re_path
from tenor.views import find

urlpatterns = [
    re_path(r"^find/$", find),
]
