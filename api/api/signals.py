from django.db.models.signals import post_migrate
from django.dispatch import receiver
from api.models import Scene
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from api.apps import ApiConfig


@receiver(post_migrate)
def create_api_models(sender, **kwargs):
    if type(sender) != ApiConfig:
        return

    from api.models import Scene, SCENE_STATUS

    print("\n------ Creating Default Models for API ------")

    # Create root scene if it does not exist
    _, created = Scene.objects.get_or_create(
        id=0,
        defaults={
            "creator_name": "MrAngalo",
            "title": "The Mischievous Forest",
            "description": "You are lost.\\nYou see a tree, a rock, and a waterfall on the distance.\\nYou can do anything! What do you do?",
            "gifId": "16992587",
            "status": SCENE_STATUS["PUBLIC"],
        },
    )
    if not created:
        print("Found Root Scene (id=0)!")
    else:
        print("Creating Root Scene (id=0)...")

    from django.contrib.auth.models import Permission
    from django.contrib.contenttypes.models import ContentType

    # Permissions for Scene
    content_type_id = ContentType.objects.get(app_label="api", model="scene").id
    permissions = (
        ("view_unapproved", "Can view scenes before they are public"),
        ("bypass_approval", "Can skip admin approval"),
    )

    for permission in permissions:
        codename, name = permission

        _, created = Permission.objects.get_or_create(
            content_type_id=content_type_id,
            codename=codename,
            defaults={"name": name},
        )
        if not created:
            print(f"Found Permission {codename}!")
        else:
            print(f"Creating Permission {codename}...")

    print("\n---------------------------------------------")
