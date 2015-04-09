"""
This file duplicates the functionality of django.contrib.admin.options exactly.
The only code differences are due to refactoring, to make extending the
ModelAdmin add_view and change_view easier. Any functional differences from
that module should be considered a bug.
"""
from six.moves import zip

from django.forms.formsets import all_valid
from django.contrib.contenttypes.models import ContentType
from django.contrib.admin import helpers
from django.contrib.admin.util import unquote

try:
    # Django 1.6
    from django.contrib.admin.templatetags.admin_urls import add_preserved_filters
except ImportError:
    add_preserved_filters = None

from django.core.urlresolvers import reverse
from django.core.exceptions import PermissionDenied
from django.db import models, transaction
from django.http import Http404
from django.utils.html import escape
from django.utils.safestring import mark_safe
from django.utils.translation import ugettext as _

try:
    # Django 1.6
    from django.utils.encoding import force_text as force_unicode
except ImportError:
    # Django <= 1.5
    from django.utils.encoding import force_unicode

from django.contrib.admin.options import (
    csrf_protect_m,
    BaseModelAdmin as _BaseModelAdmin,
    ModelAdmin as _ModelAdmin,
    InlineModelAdmin as _InlineModelAdmin)

try:
    from django.template.response import TemplateResponse
except ImportError:
    TemplateResponse = None

from .formsets import NestedInlineFormSet  # Used for the export


transaction_wrap = getattr(transaction, 'atomic', None)
if not transaction_wrap:
    transaction_wrap = transaction.commit_on_success


IS_POPUP_VAR = '_popup'


class BaseModelAdminMixin(object):

    def inline_has_permissions(self, request, inline):
        has_add_perms = has_change_perms = has_delete_perms = True
        if hasattr(inline, 'has_add_permission'):
            has_add_perms = inline.has_add_permission(request)
        if hasattr(inline, 'has_change_permission'):
            has_change_perms = inline.has_change_permission(request)
        if hasattr(inline, 'has_delete_permission'):
            has_delete_perms = inline.has_delete_permission(request)
        has_perms = has_add_perms or has_change_perms or has_delete_perms
        if has_perms and not has_add_perms:
            inline.max_num = 0
        return has_perms

    def get_inline_instances(self, request, obj=None):
        for inline_class in getattr(self, 'inlines', []):
            inline = inline_class(self.model, self.admin_site)
            if request:
                if not self.inline_has_permissions(request, inline):
                    continue
            yield inline


class BaseModelAdmin(BaseModelAdminMixin, _BaseModelAdmin):
    pass


class ModelAdmin(BaseModelAdminMixin, _ModelAdmin):
    "Encapsulates all admin options and functionality for a given model."

    def __init__(self, model, admin_site):
        self.model = model
        self.opts = model._meta
        self.admin_site = admin_site
        self.inline_instances = []
        for inline_class in self.inlines:
            inline_instance = inline_class(self.model, self.admin_site)
            self.inline_instances.append(inline_instance)
        super(_ModelAdmin, self).__init__()

    def render_change_form(self, request, context, add=False, change=False, form_url='', obj=None):
        """Use the content type from the proxy model."""
        templateresp = super(ModelAdmin, self).render_change_form(request, context, add=add, change=change, form_url=form_url, obj=obj)
        try:
            content_type_id = ContentType.objects.get_for_model(self.model, False).id
        except TypeError:
            pass
        else:
            templateresp.context_data['content_type_id'] = content_type_id
        return templateresp

    def get_formsets(self, request, obj=None, **kwargs):
        for inline in self.get_inline_instances(request, obj):
            yield inline.get_formset(request, obj, **kwargs)

    def get_main_view_form(self, request, instance=None, form_cls=None):
        if form_cls is not None:
            ModelForm = form_cls
        elif instance is not None:
            ModelForm = self.get_form(request, instance)
        else:
            ModelForm = self.get_form(request)

        if request.method == 'POST':
            form_kwargs = {}
            if instance is not None:
                form_kwargs['instance'] = instance
            return ModelForm(request.POST, request.FILES, **form_kwargs)
        elif instance is not None:
            return ModelForm(instance=instance)
        else:
            opts = self.model._meta
            # Prepare the dict of initial data from the request.
            # We have to special-case M2Ms as a list of comma-separated PKs.
            initial = dict(request.GET.items())
            for k in initial:
                try:
                    f = opts.get_field(k)
                except models.FieldDoesNotExist:
                    continue
                if isinstance(f, models.ManyToManyField):
                    initial[k] = initial[k].split(",")
            return ModelForm(initial=initial)

    def get_formset_instances(self, request, instance, is_new=False, **kwargs):
        prefixes = {}
        obj = None
        if not is_new:
            obj = instance

        formset_kwargs = {}
        if request.method == 'POST':
            formset_kwargs.update({
                'data': request.POST,
                'files': request.FILES,
            })
            if is_new:
                formset_kwargs.update({
                    'save_as_new': '_saveasnew' in request.POST
                })

        for FormSet, inline in zip(self.get_formsets(request, obj, **kwargs), self.get_inline_instances(request, obj)):
            prefix = FormSet.get_default_prefix()
            prefixes[prefix] = prefixes.get(prefix, 0) + 1
            if prefixes[prefix] != 1:
                prefix = "%s-%s" % (prefix, prefixes[prefix])

            if hasattr(inline, 'get_queryset'):
                # Django 1.6
                queryset = inline.get_queryset(request)
            else:
                queryset = inline.queryset(request)

            formset = FormSet(instance=instance, prefix=prefix,
                              queryset=queryset,
                              **formset_kwargs)
            yield formset

    def save_view_formsets(self, request, instance, form, formsets, is_new=False):
        change = not is_new
        self.save_model(request, instance, form, change=change)
        if hasattr(self, 'save_related'):
            # Django 1.6
            self.save_related(request, form, formsets, change=change)
        else:
            # Django <= 1.5
            form.save_m2m()
            for formset in formsets:
                self.save_formset(request, form, formset, change=change)
        if is_new:
            self.log_addition(request, instance)
        else:
            change_message = self.construct_change_message(request, form, formsets)
            self.log_change(request, instance, change_message)

    def get_inline_admin_formsets(self, request, formsets, obj=None):
        for inline, formset in zip(self.get_inline_instances(request, obj), formsets):
            fieldsets = list(inline.get_fieldsets(request, obj))
            readonly = list(inline.get_readonly_fields(request, obj))
            inline_admin_formset = helpers.InlineAdminFormSet(inline, formset,
                fieldsets, readonly_fields=readonly, model_admin=self)
            yield inline_admin_formset

    @csrf_protect_m
    @transaction_wrap
    def add_view(self, request, form_url='', extra_context=None):
        "The 'add' admin view for this model."
        model = self.model
        opts = model._meta

        if not self.has_add_permission(request):
            raise PermissionDenied

        formsets = []
        form = self.get_main_view_form(request)
        if request.method == 'POST':
            if form.is_valid():
                new_object = self.save_form(request, form, change=False)
                form_validated = True
            else:
                form_validated = False
                new_object = self.model()
        else:
            new_object = self.model()

        for formset in self.get_formset_instances(request, new_object, is_new=True):
            formsets.append(formset)

        if request.method == 'POST' and all_valid(formsets) and form_validated:
            self.save_view_formsets(request, new_object, form, formsets, is_new=True)
            return self.response_add(request, new_object)

        if hasattr(self, 'get_prepopulated_fields'):
            # Django 1.4
            prepopulated_fields = self.get_prepopulated_fields(request)
        else:
            prepopulated_fields = self.prepopulated_fields

        adminForm = helpers.AdminForm(form, self.get_fieldsets(request),
            prepopulated_fields, self.get_readonly_fields(request),
            model_admin=self)
        media = self.media + adminForm.media

        inline_admin_formsets = []
        for inline_admin_formset in self.get_inline_admin_formsets(request, formsets):
            inline_admin_formsets.append(inline_admin_formset)
            media = media + inline_admin_formset.media
            for nested in getattr(inline_admin_formset, 'inlines', []):
                media += nested.media

        context = {
            'title': _('Add %s') % force_unicode(opts.verbose_name),
            'adminform': adminForm,
            'is_popup': (IS_POPUP_VAR in request.POST or
                         IS_POPUP_VAR in request.GET),
            'show_delete': False,
            'media': mark_safe(media),
            'inline_admin_formsets': inline_admin_formsets,
            'errors': helpers.AdminErrorList(form, formsets),
            'root_path': reverse('admin:index'),
            'app_label': opts.app_label,
        }
        if hasattr(self, 'get_preserved_filters'):
            # Django 1.6
            context['preserved_filters'] = self.get_preserved_filters(request)
        context.update(extra_context or {})
        return self.render_change_form(request, context, form_url=form_url, add=True)

    @csrf_protect_m
    @transaction_wrap
    def change_view(self, request, object_id, form_url='', extra_context=None):
        "The 'change' admin view for this model."
        model = self.model
        opts = model._meta

        obj = self.get_object(request, unquote(object_id))

        if not self.has_change_permission(request, obj):
            raise PermissionDenied

        if obj is None:
            raise Http404(_('%(name)s object with primary key %(key)r does not exist.') \
                % {'name': force_unicode(opts.verbose_name), 'key': escape(object_id)})

        if request.method == 'POST' and '_saveasnew' in request.POST:
            return self.add_view(request, form_url='../add/')

        formsets = []
        form = self.get_main_view_form(request, obj)
        if request.method == 'POST':
            if form.is_valid():
                form_validated = True
                instance = self.save_form(request, form, change=True)
            else:
                form_validated = False
                instance = obj
        else:
            instance = obj

        for formset in self.get_formset_instances(request, instance, is_new=False):
            formsets.append(formset)

        if request.method == 'POST' and all_valid(formsets) and form_validated:
            self.save_view_formsets(request, instance, form, formsets, is_new=False)
            return self.response_change(request, instance)

        if hasattr(self, 'get_prepopulated_field'):
            # Django 1.4
            prepopulated_fields = self.get_prepopulated_field(request)
        else:
            prepopulated_fields = self.prepopulated_fields

        adminForm = helpers.AdminForm(form, self.get_fieldsets(request, obj),
            prepopulated_fields, self.get_readonly_fields(request, obj),
            model_admin=self)
        media = self.media + adminForm.media

        inline_admin_formsets = []
        for inline_admin_formset in self.get_inline_admin_formsets(request, formsets, obj):
            inline_admin_formsets.append(inline_admin_formset)
            media = media + inline_admin_formset.media
            for nested in getattr(inline_admin_formset, 'inlines', []):
                media += nested.media

        context = {
            'title': _('Change %s') % force_unicode(opts.verbose_name),
            'adminform': adminForm,
            'object_id': object_id,
            'original': obj,
            'is_popup': (IS_POPUP_VAR in request.POST or
                         IS_POPUP_VAR in request.GET),
            'media': mark_safe(media),
            'inline_admin_formsets': inline_admin_formsets,
            'errors': helpers.AdminErrorList(form, formsets),
            'root_path': reverse('admin:index'),
            'app_label': opts.app_label,
        }
        if hasattr(self, 'get_preserved_filters'):
            # Django 1.6
            context['preserved_filters'] = self.get_preserved_filters(request)
        context.update(extra_context or {})
        return self.render_change_form(request, context, change=True, obj=obj, form_url=form_url)


class InlineModelAdmin(BaseModelAdminMixin, _InlineModelAdmin):
    pass


class StackedInline(InlineModelAdmin):
    """
    The standard StackedInline. If using NestedAdmin, use
    nesting.nested_admin.NestedStackedInline.
    """

    template = 'admin/edit_inline/stacked.html'


class TabularInline(InlineModelAdmin):

    template = 'admin/edit_inline/tabular.html'


try:
    from generic_plus.patch import patch_model_admin
except ImportError:
    pass
else:
    patch_model_admin(
        ModelAdmin=ModelAdmin,
        InlineModelAdmin=InlineModelAdmin,
        BaseModelAdmin=BaseModelAdmin)
