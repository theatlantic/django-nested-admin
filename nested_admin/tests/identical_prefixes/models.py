from django.db import models
from django.utils.encoding import python_2_unicode_compatible


@python_2_unicode_compatible
class Root(models.Model):
    slug = models.SlugField(max_length=10, blank=True, null=True)

    def __str__(self):
        return "%s(%s)" % (type(self).__name__, self.slug)


@python_2_unicode_compatible
class A(models.Model):
    root = models.ForeignKey(Root, related_name="a_set", on_delete=models.CASCADE)
    position = models.PositiveIntegerField()

    foo = models.CharField(max_length=10, blank=True, null=True)
    a_type = models.CharField(max_length=1, choices=(('X', 'X'), ('Y', 'Y')))
    default_a_type = None

    class Meta:
        ordering = ['position']

    def __str__(self):
        parts = ["A%s[%d](%s)" % (self.a_type, self.position, self.foo)]
        if self.root:
            parts.insert(0, "%s" % self.root)
        return "/".join(parts)

    def save(self, **kwargs):
        self.a_type = self.default_a_type
        super(A, self).save(**kwargs)


class AManager(models.Manager):
    def __init__(self, a_type):
        self.a_type = a_type
        super(AManager, self).__init__()

    def get_queryset(self):
        return super(AManager, self).get_queryset().filter(a_type=self.a_type)


class AX(A):
    default_a_type = 'X'
    objects = AManager(default_a_type)

    class Meta:
        proxy = True


class AY(A):
    default_a_type = 'Y'
    objects = AManager(default_a_type)

    class Meta:
        proxy = True


@python_2_unicode_compatible
class B(models.Model):
    a = models.ForeignKey(A, related_name="b_set", on_delete=models.CASCADE)
    position = models.PositiveIntegerField()

    bar = models.CharField(max_length=10, blank=True, null=True)
    b_type = models.CharField(max_length=1, choices=(('X', 'X'), ('Y', 'Y')))
    default_b_type = None

    class Meta:
        ordering = ['position']

    def __str__(self):
        parts = ["B%s[%d](%s)" % (self.b_type, self.position, self.bar)]
        if self.a:
            parts.insert(0, "%s" % self.a)
        return "/".join(parts)

    def save(self, **kwargs):
        self.b_type = self.default_b_type
        super(B, self).save(**kwargs)


class BManager(models.Manager):
    def __init__(self, b_type):
        self.b_type = b_type
        super(BManager, self).__init__()

    def get_queryset(self):
        return super(BManager, self).get_queryset().filter(b_type=self.b_type)


class BX(B):
    default_b_type = 'X'
    objects = BManager(default_b_type)

    class Meta:
        proxy = True


class BY(B):
    default_b_type = 'Y'
    objects = BManager(default_b_type)

    class Meta:
        proxy = True
