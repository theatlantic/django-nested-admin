from __future__ import unicode_literals

from django.db import models
from django.db.models import ForeignKey, CASCADE

try:
    from django.utils.encoding import python_2_unicode_compatible
except ImportError:
    python_2_unicode_compatible = lambda cls: cls


@python_2_unicode_compatible
class GroupAbstract(models.Model):

    slug = models.CharField(max_length=128)

    class Meta:
        app_label = "nested_admin"
        abstract = True

    def __str__(self):
        return self.slug


@python_2_unicode_compatible
class SectionAbstract(models.Model):

    slug = models.CharField(max_length=128)
    position = models.PositiveIntegerField()

    class Meta:
        app_label = "nested_admin"
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
        app_label = "nested_admin"
        abstract = True

    def __str__(self):
        parts = ["%s[%d]" % (self.name, self.position)]
        if self.section:
            parts.insert(0, "%s" % self.section)
        return "/".join(parts)


class StackedGroup(GroupAbstract):

    class Meta:
        app_label = "nested_admin"


class StackedSection(SectionAbstract):

    group = ForeignKey(StackedGroup, related_name='section_set', on_delete=CASCADE)

    class Meta:
        app_label = "nested_admin"
        ordering = ('group', 'position')


class StackedItem(ItemAbstract):

    section = ForeignKey(StackedSection, related_name='item_set', on_delete=CASCADE)

    class Meta:
        app_label = "nested_admin"
        ordering = ('section', 'position')


class TabularGroup(GroupAbstract):

    class Meta:
        app_label = "nested_admin"


class TabularSection(SectionAbstract):

    group = ForeignKey(TabularGroup, related_name='section_set', on_delete=CASCADE)

    class Meta:
        app_label = "nested_admin"
        ordering = ('group', 'position')


class TabularItem(ItemAbstract):

    section = ForeignKey(TabularSection, related_name='item_set', on_delete=CASCADE)

    class Meta:
        app_label = "nested_admin"
        ordering = ('section', 'position')


class TopLevel(models.Model):

    name = models.CharField(max_length=200)

    class Meta:
        app_label = "nested_admin"


class LevelOne(models.Model):

    name = models.CharField(max_length=200)
    parent_level = ForeignKey(TopLevel, related_name='children', on_delete=CASCADE)
    position = models.PositiveIntegerField()

    class Meta:
        app_label = "nested_admin"
        ordering = ('position', )


class LevelTwo(models.Model):

    name = models.CharField(max_length=200)
    parent_level = ForeignKey(LevelOne, related_name='children', on_delete=CASCADE)
    position = models.PositiveIntegerField()

    class Meta:
        app_label = "nested_admin"
        ordering = ('position', )


class LevelThree(models.Model):

    name = models.CharField(max_length=200)
    parent_level = ForeignKey(LevelTwo, related_name='children', on_delete=CASCADE)
    position = models.PositiveIntegerField()

    class Meta:
        app_label = "nested_admin"
        ordering = ('position', )


class SortableWithExtraRoot(models.Model):

    slug = models.CharField(max_length=128)

    class Meta:
        app_label = "nested_admin"


class SortableWithExtraChild(models.Model):

    slug = models.CharField(max_length=128)
    root = ForeignKey(SortableWithExtraRoot, on_delete=CASCADE)
    position = models.PositiveIntegerField()
    foo = models.CharField(max_length=128, default='bar')

    class Meta:
        app_label = "nested_admin"
        ordering = ('position', )
