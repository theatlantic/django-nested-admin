from django.contrib import admin
from nested_admin import NestedStackedInline, NestedTabularInline, NestedModelAdmin

from .models import (
    StackedGroup, StackedSection, StackedItem,
    TabularGroup, TabularSection, TabularItem,
    TopLevel, LevelOne, LevelTwo, LevelThree,
    SortableWithExtraRoot, SortableWithExtraChild,
    TestAdminWidgetsRoot, TestAdminWidgetsRelated, TestAdminWidgetsM2M,
    TestAdminWidgetsA, TestAdminWidgetsB, TestAdminWidgetsC0, TestAdminWidgetsC1)


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
    sortable_field_name = "position"


class LevelTwoInline(NestedStackedInline):

    model = LevelTwo
    extra = 1
    inlines = [LevelThreeInline]
    inline_classes = ("collapse open grp-collapse grp-open",)
    sortable_field_name = "position"


class LevelOneInline(NestedStackedInline):

    model = LevelOne
    extra = 1
    inlines = [LevelTwoInline]
    inline_classes = ("collapse open grp-collapse grp-open",)
    sortable_field_name = "position"


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


class TestAdminWidgetsC0Inline(NestedStackedInline):

    model = TestAdminWidgetsC0
    prepopulated_fields = {'slug': ('name', )}
    filter_horizontal = ['m2m']
    sortable_field_name = "position"
    extra = 0
    inline_classes = ("collapse", "open", "grp-collapse", "grp-open",)


class TestAdminWidgetsC1Inline(NestedStackedInline):

    model = TestAdminWidgetsC1
    prepopulated_fields = {'slug': ('name', )}
    filter_horizontal = ['m2m']
    sortable_field_name = "position"
    extra = 0
    inline_classes = ("collapse", "open", "grp-collapse", "grp-open",)


class TestAdminWidgetsBInline(NestedStackedInline):

    model = TestAdminWidgetsB
    inlines = [TestAdminWidgetsC0Inline, TestAdminWidgetsC1Inline]
    prepopulated_fields = {'slug': ('name', )}
    filter_horizontal = ['m2m']
    sortable_field_name = "position"
    extra = 1
    inline_classes = ("collapse", "open", "grp-collapse", "grp-open",)


class TestAdminWidgetsAInline(NestedStackedInline):

    model = TestAdminWidgetsA
    inlines = [TestAdminWidgetsBInline]
    prepopulated_fields = {'slug': ('name', )}
    filter_horizontal = ['m2m']
    sortable_field_name = "position"
    extra = 1
    inline_classes = ("collapse", "open", "grp-collapse", "grp-open",)


class TestAdminWidgetsRootAdmin(NestedModelAdmin):

    inlines = [TestAdminWidgetsAInline]


admin.site.register(StackedGroup, StackedGroupAdmin)
admin.site.register(TabularGroup, TabularGroupAdmin)
admin.site.register(TopLevel, TopLevelAdmin)
admin.site.register(SortableWithExtraRoot, SortableWithExtraRootAdmin)
admin.site.register(TestAdminWidgetsRoot, TestAdminWidgetsRootAdmin)
admin.site.register(TestAdminWidgetsRelated, NestedModelAdmin)
admin.site.register(TestAdminWidgetsM2M, NestedModelAdmin)
