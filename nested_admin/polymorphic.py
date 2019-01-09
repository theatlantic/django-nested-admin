from __future__ import absolute_import
from django.conf import settings
from django.contrib.admin import ModelAdmin
from polymorphic.formsets import BasePolymorphicInlineFormSet
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
    pass


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
