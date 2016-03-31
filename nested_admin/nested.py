from django.conf import settings
from django.contrib.admin import helpers
from django.contrib.contenttypes.admin import GenericInlineModelAdmin
from django.contrib.staticfiles.storage import staticfiles_storage
from django.core.urlresolvers import reverse
from django import forms
from django.utils import six
from django.utils.six.moves import zip

from .formsets import NestedInlineFormSet, NestedBaseGenericInlineFormSet
from django.contrib.admin.options import ModelAdmin, InlineModelAdmin


__all__ = (
    'NestedModelAdmin', 'NestedInlineAdminFormset', 'NestedInlineModelAdmin',
    'NestedStackedInline', 'NestedTabularInline',
    'NestedInlineModelAdminMixin', 'NestedGenericInlineModelAdmin',
    'NestedGenericStackedInline', 'NestedGenericTabularInline')


def get_method_function(fn):
    return fn.im_func if six.PY2 else fn


class NestedInlineAdminFormset(helpers.InlineAdminFormSet):

    classes = None

    def __init__(self, inline, *args, **kwargs):
        self.request = kwargs.pop('request', None)
        super(NestedInlineAdminFormset, self).__init__(inline, *args, **kwargs)

        if getattr(inline, 'classes', None):
            self.classes = ' '.join(inline.classes)
        else:
            self.classes = ''

    def __iter__(self):
        for inline_admin_form in super(NestedInlineAdminFormset, self).__iter__():
            if not getattr(inline_admin_form.form, 'inlines', None):
                form = inline_admin_form.form
                obj = form.instance if form.instance.pk else None
                formsets, inlines = [], []
                obj_with_nesting_data = form
                if form.prefix.endswith('__prefix__'):
                    obj_with_nesting_data = self.formset
                formsets = getattr(obj_with_nesting_data, 'nested_formsets', None) or []
                inlines = getattr(obj_with_nesting_data, 'nested_inlines', None) or []
                form.inlines = self.model_admin.get_inline_formsets(self.request, formsets, inlines,
                    obj=obj, allow_nested=True)
            for nested_inline in inline_admin_form.form.inlines:
                for nested_form in nested_inline:
                    inline_admin_form.prepopulated_fields += nested_form.prepopulated_fields
            yield inline_admin_form

    def _media(self):
        media = self.opts.media + self.formset.media
        for fs in self:
            media = media + fs.media
            for inline in (getattr(fs.form, 'inlines', None) or []):
                media = media + inline.media
        return media
    media = property(_media)


class NestedModelAdmin(ModelAdmin):

    @property
    def media(self):
        media = getattr(super(NestedModelAdmin, self), 'media', forms.Media())

        static_url = staticfiles_storage.url

        server_data_js = reverse('nesting_server_data')

        min_ext = '' if getattr(settings, 'NESTED_ADMIN_DEBUG', False) else '.min'
        return media + forms.Media(
            js=(
                server_data_js,
                static_url('nested_admin/dist/nested_admin%s.js' % min_ext),
            ),
            css={'all': (
                static_url('nested_admin/dist/nested_admin%s.css' % min_ext),
            )})

    def get_inline_formsets(self, request, formsets, inline_instances,
                            obj=None, allow_nested=False):
        inline_admin_formsets = []
        for inline, formset in zip(inline_instances, formsets):
            if not allow_nested and getattr(formset, 'is_nested', False):
                continue
            fieldsets = list(inline.get_fieldsets(request, obj))
            readonly = list(inline.get_readonly_fields(request, obj))
            prepopulated = dict(inline.get_prepopulated_fields(request, obj))
            inline_admin_formset = NestedInlineAdminFormset(inline, formset,
                fieldsets, prepopulated, readonly, model_admin=self,
                request=request)
            inline_admin_formsets.append(inline_admin_formset)
        return inline_admin_formsets

    def _create_formsets(self, request, obj, change):
        orig_formsets, orig_inline_instances = (
            super(NestedModelAdmin, self)._create_formsets(
                request, obj, change))

        formsets = []
        inline_instances = []

        for formset, inline_instance in zip(orig_formsets, orig_inline_instances):
            if not hasattr(formset, 'nesting_depth'):
                formset.nesting_depth = 1

            formsets.append(formset)
            inline_instances.append(inline_instance)

            if getattr(inline_instance, 'inlines', []):
                inlines_and_formsets = [
                    (nested, formset)
                    for nested in inline_instance.get_inline_instances(request)]
                i = 0
                while i < len(inlines_and_formsets):
                    nested, formset = inlines_and_formsets[i]
                    i += 1
                    formset_forms = list(formset.forms) + [None]
                    for form in formset_forms:
                        if form is not None:
                            form.parent_formset = formset
                            form_prefix = form.prefix
                            form_obj = form.instance
                        else:
                            form_prefix = formset.add_prefix('empty')
                            form_obj = None
                        InlineFormSet = nested.get_formset(request, form_obj)
                        prefix = '%s-%s' % (form_prefix, InlineFormSet.get_default_prefix())

                        formset_params = {
                            'instance': form_obj,
                            'prefix': prefix,
                            'queryset': nested.get_queryset(request),
                        }
                        if request.method == 'POST':
                            formset_params.update({
                                'data': request.POST,
                                'files': request.FILES,
                                'save_as_new': '_saveasnew' in request.POST
                            })

                        nested_formset = InlineFormSet(**formset_params)
                        # We set `is_nested` to True so that we have a way
                        # to identify this formset as such and skip it if
                        # there is an error in the POST and we have to create
                        # inline admin formsets.
                        nested_formset.is_nested = True
                        nested_formset.nesting_depth = formset.nesting_depth + 1
                        nested_formset.parent_form = form

                        if form is None:
                            obj = formset
                        else:
                            obj = form
                            if request.method == 'POST':
                                formsets.append(nested_formset)
                                inline_instances.append(nested)
                        obj.nested_formsets = getattr(obj, 'nested_formsets', None) or []
                        obj.nested_inlines = getattr(obj, 'nested_inlines', None) or []
                        obj.nested_formsets.append(nested_formset)
                        obj.nested_inlines.append(nested)

                        if hasattr(nested, 'get_inline_instances'):
                            inlines_and_formsets += [
                                (nested_nested, nested_formset)
                                for nested_nested in nested.get_inline_instances(request)]
        return formsets, inline_instances


class NestedInlineModelAdminMixin(object):

    is_sortable = True

    formset = NestedInlineFormSet

    inlines = []

    def __init__(self, *args, **kwargs):
        sortable_options = {
            'disabled': not(self.is_sortable),
        }
        if hasattr(self, 'sortable_excludes'):
            sortable_options['sortableExcludes'] = self.sortable_excludes
        if hasattr(self, 'sortable_options'):
            sortable_options.update(self.sortable_options)
        self.sortable_options = sortable_options
        super(NestedInlineModelAdminMixin, self).__init__(*args, **kwargs)

    # Copy methods from ModelAdmin
    get_inline_instances = get_method_function(ModelAdmin.get_inline_instances)

    get_formsets_with_inlines = get_method_function(ModelAdmin.get_formsets_with_inlines)

    if hasattr(ModelAdmin, 'get_formsets'):
        get_formsets = get_method_function(ModelAdmin.get_formsets)

    if hasattr(ModelAdmin, '_get_formsets'):
        _get_formsets = get_method_function(ModelAdmin._get_formsets)


class NestedInlineModelAdmin(NestedInlineModelAdminMixin, InlineModelAdmin):
    pass


class NestedStackedInline(NestedInlineModelAdmin):

    template = 'nesting/admin/inlines/stacked.html'


class NestedTabularInline(NestedInlineModelAdmin):

    template = 'nesting/admin/inlines/tabular.html'


class NestedGenericInlineModelAdmin(NestedInlineModelAdminMixin, GenericInlineModelAdmin):

    formset = NestedBaseGenericInlineFormSet


class NestedGenericStackedInline(NestedGenericInlineModelAdmin):

    template = 'nesting/admin/inlines/stacked.html'


class NestedGenericTabularInline(NestedGenericInlineModelAdmin):

    template = 'nesting/admin/inlines/tabular.html'
