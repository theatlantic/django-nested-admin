from django.conf import settings
from django.contrib import admin
from nested_admin import NestedStackedInline, NestedTabularInline, NestedModelAdmin

from .models import (
    WidgetsRoot, WidgetsM2M, WidgetsRelated1,
    WidgetsRelated2, WidgetsA, WidgetsB,
    WidgetsC0, WidgetsC1, WidgetsM2MTwo,
    WidgetMediaOrderRoot, WidgetMediaOrderA, WidgetMediaOrderB,
    WidgetMediaOrderC0, WidgetMediaOrderC1)


class WidgetsC0Inline(NestedStackedInline):
    model = WidgetsC0
    prepopulated_fields = {'slug': ('name', )}
    filter_horizontal = ['m2m']
    sortable_field_name = "position"
    extra = 0
    inline_classes = ("grp-collapse", "grp-open",)
    raw_id_fields = ['fk2', 'fk4', 'm2m_two', 'm2m_three']
    autocomplete_lookup_fields = {
        'fk': ['fk2'],
        'm2m': ['m2m_three'],
        'generic': [['relation_type', 'relation_id']],
    }
    autocomplete_fields = ['fk3']
    related_lookup_fields = {
        'fk': ['fk4'],
        'm2m': ['m2m_two'],
        'generic': [['content_type', 'object_id']],
    }


class WidgetsC1Inline(NestedTabularInline):
    model = WidgetsC1
    prepopulated_fields = {'slug': ('name', )}
    filter_horizontal = ['m2m']
    sortable_field_name = "position"
    extra = 0
    inline_classes = ("grp-collapse", "grp-open",)
    raw_id_fields = ['fk2', 'fk4', 'm2m_two']
    autocomplete_lookup_fields = {'fk': ['fk2']}
    autocomplete_fields = ['fk3']
    related_lookup_fields = {
        'fk': ['fk4'],
        'm2m': ['m2m_two'],
        'generic': [['content_type', 'object_id']],
    }


class WidgetsBInline(NestedStackedInline):
    model = WidgetsB
    inlines = [WidgetsC0Inline, WidgetsC1Inline]
    prepopulated_fields = {'slug': ('name', )}
    filter_horizontal = ['m2m']
    sortable_field_name = "position"
    extra = 1
    inline_classes = ("grp-collapse", "grp-open",)
    raw_id_fields = ['fk2', 'fk4', 'm2m_two', 'm2m_three']
    autocomplete_lookup_fields = {
        'fk': ['fk2'],
        'm2m': ['m2m_three'],
        'generic': [['relation_type', 'relation_id']],
    }
    autocomplete_fields = ['fk3']
    related_lookup_fields = {
        'fk': ['fk4'],
        'm2m': ['m2m_two'],
        'generic': [['content_type', 'object_id']],
    }


class WidgetsAInline(NestedStackedInline):
    model = WidgetsA
    inlines = [WidgetsBInline]
    prepopulated_fields = {'slug': ('name', )}
    filter_horizontal = ['m2m']
    sortable_field_name = "position"
    extra = 1
    inline_classes = ("grp-collapse", "grp-open",)
    raw_id_fields = ['fk2', 'fk4', 'm2m_two', 'm2m_three']
    autocomplete_lookup_fields = {
        'fk': ['fk2'],
        'm2m': ['m2m_three'],
        'generic': [['relation_type', 'relation_id']],
    }
    autocomplete_fields = ['fk3']
    related_lookup_fields = {
        'fk': ['fk4'],
        'm2m': ['m2m_two'],
        'generic': [['content_type', 'object_id']],
    }


@admin.register(WidgetsRoot)
class WidgetsRootAdmin(NestedModelAdmin):
    inlines = [WidgetsAInline]


admin.site.register(WidgetsRelated1, NestedModelAdmin)
admin.site.register(WidgetsM2M, NestedModelAdmin)
admin.site.register(WidgetsM2MTwo, NestedModelAdmin)


@admin.register(WidgetsRelated2)
class WidgetsRelated2Admin(NestedModelAdmin):
    ordering = ['-date_created']
    search_fields = ['name']


class WidgetMediaOrderC0Inline(NestedStackedInline):
    model = WidgetMediaOrderC0
    sortable_field_name = "position"
    extra = 0


class WidgetMediaOrderC1Inline(NestedTabularInline):
    model = WidgetMediaOrderC1
    prepopulated_fields = {'slug': ('name', )}
    filter_horizontal = ['m2m']
    extra = 0
    inline_classes = ("grp-collapse", "grp-open",)
    raw_id_fields = ['fk2']
    autocomplete_lookup_fields = {'fk': ['fk2']}
    autocomplete_fields = ['fk3']


class WidgetMediaOrderBInline(NestedStackedInline):
    model = WidgetMediaOrderB
    inlines = [WidgetMediaOrderC0Inline, WidgetMediaOrderC1Inline]
    sortable_field_name = "position"
    extra = 1
    inline_classes = ("grp-collapse", "grp-open",)


class WidgetMediaOrderAInline(NestedStackedInline):
    model = WidgetMediaOrderA
    inlines = [WidgetMediaOrderBInline]
    sortable_field_name = "position"
    extra = 1
    inline_classes = ("grp-collapse", "grp-open",)


@admin.register(WidgetMediaOrderRoot)
class WidgetMediaOrderRootAdmin(NestedModelAdmin):
    inlines = [WidgetMediaOrderAInline]
