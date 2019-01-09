from __future__ import unicode_literals

from django.db import models
from django.db.models import ForeignKey, CASCADE
from django.utils.encoding import python_2_unicode_compatible

from polymorphic.models import PolymorphicModel


@python_2_unicode_compatible
class TopLevel(models.Model):

    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name


@python_2_unicode_compatible
class LevelOne(PolymorphicModel):

    name = models.CharField(max_length=200, blank=True)
    position = models.PositiveIntegerField()
    parent_level = ForeignKey(TopLevel, related_name='children', on_delete=CASCADE)

    def __str__(self):
        if 'A' in type(self).__name__:
            prefix = '(A) '
        if 'B' in type(self).__name__:
            prefix = '(B) '
        else:
            prefix = ''
        parts = ["%s%s[%d]" % (prefix, self.name, self.position)]
        if self.parent_level:
            parts.insert(0, "%s" % self.parent_level)
        return "/".join(parts)


class LevelOneA(LevelOne):
    a = models.CharField(max_length=200)


class LevelOneB(LevelOne):
    b = models.CharField(max_length=200)


@python_2_unicode_compatible
class LevelTwo(PolymorphicModel):

    name = models.CharField(max_length=200, blank=True)
    position = models.PositiveIntegerField()
    parent_level = ForeignKey(LevelOne, related_name='children', on_delete=CASCADE)

    def __str__(self):
        if 'C' in type(self).__name__:
            prefix = '(C) '
        if 'D' in type(self).__name__:
            prefix = '(D) '
        else:
            prefix = ''
        parts = ["%s%s[%d]" % (prefix, self.name, self.position)]
        if self.parent_level:
            parts.insert(0, "%s" % self.parent_level)
        return "/".join(parts)


class LevelTwoC(LevelTwo):
    c = models.CharField(max_length=200)


class LevelTwoD(LevelTwo):
    d = models.CharField(max_length=200)
