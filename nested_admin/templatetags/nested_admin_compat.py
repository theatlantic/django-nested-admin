import django
from django.template import Library

try:
    from django.contrib.admin.utils import quote
except ImportError:
    from django.contrib.admin.util import quote

if django.VERSION[:2] < (1, 5):
    from django.templatetags.future import url as url_compat
else:
    from django.template.defaulttags import url as url_compat


register = Library()


@register.tag
def url(parser, token):
    return url_compat(parser, token)


@register.filter
def admin_urlname(opts, arg):
    model_name = getattr(opts, 'model_name', opts.object_name.lower())
    return 'admin:%s_%s_%s' % (opts.app_label, model_name, arg)


@register.filter
def admin_urlquote(value):
    return quote(value)
