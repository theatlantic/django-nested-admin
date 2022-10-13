import nested_admin
from django.contrib import admin

from .models import (
    Block,
    BlockMarkdown,
    BlockRadioGroup,
    BlockRadioButton,
    Questionnaire,
    SurveyStep,
)


class BlockRadioButtonInline(
    nested_admin.SortableHiddenMixin, nested_admin.NestedTabularInline
):
    model = BlockRadioButton
    inline_classes = (
        "collapse",
        "open",
        "grp-collapse",
        "grp-open",
    )
    extra = 0


class BlockInline(
    nested_admin.SortableHiddenMixin, nested_admin.NestedStackedPolymorphicInline
):
    model = Block
    inline_classes = (
        "collapse",
        "open",
        "grp-collapse",
        "grp-open",
    )
    extra = 0
    sortable_field_name = "position"

    class BlockMarkdownInline(nested_admin.NestedStackedPolymorphicInline.Child):
        model = BlockMarkdown

    class BlockRadioGroupInline(nested_admin.NestedStackedPolymorphicInline.Child):
        model = BlockRadioGroup
        inlines = [BlockRadioButtonInline]

    child_inlines = (
        BlockMarkdownInline,
        BlockRadioGroupInline,
    )


class SurveyStepInline(nested_admin.NestedStackedInline):
    model = SurveyStep
    inlines = [BlockInline]
    inline_classes = (
        "collapse",
        "open",
        "grp-collapse",
        "grp-open",
    )
    extra = 0
    sortable_field_name = "position"


@admin.register(Questionnaire)
class QuestionnaireAdmin(nested_admin.NestedPolymorphicModelAdmin):
    inlines = [SurveyStepInline]


@admin.register(SurveyStep)
class SurveyStepAdmin(nested_admin.NestedPolymorphicModelAdmin):
    inlines = [BlockInline]
