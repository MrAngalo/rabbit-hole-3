import sys
from django.apps import AppConfig

class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        if 'runserver' not in sys.argv:
            return True
        
        from api.models import Scene

        # Create root scene if it does not exist
        root = Scene.objects.get_safe(id=0)
        if (root != None):
            print("Root Scene (id=0) found, skipping...")
        else:
            print("Root Scene (id=0) not found, creating default...")
            root = Scene(
                id=0,
                creator_name="MrAngalo",
                title="The Mischievous Forest",
                description="You are lost.\\nYou see a tree, a rock, and a waterfall on the distance.\\nYou can do anything! What do you do?",
                gifId="16992587",
                status="PUBLIC",
            )
            root.save()
