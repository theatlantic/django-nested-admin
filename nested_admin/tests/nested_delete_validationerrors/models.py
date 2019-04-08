from __future__ import unicode_literals

from django.db import models
from django.db.models import ForeignKey, CASCADE
from nested_admin.tests.compat import python_2_unicode_compatible


@python_2_unicode_compatible
class Parent(models.Model):
    name = models.CharField(max_length=128)

    def __str__(self):
        return self.name


@python_2_unicode_compatible
class Child(models.Model):
    name = models.CharField(max_length=128)
    parent = ForeignKey(Parent, on_delete=CASCADE, related_name='children')
    position = models.PositiveIntegerField()

    class Meta:
        ordering = ['position']

    def __str__(self):
        return self.name


@python_2_unicode_compatible
class GrandChild(models.Model):
    name = models.CharField(max_length=128)
    parent = ForeignKey(Child, on_delete=CASCADE, related_name='children')
    position = models.PositiveIntegerField()

    class Meta:
        ordering = ['position']

    def __str__(self):
        return self.name
