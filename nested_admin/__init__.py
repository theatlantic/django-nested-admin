"""
All this craziness is so that we can allow the classes in nested_admin.formsets
to be importable directly from this module, e.g.:

    from nested_admin import NestedInlineFormSet

without running afoul of the strict import order required by Django 1.9+.
This implementation is shamelessly stolen from werkzeug's ``__init__.py``.
"""
import pkg_resources
import sys
from types import ModuleType
import warnings

from .exceptions import NestedAdminPendingDeprecationWarning

try:
    __version__ = pkg_resources.get_distribution('django-nested-admin').version
except pkg_resources.DistributionNotFound:
    __version__ = None

# import mapping to objects in other modules
all_by_module = {
    'nested_admin.formsets': (
        'NestedInlineFormSet', 'GenericNestedInlineFormSet'),
    'nested_admin.options': (
        'ModelAdmin', 'InlineModelAdmin', 'StackedInline', 'TabularInline'),
    'nested_admin.nested': (
        'NestedModelAdmin', 'NestedInlineModelAdmin', 'NestedStackedInline', 'NestedTabularInline'),
}

# modules that should be imported when accessed as attributes of nested_admin
attribute_modules = frozenset(['formsets', 'options', 'nested'])

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
        if name == 'NestedAdmin':
            warnings.warn(
                "NestedAdmin has been changed to NestedModelAdmin",
                NestedAdminPendingDeprecationWarning, stacklevel=2)
            name = 'NestedModelAdmin'
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
    'NestedAdminPendingDeprecationWarning': NestedAdminPendingDeprecationWarning,
})
