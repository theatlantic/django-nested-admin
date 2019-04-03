from __future__ import unicode_literals

import django
from django.contrib.contenttypes.fields import GenericRelation, GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models
from django.db.models import ForeignKey, CASCADE
from nested_admin.tests.compat import python_2_unicode_compatible

try:
    from polymorphic.models import PolymorphicModel
except:
    # Temporary until django-polymorphic supports django 3.0
    if django.VERSION < (3, 0):
        raise
    else:
        PolymorphicModel = models.Model


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


@python_2_unicode_compatible
class ALevelTwo(PolymorphicModel):

    name = models.CharField(max_length=200, blank=True)
    position = models.PositiveIntegerField()
    polymorphic_parent = ForeignKey(LevelOneA, related_name='a_set', on_delete=CASCADE)

    def __str__(self):
        if 'C' in type(self).__name__:
            prefix = '(C) '
        if 'D' in type(self).__name__:
            prefix = '(D) '
        else:
            prefix = ''
        parts = ["%s%s[%d]" % (prefix, self.name, self.position)]
        if self.polymorphic_parent:
            parts.insert(0, "%s" % self.polymorphic_parent)
        return "/".join(parts)


class ALevelTwoC(ALevelTwo):
    ac = models.CharField(max_length=200)


@python_2_unicode_compatible
class GFKX(models.Model):
    name = models.CharField(max_length=255)
    position = models.PositiveIntegerField()
    content_type = ForeignKey(ContentType, on_delete=CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey()

    class Meta:
        ordering = ['object_id', 'position']

    def __str__(self):
        parts = ["%s[%d]" % (self.name, self.position)]
        if self.content_object:
            parts.insert(0, "%s" % self.content_object)
        return "/".join(parts)


class ALevelTwoD(ALevelTwo):
    ad = models.CharField(max_length=200)
    x_set = GenericRelation(GFKX)


@python_2_unicode_compatible
class BLevelTwo(PolymorphicModel):

    name = models.CharField(max_length=200, blank=True)
    position = models.PositiveIntegerField()
    polymorphic_parent = ForeignKey(LevelOneB, related_name='b_set', on_delete=CASCADE)

    def __str__(self):
        if 'C' in type(self).__name__:
            prefix = '(C) '
        if 'D' in type(self).__name__:
            prefix = '(D) '
        else:
            prefix = ''
        parts = ["%s%s[%d]" % (prefix, self.name, self.position)]
        if self.polymorphic_parent:
            parts.insert(0, "%s" % self.polymorphic_parent)
        return "/".join(parts)


class BLevelTwoC(BLevelTwo):
    bc = models.CharField(max_length=200)


class BLevelTwoD(BLevelTwo):
    bd = models.CharField(max_length=200)
