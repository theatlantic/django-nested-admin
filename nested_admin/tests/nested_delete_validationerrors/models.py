from django.db import models
from django.db.models import ForeignKey, CASCADE


class Parent(models.Model):
    name = models.CharField(max_length=128)

    def __str__(self):
        return self.name


class Child(models.Model):
    name = models.CharField(max_length=128)
    parent = ForeignKey(Parent, on_delete=CASCADE, related_name="children")
    position = models.PositiveIntegerField()

    class Meta:
        ordering = ["position"]

    def __str__(self):
        return self.name


class GrandChild(models.Model):
    name = models.CharField(max_length=128)
    parent = ForeignKey(Child, on_delete=CASCADE, related_name="children")
    position = models.PositiveIntegerField()

    class Meta:
        ordering = ["position"]

    def __str__(self):
        return self.name
