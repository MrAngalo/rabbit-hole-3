from django.urls import re_path
from tenor.views import PostsView, SearchView

urlpatterns = [
    re_path(r"^posts/$", PostsView.as_view()),
    re_path(r"^search/$", SearchView.as_view()),
]
