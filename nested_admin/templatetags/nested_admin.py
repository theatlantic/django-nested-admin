import re
from functools import wraps
import json

from django import template
from django.utils.safestring import mark_for_escaping

register = template.Library()


@register.filter
def form_index(form):
    """
    The id of the root 'form' element in a formset is the form's 'prefix'
    without the '-' preceding the index of the form. So, for instance, in a case
    where the form's 'id' field has the field name:
        prefix-2-id
    the 'form' element's id would be:
        prefix2
    and the form's index is '2'
    """
    matches = re.search(r'\-(\d+)$', form.prefix)
    if not matches:
        raise Exception("Form with invalid prefix passed to templatetag")
    return int(matches.group(1))


@register.filter
def strip_parent_name(nested_name, parent_name):
    if nested_name.find(parent_name + " ") == 0:
        return nested_name[len(parent_name)+1:]
    else:
        return nested_name
strip_parent_name.is_safe = True

# These tags are defined in grappelli.templatetags.grp_tags. The issue is that
# they are wrapped in mark_safe(), so we can't use them reliably inside of
# attributes.

@register.filter
def json_encode(data):
    return mark_for_escaping(json.dumps(data))

def json_else_list_tag(f):
    """
    Decorator. Registers function as a simple_tag.
    Try: Return value of the decorated function json encoded.
    Except: Return []
    """
    @wraps(f)
    def inner(model_admin):
        try:
            return mark_for_escaping(json.dumps(f(model_admin)))
        except:
            return []
    return register.simple_tag(inner)


@json_else_list_tag
def get_safe_related_lookup_fields_fk(model_admin):
    return model_admin.related_lookup_fields.get("fk", [])


@json_else_list_tag
def get_safe_related_lookup_fields_m2m(model_admin):
    return model_admin.related_lookup_fields.get("m2m", [])


@json_else_list_tag
def get_safe_related_lookup_fields_generic(model_admin):
    return model_admin.related_lookup_fields.get("generic", [])


# AUTOCOMPLETES

@json_else_list_tag
def get_safe_autocomplete_lookup_fields_fk(model_admin):
    return model_admin.autocomplete_lookup_fields.get("fk", [])


@json_else_list_tag
def get_safe_autocomplete_lookup_fields_m2m(model_admin):
    return model_admin.autocomplete_lookup_fields.get("m2m", [])


@json_else_list_tag
def get_safe_autocomplete_lookup_fields_generic(model_admin):
    return model_admin.autocomplete_lookup_fields.get("generic", [])
