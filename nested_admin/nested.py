import six
import sys
import types
import warnings

from django.conf import settings
from django.contrib.admin import helpers
from django.core.urlresolvers import reverse
from django import forms

from .exceptions import NestedAdminPendingDeprecationWarning
from .formsets import NestedInlineFormSet
from .options import ModelAdmin, InlineModelAdmin


__all__ = (
    'NestedModelAdmin', 'NestedModelAdminMixin',
    'NestedInlineAdminFormset', 'NestedInlineFormSet',
    'NestedInlineModelAdmin', 'NestedStackedInline')


class NestedInlineAdminFormset(helpers.InlineAdminFormSet):

    def __init__(self, *args, **kwargs):
        self.submitted_formsets = kwargs.pop('submitted_formsets', None) or {}
        self.request = kwargs.pop('request', None)
        super(NestedInlineAdminFormset, self).__init__(*args, **kwargs)

        for form in self.formset.forms:
            obj = form.instance if form.instance.pk else None
            form.inlines = self._get_nested_inlines(form.prefix, obj=obj)

        # The empty prefix is used by django javascript when it tries
        # to determine the ids to give to the fields of newly created
        # instances in the form.
        self.inlines = self._get_nested_inlines(self.formset.add_prefix('empty'))

    def _get_nested_inlines(self, prefix, obj=None):
        nested_inline_formsets = []
        if not hasattr(self.opts, 'get_inline_instances'):
            return nested_inline_formsets

        for nested_inline in self.opts.get_inline_instances(self.request):
            InlineFormSet = nested_inline.get_formset(self.request, obj)
            nested_prefix = '%s-%s' % (prefix, InlineFormSet.get_default_prefix())
            # Check whether nested inline formsets were already submitted.
            # If so, use the submitted formset instead of the freshly generated
            # one since it will contain error information and non-saved data
            # changes.
            if nested_prefix in self.submitted_formsets:
                nested_formset = self.submitted_formsets[nested_prefix]
            else:
                nested_formset_kwargs = {
                    'instance': obj,
                    'prefix': nested_prefix,
                }
                if self.request.method == 'POST' and not prefix.endswith('-empty'):
                    nested_formset_kwargs.update({
                        'data': self.request.POST,
                        'files': self.request.FILES,
                    })
                nested_formset = InlineFormSet(**nested_formset_kwargs)
                nested_formset.is_nested = True
                nested_formset.is_template = prefix.endswith('-empty')
                nested_formset.is_real_formset = not(prefix.endswith('-empty') or '-empty-' in prefix)
                nested_formset.nesting_depth = 1 + getattr(self.formset, 'nesting_depth', 1)

            nested_inline_formsets.append(
                NestedInlineAdminFormset(
                    inline=nested_inline,
                    formset=nested_formset,
                    fieldsets=nested_inline.get_fieldsets(self.request, obj),
                    model_admin=self.model_admin,
                    request=self.request,
                    submitted_formsets=self.submitted_formsets))

        return nested_inline_formsets


class NestedModelAdminMixin(object):

    def get_formset_instances(self, request, instance, is_new=False, **kwargs):
        obj = None
        if not is_new:
            obj = instance

        formset_kwargs = {}
        if request.method == 'POST':
            formset_kwargs.update({
                'data': request.POST,
                'files': request.FILES, })

            if is_new:
                formset_kwargs.update({
                    'save_as_new': '_saveasnew' in request.POST})

        formset_iterator = super(NestedModelAdminMixin, self).get_formset_instances(
            request, instance, is_new, **kwargs)
        inline_iterator = self.get_inline_instances(request, obj)

        try:
            while True:
                formset = six.next(formset_iterator)
                if not hasattr(formset, 'nesting_depth'):
                    formset.nesting_depth = 1
                inline = six.next(inline_iterator)
                yield formset
                if getattr(inline, 'inlines', []) and request.method == 'POST':
                    inlines_and_formsets = [
                        (nested, formset)
                        for nested in inline.get_inline_instances(request)]
                    i = 0
                    while i < len(inlines_and_formsets):
                        nested, formset = inlines_and_formsets[i]
                        i += 1
                        for form in formset.forms:
                            form.parent_formset = formset
                            formset_kwargs = formset_kwargs or {}
                            InlineFormSet = nested.get_formset(request, form.instance, **kwargs)
                            prefix = '%s-%s' % (form.prefix, InlineFormSet.get_default_prefix())
                            nested_formset = InlineFormSet(instance=form.instance, prefix=prefix,
                                **formset_kwargs)
                            # We set `is_nested` to True so that we have a way
                            # to identify this formset as such and skip it if
                            # there is an error in the POST and we have to create
                            # inline admin formsets.
                            nested_formset.is_nested = True
                            nested_formset.nesting_depth = formset.nesting_depth + 1
                            nested_formset.parent_form = form
                            yield nested_formset

                            if hasattr(nested, 'get_inline_instances'):
                                inlines_and_formsets += [
                                    (nested_nested, nested_formset)
                                    for nested_nested in nested.get_inline_instances(request)]
        except StopIteration:
            raise

    def get_inline_admin_formsets(self, request, formsets, obj=None):
        # The only reason a nested inline admin formset would show up
        # here is if there was an error in the POST.
        # inline_admin_formsets are for display, not data submission,
        # and the way the nested forms are displayed is by setting the
        # 'inlines' attribute on inline_admin_formset.formset.forms items.
        # So we iterate through to find any `is_nested` formsets and save
        # them in dict `orig_nested_formsets`, keyed on the formset prefix,
        # as we'll need to swap out the nested formsets in the
        # InlineAdminFormSet.inlines if we want error messages to appear.
        orig_nested_formsets = {}
        non_nested_formsets = []
        for formset in formsets:
            if getattr(formset, 'is_nested', False):
                orig_nested_formsets[formset.prefix] = formset
            else:
                non_nested_formsets.append(formset)

        inline_admin_formsets = super(NestedModelAdminMixin, self).get_inline_admin_formsets(
            request, non_nested_formsets, obj)

        for f in inline_admin_formsets:
            yield NestedInlineAdminFormset(f.opts, f.formset, f.fieldsets,
                prepopulated_fields=f.prepopulated_fields,
                readonly_fields=f.readonly_fields,
                model_admin=f.model_admin,
                request=request,
                submitted_formsets=orig_nested_formsets)


class NestedModelAdmin(NestedModelAdminMixin, ModelAdmin):

    @property
    def media(self):
        media = getattr(super(NestedModelAdmin, self), 'media', forms.Media())

        server_data_js = reverse('nesting_server_data')
        media.add_js((server_data_js,))

        version = 28

        js_files = (
            'jquery.class.js',
            'nesting.utils.js',
            'jquery.ui.sortable.js',
            'jquery.ui.nestedSortable.js',
            'nesting.sortable.js',
            'nesting.formset.js',
            'nesting.js',)

        for js_file in js_files:
            js_file_url = '%snesting/%s?v=%d' % (settings.STATIC_URL, js_file, version)
            media.add_js((js_file_url,))

        media.add_css({
            'all': (
                '%snesting/nesting.css?v=%d' % (settings.STATIC_URL, version),
            )})
        return media


class NestedInlineModelAdmin(NestedModelAdminMixin, InlineModelAdmin):

    is_sortable = True

    formset = NestedInlineFormSet

    def __init__(self, *args, **kwargs):
        sortable_options = {
            'disabled': not(self.is_sortable),
        }
        if hasattr(self, 'sortable_excludes'):
            sortable_options['sortableExcludes'] = self.sortable_excludes
        if hasattr(self, 'sortable_options'):
            sortable_options.update(self.sortable_options)
        self.sortable_options = sortable_options
        super(NestedInlineModelAdmin, self).__init__(*args, **kwargs)


class NestedStackedInline(NestedInlineModelAdmin):

    template = 'nesting/admin/inlines/stacked.html'


class NestedTabularInline(NestedInlineModelAdmin):

    template = 'nesting/admin/inlines/tabular.html'


# keep a reference to this module so that it's not garbage collected
old_module = sys.modules[__name__]


class module(types.ModuleType):

    def __dir__(self):
        """Just show what we want to show."""
        return list(new_module.__all__ + [
            '__file__', '__doc__', '__all__', '__name__', '__path__',
            '__package__'])

    def __getattr__(self, name):
        if name == 'NestedAdmin':
            warnings.warn(
                "NestedAdmin has been changed to NestedModelAdmin",
                NestedAdminPendingDeprecationWarning, stacklevel=2)
            return self.__dict__['NestedModelAdmin']
        return types.ModuleType.__getattribute__(self, name)


# setup the new module and patch it into the dict of loaded modules
new_module = sys.modules[__name__] = module(__name__)
new_module.__dict__.update(old_module.__dict__.copy())
new_module.__dict__['__all__'] += ('NestedAdmin', )
