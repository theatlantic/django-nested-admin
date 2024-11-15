from django.db import models
from django.db.models import ForeignKey, CASCADE


class MenuItem(models.Model):
    label = models.CharField(max_length=255)
    parent = ForeignKey(
        "MenuItem", related_name="children", on_delete=CASCADE, null=True
    )
    position = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["position"]

    def __str__(self):
        return self.name
