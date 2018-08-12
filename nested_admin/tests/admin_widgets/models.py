from __future__ import unicode_literals

from django.db import models
from django.db.models import ForeignKey, CASCADE
from django.utils.encoding import python_2_unicode_compatible


class TestAdminWidgetsRoot(models.Model):
    name = models.CharField(max_length=200)


@python_2_unicode_compatible
class TestAdminWidgetsRelated1(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name


@python_2_unicode_compatible
class TestAdminWidgetsRelated2(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name

    @staticmethod
    def autocomplete_search_fields():
        return ("name__icontains", )


@python_2_unicode_compatible
class TestAdminWidgetsM2M(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name


@python_2_unicode_compatible
class TestAdminWidgetsA(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField()
    parent = ForeignKey(TestAdminWidgetsRoot, on_delete=CASCADE)
    position = models.PositiveIntegerField()
    date = models.DateTimeField(blank=True, null=True)
    upload = models.FileField(blank=True, null=True, upload_to='foo')
    fk1 = models.ForeignKey(TestAdminWidgetsRelated1, blank=True, null=True,
        on_delete=CASCADE, related_name='+')
    fk2 = models.ForeignKey(TestAdminWidgetsRelated1, blank=True, null=True,
        on_delete=CASCADE, related_name='+')
    m2m = models.ManyToManyField(TestAdminWidgetsM2M, blank=True)

    class Meta:
        ordering = ('position', )

    def __str__(self):
        return self.name


@python_2_unicode_compatible
class TestAdminWidgetsB(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField()
    parent = ForeignKey(TestAdminWidgetsA, on_delete=CASCADE)
    position = models.PositiveIntegerField()
    date = models.DateTimeField(blank=True, null=True)
    upload = models.FileField(blank=True, null=True, upload_to='foo')
    fk1 = models.ForeignKey(TestAdminWidgetsRelated1, blank=True, null=True,
        on_delete=CASCADE, related_name='+')
    fk2 = models.ForeignKey(TestAdminWidgetsRelated1, blank=True, null=True,
        on_delete=CASCADE, related_name='+')
    m2m = models.ManyToManyField(TestAdminWidgetsM2M, blank=True)

    class Meta:
        ordering = ('position', )

    def __str__(self):
        parent_name = self.parent.name if self.parent else '?'
        return "%s - %s" % (parent_name, self.name)


@python_2_unicode_compatible
class TestAdminWidgetsC0(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField()
    parent = ForeignKey(TestAdminWidgetsB, on_delete=CASCADE)
    position = models.PositiveIntegerField()
    date = models.DateTimeField(blank=True, null=True)
    upload = models.FileField(blank=True, null=True, upload_to='foo')
    fk1 = models.ForeignKey(TestAdminWidgetsRelated1, blank=True, null=True,
        on_delete=CASCADE, related_name='+')
    fk2 = models.ForeignKey(TestAdminWidgetsRelated1, blank=True, null=True,
        on_delete=CASCADE, related_name='+')
    m2m = models.ManyToManyField(TestAdminWidgetsM2M, blank=True)

    class Meta:
        ordering = ('position', )

    def __str__(self):
        parent_name = self.parent.name if self.parent else '?'
        return "%s - %s" % (parent_name, self.name)


@python_2_unicode_compatible
class TestAdminWidgetsC1(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField()
    parent = ForeignKey(TestAdminWidgetsB, on_delete=CASCADE)
    position = models.PositiveIntegerField()
    date = models.DateTimeField(blank=True, null=True)
    upload = models.FileField(blank=True, null=True, upload_to='foo')
    fk1 = models.ForeignKey(TestAdminWidgetsRelated1, blank=True, null=True,
        on_delete=CASCADE, related_name='+')
    fk2 = models.ForeignKey(TestAdminWidgetsRelated1, blank=True, null=True,
        on_delete=CASCADE, related_name='+')
    m2m = models.ManyToManyField(TestAdminWidgetsM2M, blank=True)

    class Meta:
        ordering = ('position', )

    def __str__(self):
        parent_name = self.parent.name if self.parent else '?'
        return "%s - %s" % (parent_name, self.name)


class TestWidgetMediaOrderRoot(models.Model):
    name = models.CharField(max_length=200)


@python_2_unicode_compatible
class TestWidgetMediaOrderA(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField()
    parent = ForeignKey(TestWidgetMediaOrderRoot, on_delete=CASCADE)
    position = models.PositiveIntegerField()

    class Meta:
        ordering = ('position', )

    def __str__(self):
        return self.name


@python_2_unicode_compatible
class TestWidgetMediaOrderB(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField()
    parent = ForeignKey(TestWidgetMediaOrderA, on_delete=CASCADE)
    position = models.PositiveIntegerField()

    class Meta:
        ordering = ('position', )

    def __str__(self):
        parent_name = self.parent.name if self.parent else '?'
        return "%s - %s" % (parent_name, self.name)


@python_2_unicode_compatible
class TestWidgetMediaOrderC0(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField()
    parent = ForeignKey(TestWidgetMediaOrderB, on_delete=CASCADE)
    position = models.PositiveIntegerField()

    class Meta:
        ordering = ('position', )

    def __str__(self):
        parent_name = self.parent.name if self.parent else '?'
        return "%s - %s" % (parent_name, self.name)


@python_2_unicode_compatible
class TestWidgetMediaOrderC1(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField()
    parent = ForeignKey(TestWidgetMediaOrderB, on_delete=CASCADE)
    position = models.PositiveIntegerField()
    date = models.DateTimeField(blank=True, null=True)
    upload = models.FileField(blank=True, null=True, upload_to='foo')
    fk1 = models.ForeignKey(TestAdminWidgetsRelated1, blank=True, null=True,
        on_delete=CASCADE, related_name='+')
    fk2 = models.ForeignKey(TestAdminWidgetsRelated1, blank=True, null=True,
        on_delete=CASCADE, related_name='+')
    m2m = models.ManyToManyField(TestAdminWidgetsM2M, blank=True)

    class Meta:
        ordering = ('position', )

    def __str__(self):
        parent_name = self.parent.name if self.parent else '?'
        return "%s - %s" % (parent_name, self.name)
