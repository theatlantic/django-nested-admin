# All this craziness is so that we can allow the classes in nested_admin.formsets
# to be importable directly from this module, e.g.:
#
#     from nested_admin import NestedInlineFormSet
#
# without running afoul of the strict import order required by Django 1.9+.
# This implementation is shamelessly stolen from werkzeug's ``__init__.py``.
#
# Also included is a monkey-patch for django.forms.formsets.all_valid().
import pkg_resources
import sys
from types import ModuleType

import django
import django.forms.formsets
import monkeybiz

__version__ = '3.3.1'

# import mapping to objects in other modules
all_by_module = {
    'nested_admin.forms': (
        'SortableHiddenMixin',),
    'nested_admin.formsets': (
        'NestedInlineFormSet', 'NestedBaseGenericInlineFormSet'),
    'nested_admin.nested': (
        'NestedModelAdmin', 'NestedModelAdminMixin', 'NestedInlineAdminFormset',
        'NestedInlineModelAdmin', 'NestedStackedInline', 'NestedTabularInline',
        'NestedInlineModelAdminMixin', 'NestedGenericInlineModelAdmin',
        'NestedGenericStackedInline', 'NestedGenericTabularInline',
        'NestedStackedInlineMixin', 'NestedTabularInlineMixin',
        'NestedGenericStackedInline', 'NestedGenericTabularInline',
        'NestedGenericStackedInlineMixin', 'NestedGenericTabularInlineMixin',
        'NestedGenericInlineModelAdminMixin', 'NestedInlineAdminFormsetMixin'),
}

all_by_module['nested_admin.polymorphic'] = (
    'NestedPolymorphicInlineAdminFormset', 'NestedPolymorphicInlineModelAdmin',
    'NestedStackedPolymorphicInline', 'NestedPolymorphicInlineSupportMixin',
    'NestedPolymorphicModelAdmin', 'NestedGenericPolymorphicInlineModelAdmin',
    'NestedGenericStackedPolymorphicInline')

# modules that should be imported when accessed as attributes of nested_admin
attribute_modules = frozenset(['forms', 'formsets', 'nested', 'polymorphic'])

object_origins = {}
for module, items in all_by_module.items():
    for item in items:
        object_origins[item] = module


class module(ModuleType):

    def __dir__(self):
        """Just show what we want to show."""
        result = list(new_module.__all__)
        result.extend(('__file__', '__path__', '__doc__', '__all__',
                       '__docformat__', '__name__', '__path__',
                       '__package__', '__version__'))
        return result

    def __getattr__(self, name):
        if name in object_origins:
            module = __import__(object_origins[name], None, None, [name])
            for extra_name in all_by_module[module.__name__]:
                setattr(self, extra_name, getattr(module, extra_name))
            return getattr(module, name)
        elif name in attribute_modules:
            __import__('nested_admin.' + name)
        return ModuleType.__getattribute__(self, name)


# keep a reference to this module so that it's not garbage collected
old_module = sys.modules[__name__]

# setup the new module and patch it into the dict of loaded modules
new_module = sys.modules[__name__] = module(__name__)
new_module.__dict__.update({
    '__file__':         __file__,
    '__package__':      'nested_admin',
    '__path__':         __path__,
    '__doc__':          __doc__,
    '__version__':      __version__,
    '__all__':          tuple(object_origins) + tuple(attribute_modules),
    '__docformat__':    'restructuredtext en',
})

all_valid_patch_modules = [django.forms.formsets]

# If django.contrib.admin.options has already been imported, we'll need to
# monkeypatch all_valid in that module as well
admin_module = sys.modules.get('django.contrib.admin.options')
if admin_module:
    all_valid_patch_modules.append(admin_module)


def descend_form(form):
    for formset in getattr(form, 'nested_formsets', None) or []:
        for child_formset, child_form in descend_formset(formset):
            yield (child_formset, child_form)


def descend_formset(formset):
    for form in formset:
        yield (formset, form)
        for child_formset, child_form in descend_form(form):
            yield child_formset, child_form


def patch_delete_children_empty_permitted(formsets):
    """Set empty_permitted=True for descendent forms of forms that are to be deleted"""
    for top_level_formset in formsets:
        for formset, form in descend_formset(top_level_formset):
            formset._errors = None
            form._errors = None
            if formset.can_delete and formset._should_delete_form(form):
                for _, child_form in descend_form(form):
                    child_form.empty_permitted = True


@monkeybiz.patch(all_valid_patch_modules)
def all_valid(original_all_valid, formsets):
    """
    Checks validation on formsets, then handles a case where an inline
    has new data but one of its parent forms is blank.

    This causes a bug when one of the parent forms has empty_permitted == True,
    which happens if it is an "extra" form in the formset and its index
    is >= the formset's min_num.

    Also hooks into the original validation to suppress validation errors thrown
    by descendent inlines of deleted forms.
    """
    if not original_all_valid(formsets):
        if len(formsets) and getattr(formsets[0], 'data', None):
            has_delete = any(k for k in formsets[0].data if k.endswith('-DELETE'))
            if has_delete:
                patch_delete_children_empty_permitted(formsets)
                return original_all_valid(formsets)
        return False

    for formset in formsets:
        if formset.has_changed() and getattr(formset, 'parent_form', None):
            parent_form = formset.parent_form

            while True:
                if parent_form.empty_permitted:
                    parent_form.empty_permitted = False
                    # Reset the validation errors
                    parent_form._errors = None
                    if not parent_form.instance.pk and not parent_form.has_changed():
                        # Force Django to try to save the instance,
                        # since we need it for the fk to work
                        changed_data = parent_form.fields.keys()
                        parent_form.__dict__['changed_data'] = changed_data
                if not hasattr(parent_form, 'parent_formset'):
                    break
                parent_form.parent_formset._errors = None
                if not hasattr(parent_form.parent_formset, 'parent_form'):
                    break
                parent_form = parent_form.parent_formset.parent_form

    if not original_all_valid(formsets):
        return False

    return True
