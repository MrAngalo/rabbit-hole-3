from userauth.models import User
from .models import Badge, Scene

from rest_framework import serializers


class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = ("id", "name", "bg_color", "description", "data_uri")


class SceneParentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scene
        fields = (
            "id",
            "status",
        )


class SceneChildSerializer(serializers.ModelSerializer):
    badges = BadgeSerializer(many=True, required=False)

    class Meta:
        model = Scene
        fields = (
            "id",
            "creator",
            "title",
            "likes",
            "dislikes",
            "status",
            "badges",
        )


class FetchSceneSerializer(serializers.ModelSerializer):
    parent = SceneParentSerializer(many=False, required=False)
    children = SceneChildSerializer(many=True, required=False)
    badges = BadgeSerializer(many=True, required=False)

    class Meta:
        model = Scene
        fields = (
            "id",
            "creator",
            "creator_name",
            "parent",
            "children",
            "title",
            "description",
            "gifId",
            "created",
            "likes",
            "dislikes",
            "status",
            "badges",
        )


class CreateSceneSerializer(serializers.ModelSerializer):
    parent = SceneParentSerializer(many=False, required=False)

    class Meta:
        model = Scene
        fields = (
            "parent",
            "creator",
            "creator_name",
            "title",
            "description",
            "gifId",
            "status",
        )


# @api_view(['GET', 'PATCH'])
# def questions_by_id(request,user,pk):
#     question = Question.objects.get(pk=pk)
#     if request.method == 'GET':
#         serializer = QuestionSerializer(question)
#         return Response(serializer.data)

# class AskedToSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = AskedTo
#         fields = ('to_user', 'replied')

# class QuestionSerializer(serializers.ModelSerializer):
#     places = PlaceSerializer(many=True, required=False)
#     asked = AskedToSerializer(source='askedto_set', many=True)

#     class Meta:
#         model = Question
#         fields = ('id', 'created_on', 'title', 'places', 'answered','asked')
#         extra_kwargs = {'created_by': {'read_only': True}}

# class Question(BaseModel):
#     title = models.CharField(max_length=200, null=False)
#     places = models.ManyToManyField(Place, blank=True)
#     answered = models.BooleanField(default=False)

# class AskedTo(BaseModel):
#     ques = models.ForeignKey(Question, on_delete=models.CASCADE)
#     to_user = models.ForeignKey(settings.AUTH_USER_MODEL)
#     replied = models.BooleanField(default=False)


# class Place(models.Model):
#     g_place_id = models.CharField(max_length=20,primary_key=True)
#     json = models.TextField(null=True)
#     name = models.CharField(max_length=40)


class FetchUserSerializer(serializers.ModelSerializer):
    scenes = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "created",
            "bio",
            "ppf_gifId",
            "scenes",
        ]

    def get_scenes(self, obj):
        return [
            {"id": scene.id, "title": scene.title, "gifId": scene.gifId}
            for scene in obj.scenes.all()
        ]


class FetchSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "created", "bio", "ppf_gifId", "view_await_review"]
