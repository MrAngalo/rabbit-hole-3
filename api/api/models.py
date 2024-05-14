from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, UserManager
from django.db import models
from django.utils import timezone

# Create your models here.

UserPremission = {
    5: "VISITOR",
    10: "TRUSTED",
    15: "DONOR",
    80: "MODERATOR",
    90: "ADMINISTRATOR",
    100: "OWNER",
}


class CustomManager(models.Manager):
    def get_safe(self, *args, **kwargs):
        try:
            return self.get(*args, **kwargs)
        except:
            return None


class CustomUserManager(CustomManager, UserManager):
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

    is_active = models.BooleanField(default=True)
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


class Badge(models.Model):
    objects = CustomManager()
    id = models.AutoField(primary_key=True)
    # scenes: Scene[]
    name = models.CharField(max_length=20)
    bg_color = models.CharField(max_length=8)
    description = models.CharField(max_length=250)
    data_uri = models.CharField(max_length=30)

    class Meta:
        verbose_name = "Badge"
        verbose_name_plural = "Badges"

    def __str__(self):
        return self.name


SCENE_STATUS = {
    10: "HIDDEN",  # Only admins can see it
    20: "AWAITING_REVIEW",  # Only users with "view scenes awaiting approval" enabled
    30: "PUBLIC",  # Everyone can see
}


class Scene(models.Model):
    objects = CustomManager()

    id = models.AutoField(primary_key=True)
    parent = models.ForeignKey(
        "self",
        related_name="children",
        null=True,
        blank=True,
        default=None,
        on_delete=models.SET_NULL,
    )
    # children: Scene[]
    creator = models.ForeignKey(
        User,
        related_name="scenes",
        null=True,
        blank=True,
        default=None,
        on_delete=models.SET_NULL,
    )
    creator_name = models.CharField(max_length=20)
    title = models.CharField(max_length=30)
    description = models.CharField(max_length=1000)
    gifId = models.CharField(max_length=32)
    created = models.DateTimeField(default=timezone.now)
    likes = models.IntegerField(default=0)
    dislikes = models.IntegerField(default=0)
    status = models.IntegerField(choices=SCENE_STATUS)
    # rated_by: SceneRating[] @OneToMany(() => SceneRating, rating => rating.scene)

    badges = models.ManyToManyField(Badge, related_name="scenes", blank=True)

    class Meta:
        verbose_name = "Scene"
        verbose_name_plural = "Scenes"

    def __str__(self):
        return f"{self.id} - {self.title} - {self.creator_name}"


class SceneRating(models.Model):
    objects = CustomManager()

    class Meta:
        verbose_name = "Scene Rating"
        verbose_name_plural = "Scene Ratings"


class UserRating(models.Model):
    objects = CustomManager()

    class Meta:
        verbose_name = "User Rating"
        verbose_name_plural = "User Ratings"


# class ApiKeys(models.Model):
#     pass

# class ApiUserToken(models.Model):
#     pass

# class Session(models.Model):
#     pass

# class Tokens(models.Model):
#     pass
