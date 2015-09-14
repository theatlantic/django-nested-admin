from django.contrib import admin
from nested_admin import NestedStackedInline, NestedAdmin

from .models import (
    Group, TestSection as Section, TestItem as Item,
    TopLevel, LevelOne, LevelTwo, LevelThree)


class ItemInline(NestedStackedInline):

    model = Item
    extra = 0
    sortable_field_name = "position"
    inline_classes = ("collapse open",)


class SectionInline(NestedStackedInline):

    model = Section
    extra = 0
    sortable_field_name = "position"

    inlines = [ItemInline]
    inline_classes = ("collapse open",)


class GroupAdmin(NestedAdmin):

    inlines = [SectionInline]


class LevelThreeInline(NestedStackedInline):

    model = LevelThree
    extra = 1
    inline_classes = ("collapse open grp-collapse grp-open",)


class LevelTwoInline(NestedStackedInline):

    model = LevelTwo
    extra = 1
    inlines = [LevelThreeInline]
    inline_classes = ("collapse open grp-collapse grp-open",)


class LevelOneInline(NestedStackedInline):

    model = LevelOne
    extra = 1
    inlines = [LevelTwoInline]
    inline_classes = ("collapse open grp-collapse grp-open",)


class TopLevelAdmin(NestedAdmin):

    inlines = [LevelOneInline]


admin.site.register(Group, GroupAdmin)
admin.site.register(TopLevel, TopLevelAdmin)
