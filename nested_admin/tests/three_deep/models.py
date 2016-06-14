from __future__ import unicode_literals

from django.db import models
from django.db.models import ForeignKey, CASCADE


class TopLevel(models.Model):
    name = models.CharField(max_length=200)


class LevelOne(models.Model):
    name = models.CharField(max_length=200)
    parent_level = ForeignKey(TopLevel, related_name='children', on_delete=CASCADE)
    position = models.PositiveIntegerField()

    class Meta:
        ordering = ('position', )


class LevelTwo(models.Model):
    name = models.CharField(max_length=200, blank=True)
    parent_level = ForeignKey(LevelOne, related_name='children', on_delete=CASCADE)
    position = models.PositiveIntegerField(blank=True, null=True)

    class Meta:
        ordering = ('position', )


class LevelThree(models.Model):
    name = models.CharField(max_length=200)
    parent_level = ForeignKey(LevelTwo, related_name='children', on_delete=CASCADE)
    position = models.PositiveIntegerField()

    class Meta:
        ordering = ('position', )
