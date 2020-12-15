from django.db import models
from nested_admin.tests.compat import python_2_unicode_compatible


@python_2_unicode_compatible
class CuratedGroupCollection(models.Model):
    slug = models.SlugField()
    name = models.CharField(max_length=64)

    def __str__(self):
        return self.name


@python_2_unicode_compatible
class CuratedGroup(models.Model):
    slug = models.SlugField()
    name = models.CharField(max_length=64)
    collection = models.ForeignKey(CuratedGroupCollection, on_delete=models.CASCADE)
    position = models.PositiveSmallIntegerField()

    class Meta:
        ordering = ['position']

    def __str__(self):
        return self.name


class CuratedList(models.Model):

    position = models.PositiveSmallIntegerField()
    group = models.ForeignKey(CuratedGroup, on_delete=models.CASCADE)

    class Meta:
        ordering = ['position']


@python_2_unicode_compatible
class CuratedItem(models.Model):

    parent = models.ForeignKey(CuratedList, on_delete=models.CASCADE)
    position = models.PositiveSmallIntegerField()
    name = models.CharField(max_length=64, blank=True)

    class Meta:
        ordering = ['position']

    def __str__(self):
        if self.name:
            return self.name
        else:
            return "Curated Item"
