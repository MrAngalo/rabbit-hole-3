from django.contrib import admin
from django.contrib.auth.models import Permission
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from django.utils import timezone

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
    list_display = (
        "token",
        "user",
        "created_at",
        "expires_at",
        "duration",
        "remaining",
        "is_valid",
    )
    search_fields = ("token", "user__email")
    readonly_fields = ("id", "token")

    def is_valid(self, obj):
        return "🔴" if obj.expires_at < timezone.now() else "🟢"

    def duration(self, obj):
        return self.format_time(obj.expires_at - obj.created_at)

    def remaining(self, obj):
        return self.format_time(obj.expires_at - timezone.now())

    def format_time(self, delta):
        minutes, seconds = divmod(delta.total_seconds(), 60)
        hours, minutes = divmod(minutes, 60)
        days, hours = divmod(hours, 24)

        parts = [
            f"{int(days)}d" if days else "",
            f"{int(hours)}h" if hours else "",
            f"{int(minutes)}m" if minutes else "",
            f"{int(seconds)}s" if seconds else "",
        ]
        return " ".join(part for part in parts if part)


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
