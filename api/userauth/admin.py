from django.contrib import admin
from api.models import User
from django.contrib.auth.models import Permission

admin.site.register(User)
admin.site.register(Permission)
