from django.contrib import admin
import nested_admin

from .models import (
    TopLevel, LevelOne, LevelOneA, LevelOneB, LevelTwo, LevelTwoC, LevelTwoD)


class LevelTwoInline(nested_admin.NestedStackedPolymorphicInline):
    model = LevelTwo
    extra = 0
    inline_classes = ("collapse", "open", "grp-collapse", "grp-open",)
    sortable_field_name = "position"

    class LevelTwoCInline(nested_admin.NestedStackedPolymorphicInline.Child):
        model = LevelTwoC

    class LevelTwoDInline(nested_admin.NestedStackedPolymorphicInline.Child):
        model = LevelTwoD

    child_inlines = (LevelTwoCInline, LevelTwoDInline)


class LevelOneInline(nested_admin.NestedStackedPolymorphicInline):
    model = LevelOne
    extra = 0
    inline_classes = ("collapse", "open", "grp-collapse", "grp-open",)
    sortable_field_name = "position"
    inlines = [LevelTwoInline]

    class LevelOneAInline(nested_admin.NestedStackedPolymorphicInline.Child):
        model = LevelOneA

    class LevelOneBInline(nested_admin.NestedStackedPolymorphicInline.Child):
        model = LevelOneB

    child_inlines = (LevelOneAInline, LevelOneBInline)


@admin.register(TopLevel)
class TopLevelAdmin(nested_admin.NestedPolymorphicModelAdmin):
    inlines = [LevelOneInline]
