from django.contrib import admin

from nested_admin import NestedModelAdmin, NestedStackedInline, NestedTabularInline

from .models import CuratedGroupCollection, CuratedGroup, CuratedList, CuratedItem


class CuratedItemInline(NestedTabularInline):

    model = CuratedItem
    sortable_field_name = 'position'
    extra = 0
    inline_classes = ['grp-open']


class CuratedListInline(NestedStackedInline):

    model = CuratedList
    sortable_field_name = 'position'
    inlines = [CuratedItemInline]
    min_num = 1
    extra = 0
    inline_classes = ['grp-open']


class CuratedGroupInline(NestedStackedInline):

    inlines = [CuratedListInline]
    model = CuratedGroup
    sortable_field_name = 'position'
    extra = 0
    inline_classes = ['grp-open']


@admin.register(CuratedGroupCollection)
class CuratedGroupCollection(NestedModelAdmin):

    inlines = [CuratedGroupInline]
