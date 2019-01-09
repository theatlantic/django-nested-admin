import json

from django.conf import settings
from django.contrib.admin import helpers
from django.contrib.contenttypes.admin import GenericInlineModelAdmin
try:
    # Django 1.10
    from django.urls import reverse
except ImportError:
    # Django <= 1.9
    from django.core.urlresolvers import reverse
from django.template.defaultfilters import capfirst
import six
from django.utils.functional import lazy
from six.moves import zip
from django.utils.translation import gettext
from django.contrib.admin.options import ModelAdmin, InlineModelAdmin

from .compat import MergeSafeMedia, compat_rel_to
from .formsets import NestedInlineFormSet, NestedBaseGenericInlineFormSet


__all__ = (
    'NestedModelAdmin', 'NestedModelAdminMixin', 'NestedInlineAdminFormset',
    'NestedInlineModelAdmin', 'NestedStackedInline', 'NestedTabularInline',
    'NestedInlineModelAdminMixin', 'NestedGenericInlineModelAdmin',
    'NestedStackedInlineMixin', 'NestedTabularInlineMixin',
    'NestedGenericStackedInline', 'NestedGenericTabularInline',
    'NestedGenericStackedInlineMixin', 'NestedGenericTabularInlineMixin',
    'NestedGenericInlineModelAdminMixin', 'NestedInlineAdminFormsetMixin')


def get_method_function(fn):
    return fn.im_func if six.PY2 else fn


lazy_reverse = lazy(reverse, str)
server_data_js_url = lazy_reverse('nesting_server_data')


class NestedInlineAdminFormsetMixin(object):

    classes = None

    def __init__(self, inline, *args, **kwargs):
        request = kwargs.pop('request', None)
        obj = kwargs.pop('obj', None)
        super(NestedInlineAdminFormsetMixin, self).__init__(inline, *args, **kwargs)
        self.request = request
        self.obj = obj

        if getattr(inline, 'classes', None):
            self.classes = ' '.join(inline.classes)
        else:
            self.classes = ''

    def __iter__(self):
        for inline_admin_form in super(NestedInlineAdminFormsetMixin, self).__iter__():
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
        media = MergeSafeMedia(self.formset.media) + self.opts.media
        for fs in self:
            media = media + fs.media
            for inline in (getattr(fs.form, 'inlines', None) or []):
                media = media + inline.media

        # Add nested-admin js and css here, to ensure it goes after any widgets
        min_ext = '' if getattr(settings, 'NESTED_ADMIN_DEBUG', False) else '.min'
        return media + MergeSafeMedia(
            js=(
                server_data_js_url,
                'nested_admin/dist/nested_admin%s.js' % min_ext,
            ),
            css={'all': (
                'nested_admin/dist/nested_admin%s.css' % min_ext,
            )})
    media = property(_media)

    @property
    def inline_model_id(self):
        return "-".join([self.opts.opts.app_label, self.opts.opts.model_name])

    def inline_formset_data(self):
        super_cls = super(NestedInlineAdminFormsetMixin, self)

        # Django 1.8 conditional
        if hasattr(super_cls, 'inline_formset_data'):
            data = json.loads(super_cls.inline_formset_data())
        else:
            verbose_name = self.opts.verbose_name
            data = {
                'name': '#%s' % self.formset.prefix,
                'options': {
                    'prefix': self.formset.prefix,
                    'addText': gettext('Add another %(verbose_name)s') % {
                        'verbose_name': capfirst(verbose_name),
                    },
                    'deleteText': gettext('Remove'),
                },
            }

        formset_fk_model = ''
        if getattr(self.formset, 'fk', None):
            formset_fk_opts = compat_rel_to(self.formset.fk)._meta
            formset_fk_model = "%s-%s" % (
                formset_fk_opts.app_label, formset_fk_opts.model_name)

        data.update({
            'nestedOptions': {
                'sortableFieldName': getattr(self.opts, 'sortable_field_name', None),
                'lookupRelated': getattr(self.opts, 'related_lookup_fields', {}),
                'lookupAutocomplete': getattr(self.opts, 'autocomplete_lookup_fields', {}),
                'formsetFkName': self.formset.fk.name if getattr(self.formset, 'fk', None) else '',
                'formsetFkModel': formset_fk_model,
                'nestingLevel': getattr(self.formset, 'nesting_depth', 0),
                'fieldNames': {
                    'position': getattr(self.opts, 'sortable_field_name', None),
                    'pk': self.opts.opts.pk.name,
                },
                'inlineModel': self.inline_model_id,
                'sortableOptions': self.opts.sortable_options,
            },
        })
        return json.dumps(data)

    @property
    def handler_classes(self):
        classes = set(getattr(self.opts, 'handler_classes', None) or [])
        return tuple(classes | {"djn-model-%s" % self.inline_model_id})


class NestedInlineAdminFormset(NestedInlineAdminFormsetMixin, helpers.InlineAdminFormSet):
    pass


class NestedModelAdminMixin(object):

    inline_admin_formset_helper_cls = NestedInlineAdminFormset

    def get_inline_formsets(self, request, formsets, inline_instances,
                            obj=None, allow_nested=False):
        inline_admin_formsets = []
        for inline, formset in zip(inline_instances, formsets):
            if not allow_nested and getattr(formset, 'is_nested', False):
                continue
            fieldsets = list(inline.get_fieldsets(request, obj))
            readonly = list(inline.get_readonly_fields(request, obj))
            prepopulated = dict(inline.get_prepopulated_fields(request, obj))
            inline_admin_formset = self.inline_admin_formset_helper_cls(
                inline, formset, fieldsets, prepopulated, readonly,
                model_admin=self, request=request)
            inline_admin_formset.request = request
            inline_admin_formset.obj = obj
            inline_admin_formsets.append(inline_admin_formset)
        return inline_admin_formsets

    def _create_formsets(self, request, obj, change):
        orig_formsets, orig_inline_instances = (
            super(NestedModelAdminMixin, self)._create_formsets(
                request, obj, change))

        formsets = []
        inline_instances = []
        prefixes = {}
        has_polymorphic = False

        for formset, inline_instance in zip(orig_formsets, orig_inline_instances):
            if not hasattr(formset, 'nesting_depth'):
                formset.nesting_depth = 1

            formsets.append(formset)
            inline_instances.append(inline_instance)

            inlines_and_formsets = []
            if hasattr(inline_instance, 'child_inline_instances'):
                has_polymorphic = True
                for child_inline_instance in inline_instance.child_inline_instances:
                    inlines_and_formsets += [
                        (nested_nested, formset)
                        for nested_nested in child_inline_instance.get_inline_instances(request)]

            if getattr(inline_instance, 'inlines', []):
                inlines_and_formsets += [
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

                    if has_polymorphic and form_obj:
                        rel_model = compat_rel_to(InlineFormSet.fk)
                        if not isinstance(form_obj, rel_model):
                            continue

                    prefix = '%s-%s' % (form_prefix, InlineFormSet.get_default_prefix())
                    prefixes[prefix] = prefixes.get(prefix, 0) + 1
                    if prefixes[prefix] != 1:
                        prefix = "%s-%s" % (prefix, prefixes[prefix])

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
                    if hasattr(nested, 'child_inline_instances'):
                        for nested_child in nested.child_inline_instances:
                            inlines_and_formsets += [
                                (nested_nested, nested_formset)
                                for nested_nested in nested_child.get_inline_instances(request)]
        return formsets, inline_instances


class NestedInlineModelAdminMixin(object):

    is_sortable = True
    sortable_field_name = None

    formset = NestedInlineFormSet

    inlines = []

    if 'suit' in settings.INSTALLED_APPS:
        fieldset_template = 'nesting/admin/includes/suit_inline.html'
    elif 'grappelli' in settings.INSTALLED_APPS:
        fieldset_template = 'nesting/admin/includes/grappelli_inline.html'
    else:
        fieldset_template = 'nesting/admin/includes/inline.html'

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

    def get_formset(self, request, obj=None, **kwargs):
        FormSet = BaseFormSet = kwargs.pop('formset', self.formset)

        if self.sortable_field_name:
            class FormSet(BaseFormSet):
                sortable_field_name = self.sortable_field_name

        kwargs['formset'] = FormSet
        return super(NestedInlineModelAdminMixin, self).get_formset(request, obj, **kwargs)


class NestedModelAdmin(NestedModelAdminMixin, ModelAdmin):
    pass


class NestedInlineModelAdmin(NestedInlineModelAdminMixin, InlineModelAdmin):
    pass


class NestedStackedInlineMixin(NestedInlineModelAdminMixin):

    if 'grappelli' in settings.INSTALLED_APPS:
        template = 'nesting/admin/inlines/grappelli_stacked.html'
    else:
        template = 'nesting/admin/inlines/stacked.html'


class NestedStackedInline(NestedStackedInlineMixin, InlineModelAdmin):
    pass


class NestedTabularInlineMixin(NestedInlineModelAdminMixin):

    if 'grappelli' in settings.INSTALLED_APPS:
        template = 'nesting/admin/inlines/grappelli_tabular.html'
        fieldset_template = 'nesting/admin/includes/grappelli_inline_tabular.html'
    else:
        template = 'nesting/admin/inlines/tabular.html'


class NestedTabularInline(NestedTabularInlineMixin, InlineModelAdmin):
    pass


class NestedGenericInlineModelAdminMixin(NestedInlineModelAdminMixin):

    formset = NestedBaseGenericInlineFormSet


class NestedGenericInlineModelAdmin(NestedGenericInlineModelAdminMixin, GenericInlineModelAdmin):
    pass


class NestedGenericStackedInlineMixin(NestedGenericInlineModelAdminMixin):

    if 'grappelli' in settings.INSTALLED_APPS:
        template = 'nesting/admin/inlines/grappelli_stacked.html'
    else:
        template = 'nesting/admin/inlines/stacked.html'


class NestedGenericStackedInline(NestedGenericStackedInlineMixin, GenericInlineModelAdmin):
    pass


class NestedGenericTabularInlineMixin(NestedGenericInlineModelAdminMixin):

    if 'grappelli' in settings.INSTALLED_APPS:
        template = 'nesting/admin/inlines/grappelli_tabular.html'
        fieldset_template = 'nesting/admin/includes/grappelli_inline_tabular.html'
    else:
        template = 'nesting/admin/inlines/tabular.html'


class NestedGenericTabularInline(NestedGenericTabularInlineMixin, GenericInlineModelAdmin):
    pass
