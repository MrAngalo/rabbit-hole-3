import uuid
import random

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, UserManager
from django.db import models
from core.models import CustomManager
from django.utils import timezone

UserPremission = {
    5: "VISITOR",
    10: "TRUSTED",
    15: "DONOR",
    80: "MODERATOR",
    90: "ADMINISTRATOR",
    100: "OWNER",
}


class CustomUserManager(CustomManager["User"], UserManager):
    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError("You have not provided a valid email address.")

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.username_lower = user.username.lower()
        user.save(using=self._db)

        return user

    def create_user(self, email=None, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email=None, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self._create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    objects = CustomUserManager()
    id = models.AutoField(primary_key=True)

    is_active = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)

    username_lower = models.CharField(unique=True, max_length=20)
    username = models.CharField(unique=True, max_length=20)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100)
    # confirmed = models.BooleanField(default=False)
    created = models.DateTimeField(default=timezone.now)
    likes = models.IntegerField(default=0)
    dislikes = models.IntegerField(default=0)
    score = models.IntegerField(default=0)
    # permission = models.IntegerField(choices=UserPremission, default="VISITOR")
    ppf_gifId = models.CharField(max_length=32, blank=True)
    bio = models.CharField(max_length=400, blank=True)
    view_await_review = models.BooleanField(default=False)

    last_received_email = models.DateTimeField(null=True)
    # scenes: Scenes[]
    # rated_by: UserRating[] @OneToMany(() => UserRating, rating => rating.recipient)
    # user_ratings: UserRating[] @OneToMany(() => UserRating, rating => rating.owner)
    # scene_ratings: SceneRating[] @OneToMany(() => SceneRating, rating => rating.owner)
    # tokens: Token[] @OneToMany(() => Token, token => token.owner)
    # apitokens: ApiUserToken[] @OneToMany(() => ApiUserToken, usertoken => usertoken.user, { nullable: true })

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"

    USERNAME_FIELD = "email"
    EMAIL_FIELD = "email"
    REQUIRED_FIELDS = ["username", "password"]

    def get_full_name(self):
        return self.username

    def get_short_name(self):
        return self.username

    def __str__(self):
        return f"{self.username} - {self.email}"


def generate_safe_token(length=12):
    characters = "0123456789ACDEFHJKLMNPQRTUVWXY"  # excludes: B, G, I, L, O, S, Z
    return "".join(random.choice(characters) for _ in range(length))


class UserToken(models.Model):
    objects = CustomManager["UserToken"]()
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tokens")
    created_at = models.DateTimeField(default=timezone.now)
    expires_at = models.DateTimeField()
    token = models.CharField(default=generate_safe_token, max_length=16, unique=True)  # type: ignore

    def __str__(self):
        return f"Token for {self.user.email} - (Expires {self.expires_at})"

    class Meta:
        verbose_name = "User Token"
        verbose_name_plural = "User Tokens"
        indexes = [
            models.Index(fields=["token"]),
            models.Index(fields=["expires_at"]),
        ]
