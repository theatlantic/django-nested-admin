import six

from django.core.urlresolvers import reverse
from django.db import models


class GroupAbstract(models.Model):

    slug = models.CharField(max_length=128)

    class Meta:
        app_label = "nested_admin"
        abstract = True

    def __str__(self):
        if six.PY2 and isinstance(self.slug, unicode):
            return self.slug.encode('utf-8')
        return self.slug

    def __unicode__(self):
        return self.slug

    def get_absolute_url(self):
        info = (self._meta.app_label, self._meta.object_name.lower())
        if self.pk:
            return reverse('admin:%s_%s_change' % info, args=[self.pk])
        else:
            return reverse('admin:%s_%s_add' % info)


class SectionAbstract(models.Model):

    slug = models.CharField(max_length=128)
    position = models.PositiveIntegerField()

    class Meta:
        app_label = "nested_admin"
        abstract = True

    def __unicode__(self):
        parts = ["%s[%d]" % (self.slug, self.position)]
        if self.group:
            parts.insert(0, u"%s" % self.group)
        return u"/".join(parts)

    def __str__(self):
        if six.PY2:
            return self.__unicode__().encode('utf-8')
        else:
            return self.__unicode__()


class ItemAbstract(models.Model):

    name = models.CharField(max_length=128)
    position = models.PositiveIntegerField()

    class Meta:
        app_label = "nested_admin"
        abstract = True

    def __unicode__(self):
        parts = ["%s[%d]" % (self.name, self.position)]
        if self.section:
            parts.insert(0, u"%s" % self.section)
        return u"/".join(parts)

    def __str__(self):
        if six.PY2:
            return self.__unicode__().encode('utf-8')
        else:
            return self.__unicode__()


class StackedGroup(GroupAbstract):

    class Meta:
        app_label = "nested_admin"


class StackedSection(SectionAbstract):

    group = models.ForeignKey(StackedGroup, related_name='section_set',
        on_delete=models.CASCADE)

    class Meta:
        app_label = "nested_admin"
        ordering = ('group', 'position')


class StackedItem(ItemAbstract):

    section = models.ForeignKey(StackedSection, related_name='item_set',
        on_delete=models.CASCADE)

    class Meta:
        app_label = "nested_admin"
        ordering = ('section', 'position')


class TabularGroup(GroupAbstract):

    class Meta:
        app_label = "nested_admin"


class TabularSection(SectionAbstract):

    group = models.ForeignKey(TabularGroup, related_name='section_set',
        on_delete=models.CASCADE)

    class Meta:
        app_label = "nested_admin"
        ordering = ('group', 'position')


class TabularItem(ItemAbstract):

    section = models.ForeignKey(TabularSection, related_name='item_set',
        on_delete=models.CASCADE)

    class Meta:
        app_label = "nested_admin"
        ordering = ('section', 'position')


class TopLevel(models.Model):

    name = models.CharField(max_length=200)

    class Meta:
        app_label = "nested_admin"

    def get_absolute_url(self):
        info = (self._meta.app_label, self._meta.object_name.lower())
        if self.pk:
            return reverse('admin:%s_%s_change' % info, args=[self.pk])
        else:
            return reverse('admin:%s_%s_add' % info)


class LevelOne(models.Model):

    name = models.CharField(max_length=200)
    parent_level = models.ForeignKey(TopLevel, on_delete=models.CASCADE)

    class Meta:
        app_label = "nested_admin"


class LevelTwo(models.Model):

    name = models.CharField(max_length=200)
    parent_level = models.ForeignKey(LevelOne, on_delete=models.CASCADE)

    class Meta:
        app_label = "nested_admin"


class LevelThree(models.Model):

    name = models.CharField(max_length=200)
    parent_level = models.ForeignKey(LevelTwo, on_delete=models.CASCADE)

    class Meta:
        app_label = "nested_admin"


class SortableWithExtraRoot(models.Model):

    slug = models.CharField(max_length=128)

    class Meta:
        app_label = "nested_admin"

    def get_absolute_url(self):
        info = (self._meta.app_label, self._meta.object_name.lower())
        if self.pk:
            return reverse('admin:%s_%s_change' % info, args=[self.pk])
        else:
            return reverse('admin:%s_%s_add' % info)


class SortableWithExtraChild(models.Model):

    slug = models.CharField(max_length=128)
    root = models.ForeignKey(SortableWithExtraRoot, on_delete=models.CASCADE)
    position = models.PositiveIntegerField()
    foo = models.CharField(max_length=128, default='bar')

    class Meta:
        app_label = "nested_admin"
