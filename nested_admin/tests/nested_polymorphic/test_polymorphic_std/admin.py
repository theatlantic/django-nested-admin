from django.contrib import admin
import nested_admin

from .models import (
    TopLevel, LevelOne, LevelOneA, LevelOneB, LevelTwo, LevelTwoC, LevelTwoD,
    ALevelTwo, ALevelTwoC, ALevelTwoD, BLevelTwo, BLevelTwoC, BLevelTwoD)


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


class ALevelTwoInline(nested_admin.NestedStackedPolymorphicInline):
    model = ALevelTwo
    extra = 0
    inline_classes = ("collapse", "open", "grp-collapse", "grp-open",)
    sortable_field_name = "position"

    class ALevelTwoCInline(nested_admin.NestedStackedPolymorphicInline.Child):
        model = ALevelTwoC

    class ALevelTwoDInline(nested_admin.NestedStackedPolymorphicInline.Child):
        model = ALevelTwoD

    child_inlines = (ALevelTwoCInline, ALevelTwoDInline)


class BLevelTwoInline(nested_admin.NestedStackedPolymorphicInline):
    model = BLevelTwo
    extra = 0
    inline_classes = ("collapse", "open", "grp-collapse", "grp-open",)
    sortable_field_name = "position"

    class BLevelTwoCInline(nested_admin.NestedStackedPolymorphicInline.Child):
        model = BLevelTwoC

    class BLevelTwoDInline(nested_admin.NestedStackedPolymorphicInline.Child):
        model = BLevelTwoD

    child_inlines = (BLevelTwoCInline, BLevelTwoDInline)


class LevelOneInline(nested_admin.NestedStackedPolymorphicInline):
    model = LevelOne
    extra = 0
    inline_classes = ("collapse", "open", "grp-collapse", "grp-open",)
    sortable_field_name = "position"
    inlines = [LevelTwoInline]

    class LevelOneAInline(nested_admin.NestedStackedPolymorphicInline.Child):
        model = LevelOneA
        inlines = [ALevelTwoInline]

    class LevelOneBInline(nested_admin.NestedStackedPolymorphicInline.Child):
        model = LevelOneB
        inlines = [BLevelTwoInline]

    child_inlines = (LevelOneAInline, LevelOneBInline)


@admin.register(TopLevel)
class TopLevelAdmin(nested_admin.NestedPolymorphicModelAdmin):
    inlines = [LevelOneInline]
