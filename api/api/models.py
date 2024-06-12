from django.db import models
from django.utils import timezone

from userauth.models import User
from core.models import CustomManager

# Create your models here.


class Badge(models.Model):
    objects: CustomManager["Badge"] = CustomManager()  # Error
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
    "HIDDEN": 10,  # Only admins can see it
    "AWAITING_REVIEW": 20,  # Only users with "view scenes awaiting approval" enabled
    "PUBLIC": 30,  # Everyone can see
}

SCENE_STATUS_R = {v: k for k, v in SCENE_STATUS.items()}

Badge.objects.get_safe()


class Scene(models.Model):
    objects: CustomManager["Scene"] = CustomManager()

    id = models.AutoField(primary_key=True)
    parent = models.ForeignKey(
        "self",
        related_name="children",
        null=True,
        blank=True,
        default=None,
        on_delete=models.SET_NULL,
    )
    children: models.Manager
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
    status = models.IntegerField(choices=SCENE_STATUS_R)  # type: ignore
    # rated_by: SceneRating[] @OneToMany(() => SceneRating, rating => rating.scene)

    badges = models.ManyToManyField(Badge, related_name="scenes", blank=True)

    class Meta:
        verbose_name = "Scene"
        verbose_name_plural = "Scenes"

    def __str__(self):
        return f"{self.id} - {self.title} - {self.creator_name}"


class SceneRating(models.Model):
    objects: CustomManager["SceneRating"] = CustomManager()

    class Meta:
        verbose_name = "Scene Rating"
        verbose_name_plural = "Scene Ratings"


class UserRating(models.Model):
    objects: CustomManager["UserRating"] = CustomManager()

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
