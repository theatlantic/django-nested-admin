from __future__ import unicode_literals

from django.contrib.contenttypes.fields import GenericRelation, GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models
from django.db.models import ForeignKey, CASCADE
from nested_admin.tests.compat import python_2_unicode_compatible


@python_2_unicode_compatible
class GFKB(models.Model):
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


@python_2_unicode_compatible
class GFKA(models.Model):
    slug = models.CharField(max_length=255)
    position = models.PositiveIntegerField()
    content_type = ForeignKey(ContentType, on_delete=CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey()
    b_set = GenericRelation(GFKB)

    class Meta:
        ordering = ['object_id', 'position']

    def __str__(self):
        parts = ["%s[%d]" % (self.slug, self.position)]
        if self.content_object:
            parts.insert(0, "%s" % self.content_object)
        return "/".join(parts)


@python_2_unicode_compatible
class GFKRoot(models.Model):
    slug = models.CharField(max_length=255)
    a_set = GenericRelation(GFKA)

    def __str__(self):
        return self.slug
