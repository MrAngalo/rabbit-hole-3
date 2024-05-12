from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, UserManager
from django.db import models
from django.utils import timezone
# Create your models here.

UserPremission = (
    ("VISITOR", 5),
    ("TRUSTED", 10),
    ("DONOR", 15),
    ("MODERATOR", 80),
    ("ADMINISTRATOR", 90),
    ("OWNER", 100),
)

class CustomUserManager(UserManager):
    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError("You have not provided a valid email address.")
        
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user
    
    def create_user(self, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self._create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = ['username','password']

    id = models.AutoField(primary_key=True)
    username_lower = models.CharField(unique=True, max_length=20)
    username = models.CharField(unique=True, max_length=20)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=60)
    # confirmed = models.BooleanField(default=False)
    created = models.DateTimeField(default=timezone.now)
    likes = models.IntegerField(default=0)
    dislikes = models.IntegerField(default=0)
    score = models.IntegerField(default=0)
    # permission = models.IntegerField(choices=UserPremission, default=UserPremission[0][0])
    ppf_gifId = models.CharField(max_length=32, null=True)
    bio = models.CharField(max_length=400, null=True)
    view_await_review = models.BooleanField(default=False)
    # scenes: Scenes[]
    # rated_by: UserRating[] @OneToMany(() => UserRating, rating => rating.recipient)
    # user_ratings: UserRating[] @OneToMany(() => UserRating, rating => rating.owner)
    # scene_ratings: SceneRating[] @OneToMany(() => SceneRating, rating => rating.owner)
    # tokens: Token[] @OneToMany(() => Token, token => token.owner)
    # apitokens: ApiUserToken[] @OneToMany(() => ApiUserToken, usertoken => usertoken.user, { nullable: true })
    pass

SCENE_STATUS = (
    ("HIDDEN", 10), # Only admins can see it
    ("AWAITING_REVIEW", 20), # Only users with "view scenes awaiting approval" enabled
    ("PUBLIC", 30), # Everyone can see
)

class Scene(models.Model):
    class Meta:
        verbose_name = 'Scene'
        verbose_name_plural = 'Scenes'

    id = models.AutoField(primary_key=True)
    parent = models.ForeignKey("self", related_name="children", null=True, on_delete=models.SET_NULL)
    # children: Scene[]
    # badges: Badge[];
    creator = models.ForeignKey(User, related_name="scenes", null=True, on_delete=models.SET_NULL);
    creator_name = models.CharField(max_length=20)
    title = models.CharField(max_length=30)
    description = models.CharField(max_length=1000)
    gifId = models.CharField(max_length=32)
    created = models.DateTimeField(default=timezone.now)
    likes = models.IntegerField(default=0)
    dislikes = models.IntegerField(default=0)
    status = models.IntegerField(choices=SCENE_STATUS)
    # rated_by: SceneRating[] @OneToMany(() => SceneRating, rating => rating.scene)

class SceneRating(models.Model):
    class Meta:
        verbose_name = 'Scene Rating'
        verbose_name_plural = 'Scene Ratings'

class UserRating(models.Model):
    class Meta:
        verbose_name = 'User Rating'
        verbose_name_plural = 'User Ratings'

class Badge(models.Model):
    class Meta:
        verbose_name = 'Badge'
        verbose_name_plural = 'Badges'

    id = models.AutoField(primary_key=True)
    scenes = models.ManyToManyField(Scene, related_name="badges", blank=True)
    name = models.CharField(max_length=20)
    bg_color = models.CharField(max_length=8)
    description = models.CharField(max_length=250)
    data_uri = models.CharField(max_length=30)

# class ApiKeys(models.Model):
#     pass

# class ApiUserToken(models.Model):
#     pass

# class Session(models.Model):
#     pass

# class Tokens(models.Model):
#     pass