from __future__ import unicode_literals

from django.db import models
from django.db.models import ForeignKey, CASCADE
from django.utils.encoding import python_2_unicode_compatible


@python_2_unicode_compatible
class RootAbstract(models.Model):

    slug = models.CharField(max_length=128)

    class Meta:
        abstract = True

    def __str__(self):
        return self.slug


@python_2_unicode_compatible
class ChildAbstract(models.Model):

    slug = models.CharField(max_length=128, help_text="Halp")
    position = models.PositiveIntegerField()
    boolean = models.BooleanField(default=False)
    readonly = models.CharField(max_length=255)
    text = models.TextField(default='')

    class Meta:
        abstract = True

    def __str__(self):
        parts = ["%s[%d]" % (self.slug, self.position)]
        if self.root:
            parts.insert(0, "%s" % self.root)
        return "/".join(parts)


class PlainStackedRoot(RootAbstract):

    class Meta:
        verbose_name = "Stacked Root"
        verbose_name_plural = "Stacked Roots"


class PlainStackedChild(ChildAbstract):
    root = ForeignKey(PlainStackedRoot, related_name='children', on_delete=CASCADE)

    class Meta:
        ordering = ('root', 'position')
        verbose_name = "Stacked Child"
        verbose_name_plural = "Stacked Children"

class PlainTabularRoot(RootAbstract):

    class Meta:
        verbose_name = "Tabular Root"
        verbose_name_plural = "Tabular Roots"



class PlainTabularChild(ChildAbstract):
    root = ForeignKey(PlainTabularRoot, related_name='children', on_delete=CASCADE)

    class Meta:
        ordering = ('root', 'position')
        verbose_name = "Tabular Child"
        verbose_name_plural = "Tabular Children"


class NestedStackedRoot(RootAbstract):

    class Meta:
        verbose_name = "Stacked Root"
        verbose_name_plural = "Stacked Roots"


class NestedStackedChild(ChildAbstract):
    root = ForeignKey(NestedStackedRoot, related_name='children', on_delete=CASCADE)

    class Meta:
        ordering = ('root', 'position')
        verbose_name = "Stacked Child"
        verbose_name_plural = "Stacked Children"


class NestedTabularRoot(RootAbstract):

    class Meta:
        verbose_name = "Tabular Root"
        verbose_name_plural = "Tabular Roots"


class NestedTabularChild(ChildAbstract):
    root = ForeignKey(NestedTabularRoot, related_name='children', on_delete=CASCADE)

    class Meta:
        ordering = ('root', 'position')
        verbose_name = "Tabular Child"
        verbose_name_plural = "Tabular Children"
