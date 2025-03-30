from django.contrib import admin
from api.models import Badge, Scene, SceneRating, UserRating

admin.site.register(Scene)
admin.site.register(SceneRating)
admin.site.register(UserRating)
admin.site.register(Badge)
