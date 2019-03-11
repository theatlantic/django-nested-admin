from __future__ import absolute_import
from django.conf import settings
from django.contrib.admin import ModelAdmin
from polymorphic.formsets import BasePolymorphicInlineFormSet
from polymorphic.formsets import BasePolymorphicModelFormSet
from polymorphic.admin import (
    PolymorphicInlineModelAdmin, PolymorphicInlineAdminFormSet,
    PolymorphicInlineSupportMixin)

from .formsets import NestedInlineFormSetMixin
from .nested import (
    NestedModelAdminMixin,
    NestedInlineModelAdminMixin,  # NestedGenericStackedInlineMixin,
    NestedInlineAdminFormsetMixin)


class NestedBasePolymorphicInlineFormSet(
        NestedInlineFormSetMixin, BasePolymorphicInlineFormSet):
    pass


class NestedPolymorphicInlineAdminFormset(
        NestedInlineAdminFormsetMixin, PolymorphicInlineAdminFormSet):

    def __iter__(self):
        if isinstance(self.formset, BasePolymorphicModelFormSet):
            super_iter = super(NestedPolymorphicInlineAdminFormset, self).__iter__()
        else:
            super_iter = super(PolymorphicInlineAdminFormSet, self).__iter__()

        for inline_admin_form in super_iter:
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


class NestedPolymorphicInlineModelAdmin(
        NestedInlineModelAdminMixin, PolymorphicInlineModelAdmin):

    formset = NestedBasePolymorphicInlineFormSet
    inline_admin_formset_helper_cls = NestedPolymorphicInlineAdminFormset

    class Child(NestedInlineModelAdminMixin, PolymorphicInlineModelAdmin.Child):
        formset = NestedBasePolymorphicInlineFormSet
        inline_admin_formset_helper_cls = NestedPolymorphicInlineAdminFormset


class NestedStackedPolymorphicInline(NestedPolymorphicInlineModelAdmin):
    if 'grappelli' in settings.INSTALLED_APPS:
        template = 'nesting/admin/inlines/polymorphic_grappelli_stacked.html'
    else:
        template = 'nesting/admin/inlines/polymorphic_stacked.html'


class NestedPolymorphicInlineSupportMixin(
        PolymorphicInlineSupportMixin, NestedModelAdminMixin):

    inline_admin_formset_helper_cls = NestedPolymorphicInlineAdminFormset

    def get_inline_formsets(self, request, formsets, inline_instances, obj=None, *args, **kwargs):
        return super(PolymorphicInlineSupportMixin, self).get_inline_formsets(
            request, formsets, inline_instances, obj, *args, **kwargs)


class NestedPolymorphicModelAdmin(NestedPolymorphicInlineSupportMixin, ModelAdmin):
    pass
