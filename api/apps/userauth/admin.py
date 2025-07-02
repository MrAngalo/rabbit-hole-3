from django.contrib import admin
from django.contrib.auth.models import Permission
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _

from .models import User, UserToken


@admin.register(User)
class CustomUserAdmin(BaseUserAdmin):
    list_display = ("id", "email", "username", "is_active", "is_staff", "is_superuser")
    search_fields = ("email", "username")
    ordering = ("email",)

    readonly_fields = (
        "created",
        "last_login",
        "last_received_email",
        "score",
        "likes",
        "dislikes",
    )

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        (
            _("Personal info"),
            {"fields": ("username", "username_lower", "bio", "ppf_gifId")},
        ),
        (
            _("Status"),
            {"fields": ("is_active", "is_staff", "is_superuser", "view_await_review")},
        ),
        (
            _("Important dates"),
            {"fields": ("created", "last_login", "last_received_email")},
        ),
        (_("Stats"), {"fields": ("likes", "dislikes", "score")}),
        (_("Permissions"), {"fields": ("groups", "user_permissions")}),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "username", "password1", "password2"),
            },
        ),
    )


@admin.register(UserToken)
class UserTokenAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "created_at", "expires_at", "token")
    search_fields = ("token", "user__email")
    readonly_fields = ("id", "user", "created_at", "expires_at", "token")


@admin.register(Permission)
class CustomPermissionAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "codename", "content_type")
    search_fields = ("name", "codename")
    ordering = ("content_type", "codename")

    readonly_fields = (
        "id",
        "name",
        "codename",
        "content_type",
    )

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False
