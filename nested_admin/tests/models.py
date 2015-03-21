import six

from django.core.urlresolvers import reverse
from django.db import models


class Group(models.Model):

    slug = models.CharField(max_length=128)

    class Meta:
        app_label = "nested_admin"

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


class Section(models.Model):

    slug = models.CharField(max_length=128)
    position = models.PositiveIntegerField()

    group = models.ForeignKey(Group)

    class Meta:
        app_label = "nested_admin"
        ordering = ('group', 'position', )

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


class Item(models.Model):

    name = models.CharField(max_length=128)
    section = models.ForeignKey(Section)
    position = models.PositiveIntegerField()

    class Meta:
        app_label = "nested_admin"
        ordering = ('section', 'position', )

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
