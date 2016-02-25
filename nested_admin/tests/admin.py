from django.contrib import admin
from nested_admin import NestedStackedInline, NestedTabularInline, NestedModelAdmin

from .models import (
    StackedGroup, StackedSection, StackedItem,
    TabularGroup, TabularSection, TabularItem,
    TopLevel, LevelOne, LevelTwo, LevelThree,
    SortableWithExtraRoot, SortableWithExtraChild)


class StackedItemInline(NestedStackedInline):

    model = StackedItem
    extra = 0
    sortable_field_name = "position"
    inline_classes = ("collapse open",)


class StackedSectionInline(NestedStackedInline):

    model = StackedSection
    extra = 0
    sortable_field_name = "position"

    inlines = [StackedItemInline]
    inline_classes = ("collapse open",)


class StackedGroupAdmin(NestedModelAdmin):

    inlines = [StackedSectionInline]


class TabularItemInline(NestedTabularInline):

    model = TabularItem
    extra = 0
    sortable_field_name = "position"


class TabularSectionInline(NestedTabularInline):

    model = TabularSection
    extra = 0
    sortable_field_name = "position"
    inlines = [TabularItemInline]


class TabularGroupAdmin(NestedModelAdmin):

    inlines = [TabularSectionInline]


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


class TopLevelAdmin(NestedModelAdmin):

    inlines = [LevelOneInline]


class SortableWithExtraChildInline(NestedStackedInline):

    model = SortableWithExtraChild
    extra = 2
    sortable_field_name = "position"
    inline_classes = ("collapse open",)
    sortable_excludes = ['foo']


class SortableWithExtraRootAdmin(NestedModelAdmin):

    inlines = [SortableWithExtraChildInline]



admin.site.register(StackedGroup, StackedGroupAdmin)
admin.site.register(TabularGroup, TabularGroupAdmin)
admin.site.register(TopLevel, TopLevelAdmin)
admin.site.register(SortableWithExtraRoot, SortableWithExtraRootAdmin)
