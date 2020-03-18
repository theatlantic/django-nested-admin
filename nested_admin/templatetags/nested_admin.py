import re
from functools import wraps
import json

import django
from django import template
from django.conf import settings
from django.contrib.admin.options import InlineModelAdmin
from django.utils.safestring import mark_safe
from django.utils.html import escape

register = template.Library()


django_version = django.VERSION[:2]


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
    return escape(json.dumps(data))

def json_else_list_tag(f):
    """
    Decorator. Registers function as a simple_tag.
    Try: Return value of the decorated function json encoded.
    Except: Return []
    """
    @wraps(f)
    def inner(model_admin):
        try:
            return mark_safe(escape(json.dumps(f(model_admin))))
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


@register.filter
def formsetsort(formset, arg):
    """
    Takes a list of formset dicts, returns that list sorted by the sortable field.
    """
    if arg:
        sorted_list = []
        for item in formset:
            position = item.form[arg].data
            if position and position != "-1":
                sorted_list.append((int(position), item))
        sorted_list.sort()
        sorted_list = [item[1] for item in sorted_list]
        for item in formset:
            position = item.form[arg].data
            if not position or position == "-1":
                sorted_list.append(item)
    else:
        sorted_list = formset
    return sorted_list


@register.filter
def cell_count(inline_admin_form):
    """Returns the number of cells used in a tabular inline"""
    count = 1  # Hidden cell with hidden 'id' field
    for fieldset in inline_admin_form:
        # Loop through all the fields (one per cell)
        for line in fieldset:
            for field in line:
                count += 1
    if inline_admin_form.formset.can_delete:
        # Delete checkbox
        count += 1
    return count


class IfConditionNode(template.Node):

    def __init__(self, nodelist_true, nodelist_false, value):
        self.nodelist_true = nodelist_true
        self.nodelist_false = nodelist_false
        self.value = value

    def render(self, context):
        if self.value:
            return self.nodelist_true.render(context)
        else:
            return self.nodelist_false.render(context)


def str_to_version(string):
    return tuple([int(s) for s in string.split('.')])


@register.filter
def django_version_lt(string):
    return django_version < str_to_version(string)


@register.filter
def django_version_lte(string):
    return django_version <= str_to_version(string)


@register.filter
def django_version_gt(string):
    return django_version > str_to_version(string)


@register.filter
def django_version_gte(string):
    return django_version >= str_to_version(string)


@register.tag
def ifinlineclasses(parser, token):
    nodelist_true = parser.parse(('else', 'endifinlineclasses'))
    token = parser.next_token()
    if token.contents == 'else':
        nodelist_false = parser.parse(('endifinlineclasses',))
        parser.delete_first_token()
    else:
        nodelist_false = template.NodeList()
    return IfConditionNode(nodelist_true, nodelist_false, hasattr(InlineModelAdmin, 'classes'))
