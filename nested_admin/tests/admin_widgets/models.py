from __future__ import unicode_literals

from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models
from django.db.models import ForeignKey, CASCADE
from nested_admin.tests.compat import python_2_unicode_compatible


class WidgetsRoot(models.Model):
    name = models.CharField(max_length=200)


@python_2_unicode_compatible
class WidgetsRelated1(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name

    def related_label(self):
        return self.name

    @staticmethod
    def autocomplete_search_fields():
        return ("name__icontains", )


@python_2_unicode_compatible
class WidgetsRelated2(models.Model):
    name = models.CharField(max_length=200)
    date_created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date_created']

    def __str__(self):
        return self.name

    def related_label(self):
        return self.name

    @staticmethod
    def autocomplete_search_fields():
        return ("name__icontains", )


@python_2_unicode_compatible
class WidgetsM2M(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name


@python_2_unicode_compatible
class WidgetsM2MTwo(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name

    def related_label(self):
        return self.name

    @staticmethod
    def autocomplete_search_fields():
        return ("name__icontains", )


@python_2_unicode_compatible
class WidgetsM2MThree(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name

    def related_label(self):
        return self.name

    @staticmethod
    def autocomplete_search_fields():
        return ("name__icontains", )


@python_2_unicode_compatible
class WidgetsA(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField()
    parent = ForeignKey(WidgetsRoot, on_delete=CASCADE)
    position = models.PositiveIntegerField()
    date = models.DateTimeField(blank=True, null=True)
    upload = models.FileField(blank=True, null=True, upload_to='foo')
    fk1 = models.ForeignKey(WidgetsRelated1, blank=True, null=True,
        on_delete=CASCADE, related_name='+')
    fk2 = models.ForeignKey(WidgetsRelated1, blank=True, null=True,
        on_delete=CASCADE, related_name='+')
    fk3 = models.ForeignKey(WidgetsRelated2, blank=True, null=True,
        on_delete=CASCADE, related_name='+')
    fk4 = models.ForeignKey(WidgetsRelated2, blank=True, null=True,
        on_delete=CASCADE, related_name='+')
    m2m = models.ManyToManyField(WidgetsM2M, blank=True)
    m2m_two = models.ManyToManyField(WidgetsM2MTwo, blank=True)
    m2m_three = models.ManyToManyField(WidgetsM2MThree, blank=True)

    content_type = ForeignKey(ContentType, null=True, blank=True, on_delete=CASCADE)
    object_id = models.PositiveIntegerField(null=True, blank=True)
    content_object = GenericForeignKey()

    relation_type = ForeignKey(ContentType, null=True, blank=True,
        on_delete=CASCADE, related_name='+')
    relation_id = models.PositiveIntegerField(null=True, blank=True)
    relation_object = GenericForeignKey('relation_type', 'relation_id')

    class Meta:
        ordering = ('position', )

    def __str__(self):
        return self.name


@python_2_unicode_compatible
class WidgetsB(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField()
    parent = ForeignKey(WidgetsA, on_delete=CASCADE)
    position = models.PositiveIntegerField()
    date = models.DateTimeField(blank=True, null=True)
    upload = models.FileField(blank=True, null=True, upload_to='foo')
    fk1 = models.ForeignKey(WidgetsRelated1, blank=True, null=True,
        on_delete=CASCADE, related_name='+')
    fk2 = models.ForeignKey(WidgetsRelated1, blank=True, null=True,
        on_delete=CASCADE, related_name='+')
    fk3 = models.ForeignKey(WidgetsRelated2, blank=True, null=True,
        on_delete=CASCADE, related_name='+')
    fk4 = models.ForeignKey(WidgetsRelated2, blank=True, null=True,
        on_delete=CASCADE, related_name='+')
    m2m = models.ManyToManyField(WidgetsM2M, blank=True)
    m2m_two = models.ManyToManyField(WidgetsM2MTwo, blank=True)
    m2m_three = models.ManyToManyField(WidgetsM2MThree, blank=True)

    content_type = ForeignKey(ContentType, null=True, blank=True, on_delete=CASCADE)
    object_id = models.PositiveIntegerField(null=True, blank=True)
    content_object = GenericForeignKey('content_type', 'object_id')

    relation_type = ForeignKey(ContentType, null=True, blank=True,
        on_delete=CASCADE, related_name='+')
    relation_id = models.PositiveIntegerField(null=True, blank=True)
    relation_object = GenericForeignKey('relation_type', 'relation_id')

    class Meta:
        ordering = ('position', )

    def __str__(self):
        parent_name = self.parent.name if self.parent else '?'
        return "%s - %s" % (parent_name, self.name)


@python_2_unicode_compatible
class WidgetsC0(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField()
    parent = ForeignKey(WidgetsB, on_delete=CASCADE)
    position = models.PositiveIntegerField()
    date = models.DateTimeField(blank=True, null=True)
    upload = models.FileField(blank=True, null=True, upload_to='foo')
    fk1 = models.ForeignKey(WidgetsRelated1, blank=True, null=True,
        on_delete=CASCADE, related_name='+')
    fk2 = models.ForeignKey(WidgetsRelated1, blank=True, null=True,
        on_delete=CASCADE, related_name='+')
    fk3 = models.ForeignKey(WidgetsRelated2, blank=True, null=True,
        on_delete=CASCADE, related_name='+')
    fk4 = models.ForeignKey(WidgetsRelated2, blank=True, null=True,
        on_delete=CASCADE, related_name='+')
    m2m = models.ManyToManyField(WidgetsM2M, blank=True)
    m2m_two = models.ManyToManyField(WidgetsM2MTwo, blank=True)
    m2m_three = models.ManyToManyField(WidgetsM2MThree, blank=True)

    content_type = ForeignKey(ContentType, null=True, blank=True, on_delete=CASCADE)
    object_id = models.PositiveIntegerField(null=True, blank=True)
    content_object = GenericForeignKey()

    relation_type = ForeignKey(ContentType, null=True, blank=True,
        on_delete=CASCADE, related_name='+')
    relation_id = models.PositiveIntegerField(null=True, blank=True)
    relation_object = GenericForeignKey('relation_type', 'relation_id')

    class Meta:
        ordering = ('position', )

    def __str__(self):
        parent_name = self.parent.name if self.parent else '?'
        return "%s - %s" % (parent_name, self.name)


@python_2_unicode_compatible
class WidgetsC1(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField()
    parent = ForeignKey(WidgetsB, on_delete=CASCADE)
    position = models.PositiveIntegerField()
    date = models.DateTimeField(blank=True, null=True)
    upload = models.FileField(blank=True, null=True, upload_to='foo')
    fk1 = models.ForeignKey(WidgetsRelated1, blank=True, null=True,
        on_delete=CASCADE, related_name='+')
    fk2 = models.ForeignKey(WidgetsRelated1, blank=True, null=True,
        on_delete=CASCADE, related_name='+')
    fk3 = models.ForeignKey(WidgetsRelated2, blank=True, null=True,
        on_delete=CASCADE, related_name='+')
    fk4 = models.ForeignKey(WidgetsRelated2, blank=True, null=True,
        on_delete=CASCADE, related_name='+')
    m2m = models.ManyToManyField(WidgetsM2M, blank=True)
    m2m_two = models.ManyToManyField(WidgetsM2MTwo, blank=True)

    content_type = ForeignKey(ContentType, null=True, blank=True, on_delete=CASCADE)
    object_id = models.PositiveIntegerField(null=True, blank=True)
    content_object = GenericForeignKey()

    class Meta:
        ordering = ('position', )

    def __str__(self):
        parent_name = self.parent.name if self.parent else '?'
        return "%s - %s" % (parent_name, self.name)


class WidgetMediaOrderRoot(models.Model):
    name = models.CharField(max_length=200)


@python_2_unicode_compatible
class WidgetMediaOrderA(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField()
    parent = ForeignKey(WidgetMediaOrderRoot, on_delete=CASCADE)
    position = models.PositiveIntegerField()

    class Meta:
        ordering = ('position', )

    def __str__(self):
        return self.name


@python_2_unicode_compatible
class WidgetMediaOrderB(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField()
    parent = ForeignKey(WidgetMediaOrderA, on_delete=CASCADE)
    position = models.PositiveIntegerField()

    class Meta:
        ordering = ('position', )

    def __str__(self):
        parent_name = self.parent.name if self.parent else '?'
        return "%s - %s" % (parent_name, self.name)


@python_2_unicode_compatible
class WidgetMediaOrderC0(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField()
    parent = ForeignKey(WidgetMediaOrderB, on_delete=CASCADE)
    position = models.PositiveIntegerField()

    class Meta:
        ordering = ('position', )

    def __str__(self):
        parent_name = self.parent.name if self.parent else '?'
        return "%s - %s" % (parent_name, self.name)


@python_2_unicode_compatible
class WidgetMediaOrderC1(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField()
    parent = ForeignKey(WidgetMediaOrderB, on_delete=CASCADE)
    position = models.PositiveIntegerField()
    date = models.DateTimeField(blank=True, null=True)
    upload = models.FileField(blank=True, null=True, upload_to='foo')
    fk1 = models.ForeignKey(WidgetsRelated1, blank=True, null=True,
        on_delete=CASCADE, related_name='+')
    fk2 = models.ForeignKey(WidgetsRelated1, blank=True, null=True,
        on_delete=CASCADE, related_name='+')
    fk3 = models.ForeignKey(WidgetsRelated2, blank=True, null=True,
        on_delete=CASCADE, related_name='+')
    fk4 = models.ForeignKey(WidgetsRelated2, blank=True, null=True,
        on_delete=CASCADE, related_name='+')
    m2m = models.ManyToManyField(WidgetsM2M, blank=True)

    class Meta:
        ordering = ('position', )

    def __str__(self):
        parent_name = self.parent.name if self.parent else '?'
        return "%s - %s" % (parent_name, self.name)


class WidgetMediaOrderRootWithDateWidget(WidgetMediaOrderRoot):
    date = models.DateTimeField(blank=True, null=True)
