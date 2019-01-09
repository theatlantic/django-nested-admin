from __future__ import absolute_import
import json

from django.conf import settings
from django.contrib.admin import ModelAdmin
from django.utils.encoding import force_text
from polymorphic.formsets import (
    BasePolymorphicInlineFormSet, BasePolymorphicModelFormSet,
    BaseGenericPolymorphicInlineFormSet)
from polymorphic.models import PolymorphicModelBase, PolymorphicModel
from polymorphic.admin import (
    PolymorphicInlineModelAdmin, PolymorphicInlineAdminFormSet,
    PolymorphicInlineSupportMixin, GenericPolymorphicInlineModelAdmin)

from .compat import compat_rel_to
from .formsets import NestedInlineFormSetMixin, NestedBaseGenericInlineFormSetMixin
from .nested import (
    NestedModelAdminMixin,
    NestedInlineModelAdminMixin, NestedGenericInlineModelAdminMixin,
    NestedInlineAdminFormsetMixin)


def get_base_polymorphic_models(child_model):
    """
    First the first concrete model in the inheritance chain that inherited from the PolymorphicModel.
    """
    models = []
    for model in reversed(child_model.mro()):
        if (isinstance(model, PolymorphicModelBase)
                and model is not PolymorphicModel
                and not model._meta.abstract):
            models.append(model)
    return models


def get_child_polymorphic_models(model):
    models = []
    for m in model.__subclasses__():
        if (isinstance(model, PolymorphicModelBase)
                and model is not PolymorphicModel
                and not model._meta.abstract):
            models.append(model)
    return models


def get_polymorphic_related_models(model):
    return model()._get_inheritance_relation_fields_and_models().values()


def get_compatible_parents(model):
    compatibility_map = {}
    if not isinstance(model, PolymorphicModelBase):
        return compatibility_map
    related_models = [model] + list(get_polymorphic_related_models(model))
    for m in related_models:
        compatibility_map[m] = get_base_polymorphic_models(m)
    return compatibility_map
    # base_models = get_base_polymorphic_models(child_model)
    # compatible = set([])
    # for m in base_models:
    #     compatible |= set(m.__subclasses__())
    # return list(compatible)


def get_model_id(model_cls):
    opts = model_cls._meta
    return "%s-%s" % (opts.app_label, opts.model_name)


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

    def inline_formset_data(self):
        json_str = super(NestedPolymorphicInlineAdminFormset, self).inline_formset_data()
        data = json.loads(json_str)
        if getattr(self.formset, 'fk', None):
            formset_fk_model = compat_rel_to(self.formset.fk)
            parent_models = get_base_polymorphic_models(formset_fk_model)
        else:
            formset_fk_model = ''
            parent_models = []
            # compatible_parents = {}
        compatible_parents = get_compatible_parents(self.formset.model)
        sub_models = self.formset.model()._get_inheritance_relation_fields_and_models()
        data['nestedOptions'].update({
            'parentModel': get_model_id(formset_fk_model),
            'childModels': [get_model_id(m) for m in sub_models.values()],
            'parentModels': [get_model_id(m) for m in parent_models],
            'compatibleParents': {
                get_model_id(k): [get_model_id(m) for m in v]
                for k, v in compatible_parents.items()},
        })
        data['options'].update({
            'childTypes': [
                {
                    'type': get_model_id(model),
                    'name': force_text(model._meta.verbose_name),
                } for model in self.formset.child_forms.keys()
            ],
        })
        return json.dumps(data)


class NestedPolymorphicInlineModelAdmin(
        NestedInlineModelAdminMixin, PolymorphicInlineModelAdmin):

    formset = NestedBasePolymorphicInlineFormSet
    inline_admin_formset_helper_cls = NestedPolymorphicInlineAdminFormset

    class Child(NestedInlineModelAdminMixin, PolymorphicInlineModelAdmin.Child):
        formset = NestedBasePolymorphicInlineFormSet
        inline_admin_formset_helper_cls = NestedPolymorphicInlineAdminFormset

        def get_formset(self, request, obj=None, **kwargs):
            FormSet = BaseFormSet = kwargs.pop('formset', self.formset)

            if self.sortable_field_name:
                class FormSet(BaseFormSet):
                    sortable_field_name = self.sortable_field_name

            kwargs['formset'] = FormSet
            return super(PolymorphicInlineModelAdmin.Child, self).get_formset(request, obj, **kwargs)


class NestedStackedPolymorphicInline(NestedPolymorphicInlineModelAdmin):
    if 'grappelli' in settings.INSTALLED_APPS:
        template = 'nesting/admin/inlines/polymorphic_grappelli_stacked.html'
    else:
        template = 'nesting/admin/inlines/polymorphic_stacked.html'


class NestedBaseGenericPolymorphicInlineFormSet(
        NestedBaseGenericInlineFormSetMixin, BaseGenericPolymorphicInlineFormSet):
    pass


class NestedGenericPolymorphicInlineModelAdmin(
        NestedGenericInlineModelAdminMixin, GenericPolymorphicInlineModelAdmin):

    formset = NestedBaseGenericPolymorphicInlineFormSet
    inline_admin_formset_helper_cls = NestedPolymorphicInlineAdminFormset

    class Child(NestedGenericInlineModelAdminMixin, GenericPolymorphicInlineModelAdmin.Child):
        formset = NestedBaseGenericPolymorphicInlineFormSet
        inline_admin_formset_helper_cls = NestedPolymorphicInlineAdminFormset

        def get_formset(self, request, obj=None, **kwargs):
            FormSet = BaseFormSet = kwargs.pop('formset', self.formset)

            if self.sortable_field_name:
                class FormSet(BaseFormSet):
                    sortable_field_name = self.sortable_field_name

            kwargs['formset'] = FormSet
            return super(GenericPolymorphicInlineModelAdmin.Child, self).get_formset(
                request, obj, **kwargs)


class NestedGenericStackedPolymorphicInline(NestedGenericPolymorphicInlineModelAdmin):

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
