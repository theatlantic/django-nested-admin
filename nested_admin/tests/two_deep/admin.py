from django.contrib import admin
from nested_admin import NestedStackedInline, NestedTabularInline, NestedModelAdmin

from .models import (
    StackedGroup,
    StackedSection,
    StackedItem,
    TabularGroup,
    TabularSection,
    TabularItem,
    SortableWithExtraRoot,
    SortableWithExtraChild,
)


class StackedItemInline(NestedStackedInline):
    model = StackedItem
    extra = 0
    sortable_field_name = "position"
    inline_classes = (
        "collapse",
        "open",
    )


class StackedSectionInline(NestedStackedInline):
    model = StackedSection
    extra = 0
    sortable_field_name = "position"
    inlines = [StackedItemInline]
    inline_classes = (
        "collapse",
        "open",
    )


@admin.register(StackedGroup)
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


@admin.register(TabularGroup)
class TabularGroupAdmin(NestedModelAdmin):
    inlines = [TabularSectionInline]


class SortableWithExtraChildInline(NestedStackedInline):
    model = SortableWithExtraChild
    extra = 2
    sortable_field_name = "position"
    inline_classes = (
        "collapse",
        "open",
    )
    sortable_excludes = ["foo"]


@admin.register(SortableWithExtraRoot)
class SortableWithExtraRootAdmin(NestedModelAdmin):
    inlines = [SortableWithExtraChildInline]
