from django.contrib import admin
from nested_admin import NestedStackedInline, NestedModelAdmin

from .models import (
    TestAdminWidgetsRoot, TestAdminWidgetsM2M, TestAdminWidgetsRelated1,
    TestAdminWidgetsRelated2, TestAdminWidgetsA, TestAdminWidgetsB,
    TestAdminWidgetsC0, TestAdminWidgetsC1)


class TestAdminWidgetsC0Inline(NestedStackedInline):
    model = TestAdminWidgetsC0
    prepopulated_fields = {'slug': ('name', )}
    filter_horizontal = ['m2m']
    sortable_field_name = "position"
    extra = 0
    inline_classes = ("collapse", "open", "grp-collapse", "grp-open",)
    raw_id_fields = ['fk2']
    autocomplete_lookup_fields = {'fk': ['fk2']}


class TestAdminWidgetsC1Inline(NestedStackedInline):
    model = TestAdminWidgetsC1
    prepopulated_fields = {'slug': ('name', )}
    filter_horizontal = ['m2m']
    extra = 0
    inline_classes = ("collapse", "open", "grp-collapse", "grp-open",)
    raw_id_fields = ['fk2']
    autocomplete_lookup_fields = {'fk': ['fk2']}


class TestAdminWidgetsBInline(NestedStackedInline):
    model = TestAdminWidgetsB
    inlines = [TestAdminWidgetsC0Inline, TestAdminWidgetsC1Inline]
    prepopulated_fields = {'slug': ('name', )}
    filter_horizontal = ['m2m']
    sortable_field_name = "position"
    extra = 1
    inline_classes = ("collapse", "open", "grp-collapse", "grp-open",)
    raw_id_fields = ['fk2']
    autocomplete_lookup_fields = {'fk': ['fk2']}


class TestAdminWidgetsAInline(NestedStackedInline):
    model = TestAdminWidgetsA
    inlines = [TestAdminWidgetsBInline]
    prepopulated_fields = {'slug': ('name', )}
    filter_horizontal = ['m2m']
    sortable_field_name = "position"
    extra = 1
    inline_classes = ("collapse", "open", "grp-collapse", "grp-open",)
    raw_id_fields = ['fk2']
    autocomplete_lookup_fields = {'fk': ['fk2']}


@admin.register(TestAdminWidgetsRoot)
class TestAdminWidgetsRootAdmin(NestedModelAdmin):
    inlines = [TestAdminWidgetsAInline]


admin.site.register(TestAdminWidgetsRelated1, NestedModelAdmin)
admin.site.register(TestAdminWidgetsRelated2, NestedModelAdmin)
admin.site.register(TestAdminWidgetsM2M, NestedModelAdmin)
