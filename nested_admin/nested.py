import json

import django
from django.conf import settings
from django.contrib.admin import helpers
from django.contrib.admin.utils import flatten_fieldsets
from django.contrib.contenttypes.admin import GenericInlineModelAdmin
from django.urls import reverse
from django.template.defaultfilters import capfirst
import six
from django.utils.functional import lazy
from six.moves import zip
from django.utils.translation import gettext
from django.contrib.admin.options import ModelAdmin, InlineModelAdmin

from .compat import MergeSafeMedia
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


def get_model_id(model_cls):
    opts = model_cls._meta
    return "%s-%s" % (opts.app_label, opts.model_name)


lazy_reverse = lazy(reverse, str)
server_data_js_url = lazy_reverse('nesting_server_data')


class NestedInlineAdminFormsetMixin(object):

    classes = None

    def __init__(self, inline, *args, **kwargs):
        request = kwargs.pop('request', None)
        obj = kwargs.pop('obj', None)

        self.has_add_permission = kwargs.pop('has_add_permission', True)
        self.has_change_permission = kwargs.pop('has_change_permission', True)
        self.has_delete_permission = kwargs.pop('has_delete_permission', True)
        self.has_view_permission = kwargs.pop('has_view_permission', True)

        if django.VERSION > (2, 1):
            kwargs.update({
                'has_add_permission': self.has_add_permission,
                'has_change_permission': self.has_change_permission,
                'has_delete_permission': self.has_delete_permission,
                'has_view_permission': self.has_view_permission,
            })

        super(NestedInlineAdminFormsetMixin, self).__init__(inline, *args, **kwargs)
        self.request = request
        self.obj = obj

        if getattr(inline, 'classes', None):
            self.classes = ' '.join(inline.classes)
        else:
            self.classes = ''

    def _set_inline_admin_form_nested_attrs(self, inline_admin_form):
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

    def __iter__(self):
        for inline_admin_form in super(NestedInlineAdminFormsetMixin, self).__iter__():
            self._set_inline_admin_form_nested_attrs(inline_admin_form)
            yield inline_admin_form

    @property
    def media(self):
        media = self.opts.media
        if not isinstance(media, MergeSafeMedia):
            media = MergeSafeMedia(media)
        media = media + self.formset.media
        for fs in self:
            media = media + fs.media
            for inline in (getattr(fs.form, 'inlines', None) or []):
                media = media + inline.media

        min_ext = '' if getattr(settings, 'NESTED_ADMIN_DEBUG', False) else '.min'

        js_file = 'nested_admin/dist/nested_admin%s.js' % min_ext

        enable_server_data_js = 'grappelli' in settings.INSTALLED_APPS

        media += MergeSafeMedia(
            js=([server_data_js_url] if enable_server_data_js else []),
            css={'all': (
                'nested_admin/dist/nested_admin%s.css' % min_ext,
            )})

        media_js = media._js
        if js_file not in media_js:
            media_js += [js_file]
        return MergeSafeMedia(js=media_js, css=media._css)

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
            formset_fk_opts = self.formset.fk.remote_field.model._meta
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
        if hasattr(self.opts, 'parent_model'):
            data['nestedOptions'].update({
                'inlineParentModel': get_model_id(self.opts.parent_model),
            })
        return json.dumps(data)

    @property
    def handler_classes(self):
        classes = set(getattr(self.opts, 'handler_classes', None) or [])
        return tuple(classes | {"djn-model-%s" % self.inline_model_id})


class NestedBaseInlineAdminFormSet(helpers.InlineAdminFormSet):
    """
    Normalize __iter__ so that it backports has_add_permission functionality
    to older django versions
    """
    if django.VERSION < (2, 1):
        def __iter__(self):
            if self.has_change_permission:
                readonly_fields_for_editing = self.readonly_fields
            else:
                readonly_fields_for_editing = self.readonly_fields + flatten_fieldsets(self.fieldsets)

            for form, original in zip(self.formset.initial_forms, self.formset.get_queryset()):
                view_on_site_url = self.opts.get_view_on_site_url(original)
                yield helpers.InlineAdminForm(
                    self.formset, form, self.fieldsets, self.prepopulated_fields,
                    original, readonly_fields_for_editing, model_admin=self.opts,
                    view_on_site_url=view_on_site_url)
            for form in self.formset.extra_forms:
                yield helpers.InlineAdminForm(
                    self.formset, form, self.fieldsets, self.prepopulated_fields,
                    None, self.readonly_fields, model_admin=self.opts,
                )
            if self.has_add_permission:
                yield helpers.InlineAdminForm(
                    self.formset, self.formset.empty_form,
                    self.fieldsets, self.prepopulated_fields, None,
                    self.readonly_fields, model_admin=self.opts,
                )


class NestedInlineAdminFormset(NestedInlineAdminFormsetMixin, NestedBaseInlineAdminFormSet):
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

            try:
                has_add_permission = inline.has_add_permission(request, obj)
            except TypeError:
                # Django before 2.2 didn't require obj kwarg
                has_add_permission = inline.has_add_permission(request)

            has_change_permission = inline.has_change_permission(request, obj)
            has_delete_permission = inline.has_delete_permission(request, obj)

            if hasattr(inline, 'has_view_permission'):
                has_view_permission = inline.has_view_permission(request, obj)
            else:
                has_view_permission = True

            prepopulated = dict(inline.get_prepopulated_fields(request, obj))
            inline_admin_formset = self.inline_admin_formset_helper_cls(
                inline, formset, fieldsets, prepopulated, readonly,
                model_admin=self,
                request=request,
                has_add_permission=has_add_permission,
                has_change_permission=has_change_permission,
                has_delete_permission=has_delete_permission,
                has_view_permission=has_view_permission)
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

        for orig_formset, orig_inline in zip(orig_formsets, orig_inline_instances):
            if not hasattr(orig_formset, 'nesting_depth'):
                orig_formset.nesting_depth = 1

            formsets.append(orig_formset)
            inline_instances.append(orig_inline)

            nested_formsets_and_inline_instances = []
            if hasattr(orig_inline, 'child_inline_instances'):
                has_polymorphic = True
                for child_inline in orig_inline.child_inline_instances:
                    nested_formsets_and_inline_instances += [
                        (orig_formset, inline)
                        for inline
                        in child_inline.get_inline_instances(request, obj)]

            if getattr(orig_inline, 'inlines', []):
                nested_formsets_and_inline_instances += [
                    (orig_formset, inline)
                    for inline
                    in orig_inline.get_inline_instances(request, obj)]

            i = 0
            while i < len(nested_formsets_and_inline_instances):
                formset, inline = nested_formsets_and_inline_instances[i]
                i += 1
                formset_forms = list(formset.forms) + [None]
                for form in formset_forms:
                    if form is not None:
                        form.parent_formset = formset
                        form_prefix = form.prefix
                        form_obj = form.instance
                        is_empty_form = False
                    else:
                        form_prefix = formset.add_prefix('empty')
                        form_obj = None
                        is_empty_form = True
                    InlineFormSet = inline.get_formset(request, form_obj)

                    prefix = '%s-%s' % (form_prefix, InlineFormSet.get_default_prefix())
                    prefixes[prefix] = prefixes.get(prefix, 0) + 1
                    if prefixes[prefix] != 1:
                        prefix = "%s-%s" % (prefix, prefixes[prefix])

                    if has_polymorphic and form_obj:
                        if hasattr(InlineFormSet, 'fk'):
                            rel_model = InlineFormSet.fk.remote_field.model
                            if not isinstance(form_obj, rel_model):
                                continue
                        if not isinstance(form_obj, inline.parent_model):
                            continue

                    formset_params = {
                        'instance': form_obj,
                        'prefix': prefix,
                        'queryset': inline.get_queryset(request),
                    }
                    if request.method == 'POST' and not is_empty_form:
                        formset_params.update({
                            'data': request.POST.copy(),
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

                    def user_deleted_form(request, obj, formset, index):
                        """Return whether or not the user deleted the form."""
                        return (
                            inline.has_delete_permission(request, obj) and
                            '{}-{}-DELETE'.format(formset.prefix, index) in request.POST
                        )

                    # Bypass validation of each view-only inline form (since the form's
                    # data won't be in request.POST), unless the form was deleted.
                    if not inline.has_change_permission(request, form_obj):
                        if '-empty-' not in nested_formset.prefix:
                            for index, initial_form in enumerate(nested_formset.initial_forms):
                                if user_deleted_form(request, form_obj, nested_formset, index):
                                    continue
                                initial_form._errors = {}
                                initial_form.cleaned_data = initial_form.initial

                    # If request.method == 'POST', this is an attempted save,
                    # so we need to include the nested formsets and inline
                    # instances in the top level lists returned by this method
                    if form is not None and request.method == 'POST':
                        formsets.append(nested_formset)
                        inline_instances.append(inline)

                    # nested_obj is a form or an empty formset
                    nested_obj = form or formset

                    if not hasattr(nested_obj, 'nested_formsets'):
                        nested_obj.nested_formsets = []
                    if not hasattr(nested_obj, 'nested_inlines'):
                        nested_obj.nested_inlines = []

                    nested_obj.nested_formsets.append(nested_formset)
                    nested_obj.nested_inlines.append(inline)

                    if hasattr(inline, 'get_inline_instances'):
                        nested_formsets_and_inline_instances += [
                            (nested_formset, nested_inline)
                            for nested_inline
                            in inline.get_inline_instances(request, form_obj)]
                    if hasattr(inline, 'child_inline_instances'):
                        for nested_child in inline.child_inline_instances:
                            nested_formsets_and_inline_instances += [
                                (nested_formset, nested_inline)
                                for nested_inline
                                in nested_child.get_inline_instances(request, form_obj)]
        return formsets, inline_instances

    def render_change_form(self, request, context, obj=None, *args, **kwargs):
        response = super(NestedModelAdminMixin, self).render_change_form(
            request, context, obj=obj, *args, **kwargs)

        has_editable_inline_admin_formsets = response.context_data.get(
            'has_editable_inline_admin_formsets')

        # We only care about potential condition where has_editable_inline_admin_formsets
        # is set, but it is False (and might be True if permissions are checked on
        # deeply nested inlines)
        if has_editable_inline_admin_formsets is not False:
            return response

        inline_admin_formsets = context['inline_admin_formsets']
        nested_admin_formsets = []

        for inline_admin_formset in inline_admin_formsets:
            for admin_form in inline_admin_formset:
                if hasattr(admin_form.form, 'inlines'):
                    nested_admin_formsets += admin_form.form.inlines

        for inline in nested_admin_formsets:
            if (inline.has_add_permission or inline.has_change_permission
                    or inline.has_delete_permission):
                has_editable_inline_admin_formsets = True
                break

        if has_editable_inline_admin_formsets:
            response.context_data['has_editable_inline_admin_formsets'] = True

        return response


class NestedInlineModelAdminMixin(object):

    is_sortable = True
    sortable_field_name = None

    formset = NestedInlineFormSet

    inlines = []

    if 'grappelli' in settings.INSTALLED_APPS:
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
