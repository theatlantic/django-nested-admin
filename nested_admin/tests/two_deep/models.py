from __future__ import unicode_literals

from django.db import models
from django.db.models import ForeignKey, CASCADE
from django.utils.encoding import python_2_unicode_compatible


@python_2_unicode_compatible
class GroupAbstract(models.Model):

    slug = models.CharField(max_length=128)

    class Meta:
        abstract = True

    def __str__(self):
        return self.slug


@python_2_unicode_compatible
class SectionAbstract(models.Model):

    slug = models.CharField(max_length=128)
    position = models.PositiveIntegerField()

    class Meta:
        abstract = True

    def __str__(self):
        parts = ["%s[%d]" % (self.slug, self.position)]
        if self.group:
            parts.insert(0, "%s" % self.group)
        return "/".join(parts)


@python_2_unicode_compatible
class ItemAbstract(models.Model):

    name = models.CharField(max_length=128)
    position = models.PositiveIntegerField()

    class Meta:
        abstract = True

    def __str__(self):
        parts = ["%s[%d]" % (self.name, self.position)]
        if self.section:
            parts.insert(0, "%s" % self.section)
        return "/".join(parts)


class StackedGroup(GroupAbstract):
    pass


class StackedSection(SectionAbstract):
    group = ForeignKey(StackedGroup, related_name='section_set', on_delete=CASCADE)

    class Meta:
        ordering = ('group', 'position')


class StackedItem(ItemAbstract):
    section = ForeignKey(StackedSection, related_name='item_set', on_delete=CASCADE)

    class Meta:
        ordering = ('section', 'position')


class TabularGroup(GroupAbstract):
    pass


class TabularSection(SectionAbstract):
    group = ForeignKey(TabularGroup, related_name='section_set', on_delete=CASCADE)

    class Meta:
        ordering = ('group', 'position')


class TabularItem(ItemAbstract):
    section = ForeignKey(TabularSection, related_name='item_set', on_delete=CASCADE)

    class Meta:
        ordering = ('section', 'position')


class SortableWithExtraRoot(models.Model):
    slug = models.CharField(max_length=128)


class SortableWithExtraChild(models.Model):
    slug = models.CharField(max_length=128)
    root = ForeignKey(SortableWithExtraRoot, on_delete=CASCADE)
    position = models.PositiveIntegerField()
    foo = models.CharField(max_length=128, default='bar')

    class Meta:
        ordering = ('position', )
