from django.db import models
from typing import Generic, TypeVar

T = TypeVar("T", bound=models.Model)


class CustomManager(models.Manager, Generic[T]):
    def get(self, *args, **kwargs) -> T | None:
        try:
            return super().get(*args, **kwargs)
        except:
            return None
