from __future__ import unicode_literals

from django.db import models
from django.db.models import ForeignKey, CASCADE
from nested_admin.tests.compat import python_2_unicode_compatible


@python_2_unicode_compatible
class User(models.Model):
    name = models.CharField(max_length=10)

    def __str__(self):
        return self.name


@python_2_unicode_compatible
class Project(models.Model):
    name = models.CharField(max_length=10)
    user = ForeignKey(User, on_delete=CASCADE)

    def __str__(self):
        return self.name


@python_2_unicode_compatible
class Document(models.Model):
    name = models.CharField(max_length=10)
    project = ForeignKey(Project, on_delete=CASCADE)

    def __str__(self):
        return self.name
