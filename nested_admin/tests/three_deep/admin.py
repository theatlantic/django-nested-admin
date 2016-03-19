from django.contrib import admin
from nested_admin import NestedStackedInline, NestedModelAdmin

from .models import TopLevel, LevelOne, LevelTwo, LevelThree


class LevelThreeInline(NestedStackedInline):
    model = LevelThree
    extra = 1
    inline_classes = ("collapse", "open", "grp-collapse", "grp-open",)
    sortable_field_name = "position"


class LevelTwoInline(NestedStackedInline):
    model = LevelTwo
    extra = 1
    inlines = [LevelThreeInline]
    inline_classes = ("collapse", "open", "grp-collapse", "grp-open",)
    sortable_field_name = "position"


class LevelOneInline(NestedStackedInline):
    model = LevelOne
    extra = 1
    inlines = [LevelTwoInline]
    inline_classes = ("collapse", "open", "grp-collapse", "grp-open",)
    sortable_field_name = "position"


@admin.register(TopLevel)
class TopLevelAdmin(NestedModelAdmin):
    inlines = [LevelOneInline]
