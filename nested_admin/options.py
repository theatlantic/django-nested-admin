"""
This file duplicates the functionality of django.contrib.admin.options exactly.
The only code differences are due to refactoring, to make extending the
ModelAdmin add_view and change_view easier. Any functional differences from
that module should be considered a bug.
"""
import sys

import inspect
from itertools import izip

from django import forms, template
from django.forms.formsets import all_valid
from django.forms.models import inlineformset_factory
from django.forms.models import BaseInlineFormSet
from django.contrib.contenttypes.models import ContentType
from django.contrib.admin import helpers
from django.contrib.admin.util import (unquote, flatten_fieldsets,
    get_deleted_objects as _get_deleted_objects)
from django.core.urlresolvers import reverse
from django.core.exceptions import PermissionDenied
from django.db import models, transaction, router
from django.db.models.fields import FieldDoesNotExist
from django.http import Http404, HttpResponseRedirect
from django.shortcuts import get_object_or_404, render_to_response
from django.utils.html import escape
from django.utils.safestring import mark_safe
from django.utils.functional import curry
from django.utils.text import capfirst
from django.utils.translation import ugettext as _
from django.utils.translation import ungettext, ugettext_lazy
from django.utils.encoding import force_unicode

from django.contrib.admin.options import csrf_protect_m, IncorrectLookupParameters, \
    BaseModelAdmin as _BaseModelAdmin, ModelAdmin as _ModelAdmin, \
    InlineModelAdmin as _InlineModelAdmin

try:
    from django.template.response import TemplateResponse
except ImportError:
    TemplateResponse = None

from .formsets import NestedInlineFormSet


def get_deleted_objects(objs, opts, user, admin_site, using):
    """
    Compatibility function for django.contrib.admin.util.get_deleted_objects()
    between Django <= 1.3 and Django >= 1.4
    """
    get_deleted_objects_args = inspect.getargspec(_get_deleted_objects)[0]
    kwargs = {}
    if 'using' in get_deleted_objects_args:
        kwargs['using'] = using
    protected = []
    return (_get_deleted_objects(objs, opts, user, admin_site, **kwargs)
            + (protected,))[0:3]


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
        if 'action_checkbox' not in self.list_display and self.actions is not None:
            self.list_display = ['action_checkbox'] +  list(self.list_display)
        if not self.list_display_links:
            for name in self.list_display:
                if name != 'action_checkbox':
                    self.list_display_links = [name]
                    break
        super(_ModelAdmin, self).__init__()

    def get_formsets(self, request, obj=None, **kwargs):
        for inline in self.get_inline_instances(request, obj):
            yield inline.get_formset(request, obj, **kwargs)

    def save_form(self, request, form, change):
        """
        Given a ModelForm return an unsaved instance. ``change`` is True if
        the object is being changed, and False if it's being added.
        """
        return form.save(commit=False)

    def save_model(self, request, obj, form, change):
        """
        Given a model instance save it to the database.
        """
        obj.save()

    def save_formset(self, request, form, formset, change):
        """
        Given an inline formset save it to the database.
        """
        formset.save()

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
                    'save_as_new': request.POST.has_key('_saveasnew')
                })

        for FormSet, inline in izip(self.get_formsets(request, obj, **kwargs), self.get_inline_instances(request, obj)):
            prefix = FormSet.get_default_prefix()
            prefixes[prefix] = prefixes.get(prefix, 0) + 1
            if prefixes[prefix] != 1:
                prefix = "%s-%s" % (prefix, prefixes[prefix])


            formset = FormSet(instance=instance, prefix=prefix,
                              queryset=inline.queryset(request),
                              **formset_kwargs)
            yield formset

    def save_view_formsets(self, request, instance, form, formsets, is_new=False):
        change = not is_new
        self.save_model(request, instance, form, change=change)
        form.save_m2m()
        for formset in formsets:
            self.save_formset(request, form, formset, change=change)
        if is_new:
            self.log_addition(request, instance)
        else:
            change_message = self.construct_change_message(request, form, formsets)
            self.log_change(request, instance, change_message)

    def get_inline_admin_formsets(self, request, formsets, obj=None):
        for inline, formset in izip(self.get_inline_instances(request, obj), formsets):
            fieldsets = list(inline.get_fieldsets(request, obj))
            readonly = list(inline.get_readonly_fields(request, obj))
            inline_admin_formset = helpers.InlineAdminFormSet(inline, formset,
                fieldsets, readonly_fields=readonly, model_admin=self)
            yield inline_admin_formset

    @csrf_protect_m
    @transaction.commit_on_success
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

        if hasattr(self, 'get_prepopulated_field'):
            # Django 1.4
            prepopulated_fields = self.get_prepopulated_field(request)
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
            'is_popup': request.REQUEST.has_key('_popup'),
            'show_delete': False,
            'media': mark_safe(media),
            'inline_admin_formsets': inline_admin_formsets,
            'errors': helpers.AdminErrorList(form, formsets),
            'root_path': reverse('admin:index'),
            'app_label': opts.app_label,
        }
        context.update(extra_context or {})
        return self.render_change_form(request, context, form_url=form_url, add=True)

    @csrf_protect_m
    @transaction.commit_on_success
    def change_view(self, request, object_id, extra_context=None):
        "The 'change' admin view for this model."
        model = self.model
        opts = model._meta

        obj = self.get_object(request, unquote(object_id))

        if not self.has_change_permission(request, obj):
            raise PermissionDenied

        if obj is None:
            raise Http404(_('%(name)s object with primary key %(key)r does not exist.') \
                % {'name': force_unicode(opts.verbose_name), 'key': escape(object_id)})

        if request.method == 'POST' and request.POST.has_key("_saveasnew"):
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
            'is_popup': request.REQUEST.has_key('_popup'),
            'media': mark_safe(media),
            'inline_admin_formsets': inline_admin_formsets,
            'errors': helpers.AdminErrorList(form, formsets),
            'root_path': reverse('admin:index'),
            'app_label': opts.app_label,
        }
        context.update(extra_context or {})
        return self.render_change_form(request, context, change=True, obj=obj)

    @csrf_protect_m
    def changelist_view(self, request, extra_context=None):
        "The 'change list' admin view for this model."
        from django.contrib.admin.views.main import ERROR_FLAG
        opts = self.model._meta
        app_label = opts.app_label
        if not self.has_change_permission(request, None):
            raise PermissionDenied

        # Check actions to see if any are available on this changelist
        actions = self.get_actions(request)

        # Remove action checkboxes if there aren't any actions available.
        list_display = list(self.list_display)
        if not actions:
            try:
                list_display.remove('action_checkbox')
            except ValueError:
                pass
        # Django 1.4 compat
        elif 'action_checkbox' not in list_display:
            # Add the action checkboxes if there are any actions available.
            list_display = ['action_checkbox'] +  list(list_display)

        if hasattr(self, 'get_list_display_links'):
            list_display_links = self.get_list_display_links(request, list_display)
        else:
            list_display_links = self.list_display_links

        ChangeList = self.get_changelist(request)

        cl_args = (
            request, self.model, list_display,
            list_display_links, self.list_filter, self.date_hierarchy,
            self.search_fields, self.list_select_related,
            self.list_per_page, self.list_editable, self,)

        # In Django 1.4 ChangeList takes an additional arg after
        # list_editable, `list_max_show_all`. We use the inspect module
        # to determine the number of arguments for ChangeList.__init__
        # (12 in Django <= 1.3, 13 in Django 1.4), and insert
        # self.list_max_show_all into the penultimate position if it
        # takes 13 args.
        cl_inspect_args = inspect.getargspec(ChangeList.__init__)[0]

        # Django 1.4
        if len(cl_inspect_args) == 13:
            cl_args = cl_args[0:9] + (self.list_max_show_all,) + cl_args[9:]
        try:
            cl = ChangeList(*cl_args)
        except IncorrectLookupParameters:
            # Wacky lookup parameters were given, so redirect to the main
            # changelist page, without parameters, and pass an 'invalid=1'
            # parameter via the query string. If wacky parameters were given
            # and the 'invalid=1' parameter was already in the query string,
            # something is screwed up with the database, so display an error
            # page.
            if ERROR_FLAG in request.GET.keys():
                return render_to_response('admin/invalid_setup.html', {'title': _('Database error')})
            return HttpResponseRedirect(request.path + '?' + ERROR_FLAG + '=1')

        # If the request was POSTed, this might be a bulk action or a bulk
        # edit. Try to look up an action or confirmation first, but if this
        # isn't an action the POST will fall through to the bulk edit check,
        # below.
        action_failed = False
        selected = request.POST.getlist(helpers.ACTION_CHECKBOX_NAME)

        # Actions with no confirmation
        if (actions and request.method == 'POST' and
                'index' in request.POST and '_save' not in request.POST):
            if selected:
                response = self.response_action(request, queryset=cl.get_query_set(request))
                if response:
                    return response
                else:
                    action_failed = True
            else:
                msg = _("Items must be selected in order to perform "
                        "actions on them. No items have been changed.")
                self.message_user(request, msg)
                action_failed = True

        # Actions with confirmation
        if (actions and request.method == 'POST' and
                helpers.ACTION_CHECKBOX_NAME in request.POST and
                'index' not in request.POST and '_save' not in request.POST):
            if selected:
                response = self.response_action(request, queryset=cl.get_query_set(request))
                if response:
                    return response
                else:
                    action_failed = True

        # If we're allowing changelist editing, we need to construct a formset
        # for the changelist given all the fields to be edited. Then we'll
        # use the formset to validate/process POSTed data.
        formset = cl.formset = None

        # Handle POSTed bulk-edit data.
        if (request.method == "POST" and cl.list_editable and
                '_save' in request.POST and not action_failed):
            FormSet = self.get_changelist_formset(request)
            formset = cl.formset = FormSet(request.POST, request.FILES, queryset=cl.result_list)
            if formset.is_valid():
                changecount = 0
                for form in formset.forms:
                    if form.has_changed():
                        obj = self.save_form(request, form, change=True)
                        self.save_model(request, obj, form, change=True)
                        form.save_m2m()
                        change_msg = self.construct_change_message(request, form, None)
                        self.log_change(request, obj, change_msg)
                        changecount += 1

                if changecount:
                    if changecount == 1:
                        name = force_unicode(opts.verbose_name)
                    else:
                        name = force_unicode(opts.verbose_name_plural)
                    msg = ungettext("%(count)s %(name)s was changed successfully.",
                                    "%(count)s %(name)s were changed successfully.",
                                    changecount) % {'count': changecount,
                                                    'name': name,
                                                    'obj': force_unicode(obj)}
                    self.message_user(request, msg)

                return HttpResponseRedirect(request.get_full_path())

        # Handle GET -- construct a formset for display.
        elif cl.list_editable:
            FormSet = self.get_changelist_formset(request)
            formset = cl.formset = FormSet(queryset=cl.result_list)

        # Build the list of media to be used by the formset.
        if formset:
            media = self.media + formset.media
        else:
            media = self.media

        # Build the action form and populate it with available actions.
        if actions:
            action_form = self.action_form(auto_id=None)
            action_form.fields['action'].choices = self.get_action_choices(request)
        else:
            action_form = None

        selection_note_all = ungettext('%(total_count)s selected',
            'All %(total_count)s selected', cl.result_count)

        context = {
            'module_name': force_unicode(opts.verbose_name_plural),
            'selection_note': _('0 of %(cnt)s selected') % {'cnt': len(cl.result_list)},
            'selection_note_all': selection_note_all % {'total_count': cl.result_count},
            'title': cl.title,
            'is_popup': cl.is_popup,
            'cl': cl,
            'media': media,
            'has_add_permission': self.has_add_permission(request),
            'root_path': reverse('admin:index'),
            'app_label': app_label,
            'action_form': action_form,
            'actions_on_top': self.actions_on_top,
            'actions_on_bottom': self.actions_on_bottom,
            'actions_selection_counter': self.actions_selection_counter,
        }
        context.update(extra_context or {})

        change_list_template = self.change_list_template or [
            'admin/%s/%s/change_list.html' % (app_label, opts.object_name.lower()),
            'admin/%s/change_list.html' % app_label,
            'admin/change_list.html'
        ]

        if TemplateResponse:
            return TemplateResponse(request, change_list_template, context, current_app=self.admin_site.name)
        else:
            context_instance = template.RequestContext(request, current_app=self.admin_site.name)
            return render_to_response(change_list_template, context, context_instance=context_instance)

    @csrf_protect_m
    def delete_view(self, request, object_id, extra_context=None):
        "The 'delete' admin view for this model."
        opts = self.model._meta
        app_label = opts.app_label

        obj = self.get_object(request, unquote(object_id))

        if not self.has_delete_permission(request, obj):
            raise PermissionDenied

        if obj is None:
            raise Http404(_('%(name)s object with primary key %(key)r does not exist.') \
                % {'name': force_unicode(opts.verbose_name), 'key': escape(object_id)})

        using = router.db_for_write(self.model)

        # Populate deleted_objects, a data structure of all related objects that
        # will also be deleted.
        (deleted_objects, perms_needed, protected) = get_deleted_objects(
            [obj,], opts, request.user, self.admin_site, using=using)

        if request.POST: # The user has already confirmed the deletion.
            if perms_needed or protected:
                raise PermissionDenied
            obj_display = force_unicode(obj)
            self.log_deletion(request, obj, obj_display)
            obj.delete()

            self.message_user(request, _('The %(name)s "%(obj)s" was deleted successfully.') \
                % {'name': force_unicode(opts.verbose_name), 'obj': force_unicode(obj_display)})

            if not self.has_change_permission(request, None):
                return HttpResponseRedirect("../../../../")
            return HttpResponseRedirect("../../")

        context = {
            "title": _("Are you sure?"),
            "object_name": force_unicode(opts.verbose_name),
            "object": obj,
            "deleted_objects": deleted_objects,
            "perms_lacking": perms_needed,
            "opts": opts,
            "root_path": reverse('admin:index'),
            "app_label": app_label,
        }
        context.update(extra_context or {})
        context_instance = template.RequestContext(request, current_app=self.admin_site.name)
        return render_to_response(self.delete_confirmation_template or [
            "admin/%s/%s/delete_confirmation.html" % (app_label, opts.object_name.lower()),
            "admin/%s/delete_confirmation.html" % app_label,
            "admin/delete_confirmation.html"
        ], context, context_instance=context_instance)

    def history_view(self, request, object_id, extra_context=None):
        "The 'history' admin view for this model."
        from django.contrib.admin.models import LogEntry
        model = self.model
        opts = model._meta
        app_label = opts.app_label
        action_list = LogEntry.objects.filter(
            object_id = object_id,
            content_type__id__exact = ContentType.objects.get_for_model(model).id
        ).select_related().order_by('-action_time')
        # If no history was found, see whether this object even exists.
        obj = get_object_or_404(model, pk=unquote(object_id))
        context = {
            'title': _('Change history: %s') % force_unicode(obj),
            'action_list': action_list,
            'module_name': capfirst(force_unicode(opts.verbose_name_plural)),
            'object': obj,
            'root_path': reverse('admin:index'),
            'app_label': app_label,
            'opts': opts,
        }
        context.update(extra_context or {})
        context_instance = template.RequestContext(request, current_app=self.admin_site.name)
        return render_to_response(self.object_history_template or [
            "admin/%s/%s/object_history.html" % (app_label, opts.object_name.lower()),
            "admin/%s/object_history.html" % app_label,
            "custom_admin/object_history.html",
            "admin/object_history.html"
        ], context, context_instance=context_instance)


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
