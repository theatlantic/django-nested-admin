from django.db import models
from django.db.models import ForeignKey, CASCADE


class User(models.Model):
    name = models.CharField(max_length=10)

    def __str__(self):
        return self.name


class Project(models.Model):
    name = models.CharField(max_length=10)
    user = ForeignKey(User, on_delete=CASCADE)

    def __str__(self):
        return self.name


class Document(models.Model):
    name = models.CharField(max_length=10)
    project = ForeignKey(Project, on_delete=CASCADE)

    def __str__(self):
        return self.name
