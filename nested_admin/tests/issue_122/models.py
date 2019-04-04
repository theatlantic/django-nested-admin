from __future__ import unicode_literals

from django.db import models
from django.db.models import ForeignKey, CASCADE
from nested_admin.tests.compat import python_2_unicode_compatible


@python_2_unicode_compatible
class Parent(models.Model):
    name = models.CharField(max_length=10)

    def __str__(self):
        return self.name


@python_2_unicode_compatible
class Child1(models.Model):
    name = models.CharField(max_length=10)
    parent = ForeignKey(Parent, on_delete=CASCADE)

    def __str__(self):
        return self.name


@python_2_unicode_compatible
class Child2(models.Model):
    name = models.CharField(max_length=10)
    child1 = ForeignKey(Child1, on_delete=CASCADE)

    def __str__(self):
        return self.name
