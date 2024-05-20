from django.db import models


class CustomManager(models.Manager):
    def get_safe(self, *args, **kwargs):
        try:
            return self.get(*args, **kwargs)
        except:
            return None
