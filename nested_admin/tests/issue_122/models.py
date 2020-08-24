from django.db import models
from django.db.models import ForeignKey, CASCADE


class Parent(models.Model):
    name = models.CharField(max_length=10)

    def __str__(self):
        return self.name


class Child1(models.Model):
    name = models.CharField(max_length=10)
    parent = ForeignKey(Parent, on_delete=CASCADE)

    def __str__(self):
        return self.name


class Child2(models.Model):
    name = models.CharField(max_length=10)
    child1 = ForeignKey(Child1, on_delete=CASCADE)

    def __str__(self):
        return self.name
