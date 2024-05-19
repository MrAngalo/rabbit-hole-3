from rest_framework import serializers
from api.models import Badge, Scene, User


# https://stackoverflow.com/questions/53319787/how-can-i-select-specific-fields-in-django-rest-framework
class DynamicFieldsModelSerializer(serializers.ModelSerializer):
    """
    A ModelSerializer that takes an additional `fields` argument that
    controls which fields should be displayed.
    """

    def __init__(self, *args, **kwargs):
        # Don't pass the 'fields' arg up to the superclass
        fields = kwargs.pop("fields", None)

        # Instantiate the superclass normally
        super(DynamicFieldsModelSerializer, self).__init__(*args, **kwargs)

        if fields is not None:
            # Drop any fields that are not specified in the `fields` argument.
            allowed = set(fields)
            existing = set(self.fields.keys())
            for field_name in existing - allowed:
                self.fields.pop(field_name)


class UserSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class BadgeSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = Badge
        fields = ("id", "name", "bg_color", "description", "data_uri")


class SceneParentSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = Scene
        fields = (
            "id",
            "status",
        )


class SceneChildSerializer(DynamicFieldsModelSerializer):
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


class SceneSerializer(DynamicFieldsModelSerializer):
    parent = SceneParentSerializer(many=False, required=False)
    children = SceneChildSerializer(many=True, required=False)
    badges = BadgeSerializer(many=True, required=False)
    # parent_id = serializers.CharField(source='parent.id')
    # children_title = serializers.CharField(source='children.title')
    # children_title = serializers.ReadOnlyField(source='children.title')
    # children_title = serializers.RelatedField(source='children.title', read_only=True)

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
            #     'parent.status',
            #     'children.id',
            # 'children_title',
            #     'children.likes',
            #     'children.dislikes',
            #     'children.status',
            #     'children.creator.id',
            #     'children.badges',
        )

        # .leftJoinAndSelect('scene.creator', 'creator')
        # .leftJoinAndSelect('scene.badges', 'badges')
        # .leftJoinAndSelect('scene.parent', 'parent')
        # .leftJoinAndSelect('scene.children', 'children')
        # .leftJoinAndSelect('children.creator', 'children_creator')
        # .leftJoinAndSelect('children.badges', 'children_badges')
        # .select([
        #     'scene',
        #     'badges',
        #     'creator.id',
        #     'parent.id',
        #     'parent.status',
        #     'children.id',
        #     'children.title',
        #     'children.likes',
        #     'children.dislikes',
        #     'children.status',
        #     'children.creator.id',
        #     'children.badges',
        # ])


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
