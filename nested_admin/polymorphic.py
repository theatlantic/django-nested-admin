import json
import six

from django.conf import settings
from polymorphic.formsets import (
    BasePolymorphicInlineFormSet,
    BaseGenericPolymorphicInlineFormSet,
)
from polymorphic.models import PolymorphicModelBase, PolymorphicModel
from polymorphic.admin import (
    PolymorphicInlineModelAdmin,
    PolymorphicInlineAdminFormSet,
    PolymorphicInlineSupportMixin,
    GenericPolymorphicInlineModelAdmin,
)

from .formsets import NestedInlineFormSetMixin, NestedBaseGenericInlineFormSetMixin
from .nested import (
    NestedModelAdmin,
    NestedInlineModelAdminMixin,
    NestedGenericInlineModelAdminMixin,
    NestedInlineAdminFormsetMixin,
    NestedInlineAdminFormset,
)

if six.PY2:
    from django.utils.encoding import force_text as force_str
else:
    from django.utils.encoding import force_str


def get_base_polymorphic_models(child_model):
    models = []
    for model in reversed(child_model.mro()):
        if (
            isinstance(model, PolymorphicModelBase)
            and model is not PolymorphicModel
            and not model._meta.abstract
        ):
            models.append(model)
    return models


def get_child_polymorphic_models(model):
    models = []
    for m in model.__subclasses__():
        if (
            isinstance(model, PolymorphicModelBase)
            and model is not PolymorphicModel
            and not model._meta.abstract
        ):
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


def get_model_id(model_cls):
    opts = model_cls._meta
    return "{}-{}".format(opts.app_label, opts.model_name)


class NestedBasePolymorphicInlineFormSet(
    NestedInlineFormSetMixin, BasePolymorphicInlineFormSet
):
    pass


class NestedPolymorphicInlineAdminFormset(
    NestedInlineAdminFormsetMixin, PolymorphicInlineAdminFormSet
):
    def inline_formset_data(self):
        json_str = super().inline_formset_data()
        data = json.loads(json_str)
        if getattr(self.formset, "fk", None):
            formset_fk_model = self.formset.fk.remote_field.model
            parent_models = get_base_polymorphic_models(formset_fk_model)
        else:
            formset_fk_model = ""
            parent_models = []
        compatible_parents = get_compatible_parents(self.formset.model)
        sub_models = self.formset.model()._get_inheritance_relation_fields_and_models()
        data["nestedOptions"].update(
            {
                "parentModel": get_model_id(formset_fk_model),
                "childModels": [get_model_id(m) for m in sub_models.values()],
                "parentModels": [get_model_id(m) for m in parent_models],
                "compatibleParents": {
                    get_model_id(k): [get_model_id(m) for m in v]
                    for k, v in compatible_parents.items()
                },
            }
        )
        if hasattr(self.formset, "child_forms"):
            data["options"].update(
                {
                    "childTypes": [
                        {
                            "type": get_model_id(model),
                            "name": force_str(model._meta.verbose_name),
                        }
                        for model in self.formset.child_forms.keys()
                    ],
                }
            )
        return json.dumps(data)


class NestedPolymorphicAdminFormsetHelperMixin:
    @staticmethod
    def inline_admin_formset_helper_cls(
        inline, formset, fieldsets, prepopulated, readonly, *args, **kwargs
    ):
        if hasattr(formset, "child_forms"):
            cls = NestedPolymorphicInlineAdminFormset
        else:
            cls = NestedInlineAdminFormset
        return cls(inline, formset, fieldsets, prepopulated, readonly, *args, **kwargs)


class NestedPolymorphicInlineModelAdminMixin(
    NestedPolymorphicAdminFormsetHelperMixin, NestedInlineModelAdminMixin
):
    pass


class NestedPolymorphicInlineModelAdmin(
    NestedPolymorphicInlineModelAdminMixin, PolymorphicInlineModelAdmin
):

    formset = NestedBasePolymorphicInlineFormSet

    class Child(
        NestedPolymorphicInlineModelAdminMixin, PolymorphicInlineModelAdmin.Child
    ):
        formset = NestedBasePolymorphicInlineFormSet

        def get_formset(self, request, obj=None, **kwargs):
            FormSet = BaseFormSet = kwargs.pop("formset", self.formset)

            if self.sortable_field_name:

                class FormSet(BaseFormSet):
                    sortable_field_name = self.sortable_field_name

            kwargs["formset"] = FormSet
            return super(PolymorphicInlineModelAdmin.Child, self).get_formset(
                request, obj, **kwargs
            )


class NestedStackedPolymorphicInline(NestedPolymorphicInlineModelAdmin):
    if "grappelli" in settings.INSTALLED_APPS:
        template = "nesting/admin/inlines/polymorphic_grappelli_stacked.html"
    else:
        template = "nesting/admin/inlines/polymorphic_stacked.html"


class NestedBaseGenericPolymorphicInlineFormSet(
    NestedBaseGenericInlineFormSetMixin, BaseGenericPolymorphicInlineFormSet
):
    pass


class NestedGenericPolymorphicInlineModelAdmin(
    NestedGenericInlineModelAdminMixin, GenericPolymorphicInlineModelAdmin
):

    formset = NestedBaseGenericPolymorphicInlineFormSet

    class Child(
        NestedGenericInlineModelAdminMixin, GenericPolymorphicInlineModelAdmin.Child
    ):
        formset = NestedBaseGenericPolymorphicInlineFormSet

        def get_formset(self, request, obj=None, **kwargs):
            FormSet = BaseFormSet = kwargs.pop("formset", self.formset)

            if self.sortable_field_name:

                class FormSet(BaseFormSet):
                    sortable_field_name = self.sortable_field_name

            kwargs["formset"] = FormSet
            return super(GenericPolymorphicInlineModelAdmin.Child, self).get_formset(
                request, obj, **kwargs
            )


class NestedGenericStackedPolymorphicInline(NestedGenericPolymorphicInlineModelAdmin):

    if "grappelli" in settings.INSTALLED_APPS:
        template = "nesting/admin/inlines/polymorphic_grappelli_stacked.html"
    else:
        template = "nesting/admin/inlines/polymorphic_stacked.html"


# django-polymorphic expects the parent admin to extend PolymorphicInlineSupportMixin,
# but we don't need the downcast method of that mixin, so we skip it by calling
# its super
class NestedPolymorphicInlineSupportMixin(
    NestedPolymorphicAdminFormsetHelperMixin, PolymorphicInlineSupportMixin
):
    def get_inline_formsets(
        self, request, formsets, inline_instances, obj=None, *args, **kwargs
    ):
        return super(PolymorphicInlineSupportMixin, self).get_inline_formsets(
            request, formsets, inline_instances, obj, *args, **kwargs
        )


class NestedPolymorphicModelAdmin(
    NestedPolymorphicInlineSupportMixin, NestedModelAdmin
):
    pass
