from django.db import models
from typing import Generic, TypeVar

T = TypeVar("T")


class CustomManager(models.Manager, Generic[T]):
    def get_safe(self, *args, **kwargs) -> T | None:
        try:
            return self.get(*args, **kwargs)
        except:
            return None
